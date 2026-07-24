import crypto from 'crypto';

// 1. Server-only protection guard
if (typeof window !== 'undefined') {
  throw new Error('Crypto utilities can only be executed on the server side.');
}

// 2. Encryption key validation (fail-fast on missing or invalid key)
function getEncryptionKey(): Buffer {
  const envKey = process.env.DOWNLOAD_TOKEN_ENCRYPTION_KEY;
  if (!envKey) {
    throw new Error('DOWNLOAD_TOKEN_ENCRYPTION_KEY environment variable is not defined.');
  }

  let keyBuffer: Buffer;
  // If base64 encoded string
  if (envKey.length !== 32 && /^[A-Za-z0-9+/=]+$/.test(envKey)) {
    keyBuffer = Buffer.from(envKey, 'base64');
  } else {
    keyBuffer = Buffer.from(envKey, 'utf-8');
  }

  if (keyBuffer.length !== 32) {
    throw new Error(
      `DOWNLOAD_TOKEN_ENCRYPTION_KEY must be exactly 32 bytes for AES-256. Current byte length: ${keyBuffer.length}`
    );
  }

  return keyBuffer;
}

const ALGORITHM = 'aes-256-gcm';

/**
 * Standard SHA-256 hash for download token verification.
 * Format: lowercase hexadecimal string
 */
export function hashToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex').toLowerCase();
}

/**
 * Encrypts a raw download token using AES-256-GCM.
 * Output format: v1.iv.authTag.ciphertext (hex encoded)
 */
export function encryptToken(rawToken: string): string {
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(12); // Cryptographically random unique 12-byte IV

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(rawToken, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return `v1.${iv.toString('hex')}.${authTag.toString('hex')}.${encrypted.toString('hex')}`;
}

/**
 * Decrypts an AES-256-GCM encrypted token.
 * Returns raw token string or null if invalid/corrupt payload.
 */
export function decryptToken(encryptedPayload: string | null | undefined): string | null {
  if (!encryptedPayload) return null;

  try {
    const parts = encryptedPayload.split('.');
    if (parts.length !== 4 || parts[0] !== 'v1') {
      return null;
    }

    const [, ivHex, authTagHex, ciphertextHex] = parts;
    const key = getEncryptionKey();
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const ciphertext = Buffer.from(ciphertextHex, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return decrypted.toString('utf8');
  } catch {
    return null;
  }
}
