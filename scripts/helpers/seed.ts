import { Logger } from './logger';

export class Seed {
  private $title = 'Seed';
  private $description = 'Seed Description';

  private $invalid = 'Invalid';
  private $success = 'Success';
  private $finish = 'Finish';

  private $validate: () => Promise<boolean> = async () => false;
  private $command: () => Promise<void> = async () => {};

  title(title: string) {
    this.$title = title;
  }

  description(description: string) {
    this.$description = description;
  }

  invalid(msg: string) {
    this.$invalid = msg;
  }

  success(msg: string) {
    this.$success = msg;
  }

  finish(finish: string) {
    this.$finish = finish;
  }

  validate(fn: () => Promise<boolean>) {
    this.$validate = fn;
  }

  command(fn: () => Promise<void>) {
    this.$command = fn;
  }

  async run(): Promise<void> {
    try {
      Logger.title(this.$title);
      Logger.description(this.$description);
      Logger.breakline();
      
      if (await this.$validate()) {
        Logger.warn(this.$invalid);
      } else {
        this.$command();
        Logger.done(this.$success);
      }
    } catch (err) {
      Logger.fail(err);
    } finally {
      Logger.breakline();
      Logger.end(this.$finish);
    }
  }
}
