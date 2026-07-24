import { prisma } from '@/lib/prisma';
import { hashToken, encryptToken, decryptToken } from '@/lib/crypto';
import { Prisma } from '@prisma/client';
import crypto from 'crypto';

// Server-only guard
if (typeof window !== 'undefined') {
  throw new Error('downloadLink.service can only be executed on the server side.');
}

function generateRandomToken(length = 16): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    token += chars[bytes[i] % chars.length];
  }
  return token;
}

export interface CreateOrRegenerateOptions {
  eventId: string;
  deliveryPackageId: string;
  expiresAt: Date;
  maxDownloadCount: number;
  passwordHash?: string | null;
  adminUserId?: string | null;
}

export interface DownloadLinkResult {
  success: boolean;
  rawToken: string;
  downloadLinkId: string;
  expiresAt: Date;
}

/**
 * Atomically creates or regenerates a download link for a given package.
 * Deactivates previous active links and guarantees single active link constraint.
 * Uses Serializable isolation level with retry loop for race condition protection.
 */
export async function createOrRegenerateDownloadLink(
  options: CreateOrRegenerateOptions
): Promise<DownloadLinkResult> {
  const { eventId, deliveryPackageId, expiresAt, maxDownloadCount, passwordHash, adminUserId } = options;

  const maxRetries = 3;
  let attempt = 0;

  while (attempt < maxRetries) {
    attempt++;
    try {
      const rawToken = generateRandomToken(16);
      const tokenHashVal = hashToken(rawToken);
      const tokenEncryptedVal = encryptToken(rawToken);

      const result = await prisma.$transaction(
        async (tx) => {
          // 1. Deactivate existing active links for this package
          await tx.downloadLink.updateMany({
            where: {
              deliveryPackageId,
              isActive: true,
            },
            data: {
              isActive: false,
              revokedAt: new Date(),
            },
          });

          // 2. Create new active link record
          const newLink = await tx.downloadLink.create({
            data: {
              eventId,
              deliveryPackageId,
              tokenHash: tokenHashVal,
              tokenEncrypted: tokenEncryptedVal,
              passwordHash: passwordHash || null,
              expiresAt,
              maxDownloadCount,
              isActive: true,
            },
          });

          // 3. Log audit event
          if (adminUserId) {
            await tx.auditLog.create({
              data: {
                adminUserId,
                action: 'CREATE_OR_REGENERATE_DOWNLOAD_LINK',
                entityType: 'DownloadLink',
                entityId: newLink.id,
                metadata: JSON.stringify({ packageId: deliveryPackageId, expiresAt: expiresAt.toISOString() }),
              },
            });
          }

          return newLink;
        },
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        }
      );

      // 4. Verify post-transaction condition: Exactly 1 active link for package
      const activeCount = await prisma.downloadLink.count({
        where: {
          deliveryPackageId,
          isActive: true,
        },
      });

      if (activeCount !== 1) {
        throw new Error(`Concurrency check failed: Expected 1 active link for package, found ${activeCount}`);
      }

      return {
        success: true,
        rawToken,
        downloadLinkId: result.id,
        expiresAt: result.expiresAt,
      };
    } catch (err: unknown) {
      // Retry on serialization failure or transaction conflict
      if (attempt >= maxRetries) {
        console.error(`[DownloadLinkService] Failed after ${attempt} attempts:`, err);
        throw err;
      }
      // Brief backoff before retry
      await new Promise((resolve) => setTimeout(resolve, 50 * attempt));
    }
  }

  throw new Error('Failed to create or regenerate download link due to concurrency conflicts.');
}

/**
 * Safely decrypts encrypted token for authorized admin rendering.
 */
export function getDecryptedToken(encryptedToken: string | null | undefined): string | null {
  return decryptToken(encryptedToken);
}
