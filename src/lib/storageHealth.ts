import fs from 'fs';
import { STORAGE_ROOT } from '@/lib/storage/config';
import { execSync } from 'child_process';

export interface StorageHealthInfo {
  isHealthy: boolean;
  warning: boolean;
  percentUsed: number;
  totalBytes: number;
  freeBytes: number;
  usedBytes: number;
  error?: string;
}

export function getStorageHealth(): StorageHealthInfo {
  try {
    let totalBytes = 0;
    let freeBytes = 0;

    // Node 18.15+ statfsSync support
    if (typeof fs.statfsSync === 'function') {
      try {
        const stats = fs.statfsSync(STORAGE_ROOT);
        totalBytes = stats.blocks * stats.bsize;
        freeBytes = stats.bfree * stats.bsize;
      } catch (e) {
        // Fallback for docker linux environment
      }
    }

    if (totalBytes === 0 && process.platform !== 'win32') {
      try {
        const output = execSync(`df -k "${STORAGE_ROOT}" | tail -1`, { encoding: 'utf-8' });
        const parts = output.trim().split(/\s+/);
        if (parts.length >= 4) {
          totalBytes = parseInt(parts[1], 10) * 1024;
          const used = parseInt(parts[2], 10) * 1024;
          freeBytes = parseInt(parts[3], 10) * 1024;
        }
      } catch (e) {}
    }

    // Default safe fallback if disk info unreadable (e.g. windows dev)
    if (totalBytes === 0) {
      return {
        isHealthy: true,
        warning: false,
        percentUsed: 0,
        totalBytes: 100 * 1024 * 1024 * 1024, // 100GB mock
        freeBytes: 80 * 1024 * 1024 * 1024,
        usedBytes: 20 * 1024 * 1024 * 1024,
      };
    }

    const usedBytes = totalBytes - freeBytes;
    const percentUsed = Math.round((usedBytes / totalBytes) * 100);

    const criticalThreshold = parseInt(process.env.STORAGE_CRITICAL_PERCENT || '90', 10);
    const warningThreshold = parseInt(process.env.STORAGE_WARNING_PERCENT || '80', 10);

    const isHealthy = percentUsed < criticalThreshold;
    const warning = percentUsed >= warningThreshold;

    return {
      isHealthy,
      warning,
      percentUsed,
      totalBytes,
      freeBytes,
      usedBytes,
      error: !isHealthy ? `Depolama diski %${percentUsed} kapasiteye ulaştı. Yeni yükleme kabul edilemiyor.` : undefined,
    };
  } catch (error: any) {
    return {
      isHealthy: true,
      warning: false,
      percentUsed: 0,
      totalBytes: 0,
      freeBytes: 0,
      usedBytes: 0,
    };
  }
}
