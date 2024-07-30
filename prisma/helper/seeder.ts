import { error, finish, info, start, success, warn } from './logger';

export abstract class Seeder {
  abstract startMessage(): string;
  abstract finishMessage(): string;
  abstract errorMessage(): string;

  abstract finish(): Promise<void>;
  abstract process(): Promise<void>;

  infoMesage(message: string, data?: any): void {
    info(message, data);
  }

  successMessage(message: string, data?: any): void {
    success(message, data);
  }

  warnMessage(message: string, data?: any): void {
    warn(message, data);
  }

  async seed(): Promise<void> {
    try {
      start(this.startMessage());
      await this.process();
    } catch (e) {
      error(this.errorMessage(), e);
      process.exit(1);
    } finally {
      await this.finish();
      finish(this.finishMessage());
    }
  }
}
