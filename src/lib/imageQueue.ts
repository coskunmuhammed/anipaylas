/**
 * Server-side Sharp image processing concurrency queue.
 * Limits simultaneous CPU/RAM intensive image processing jobs (default max 3).
 * Prevents node heap and Docker container memory spikes during high-volume guest uploads.
 */

class TaskQueue {
  private maxConcurrency: number;
  private runningCount = 0;
  private queue: (() => void)[] = [];

  constructor(maxConcurrency = 3) {
    this.maxConcurrency = maxConcurrency;
  }

  public async add<T>(task: () => Promise<T>): Promise<T> {
    if (this.runningCount >= this.maxConcurrency) {
      await new Promise<void>((resolve) => this.queue.push(resolve));
    }
    this.runningCount++;
    try {
      return await task();
    } finally {
      this.runningCount--;
      if (this.queue.length > 0) {
        const next = this.queue.shift();
        if (next) next();
      }
    }
  }

  public getStats() {
    return {
      running: this.runningCount,
      queued: this.queue.length,
      maxConcurrency: this.maxConcurrency,
    };
  }
}

const envLimit = parseInt(process.env.IMAGE_PROCESSING_CONCURRENCY || '3', 10);
const concurrency = isNaN(envLimit) || envLimit < 1 ? 3 : envLimit;

export const imageProcessingQueue = new TaskQueue(concurrency);
