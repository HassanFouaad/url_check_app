import Queue, { Job, DoneCallback } from "bull";
import { URLChecker } from "./URLCheck";
let task = new Queue("URL_CHECKS", {
  defaultJobOptions: {
    removeOnComplete: true,
  },
  redis: {
    host: process.env.REDIS_HOST as string,
    password: process.env.REDIS_PASSWORD as string,
  },
});

task.process(5, async (job: Job, done: DoneCallback) => {
  try {
    const { urlId } = job.data;

    let check = new URLChecker(urlId);
    await check.start();
    done();
  } catch (error) {
    done();
  }
});

export class Task {
  public task;
  constructor() {
    this.task = task;
  }

  async update(urlId: number, interval: number, oldInterval: number) {
    await this.delete(urlId, oldInterval);
    await this.create(urlId, interval);
  }

  async delete(urlId: number, interval: number) {
    await task.removeRepeatable({
      jobId: String(urlId),
      every: interval,
    });
  }
  async create(urlId: number, interval: number) {
    await task.add(
      { urlId },
      {
        repeat: { every: interval },
        lifo: true,
        jobId: String(urlId),
      }
    );
  }
}

let queueTasks = new Task();
export { queueTasks };
