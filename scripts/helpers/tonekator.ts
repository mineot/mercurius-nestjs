import { hideBin } from 'yargs/helpers';
import { Logger } from './logger';
import * as dotenv from 'dotenv';
import yargs, { Options } from 'yargs';

dotenv.config();

export abstract class Tokenator {
  private $scriptName = 'Tokenator';
  private $epilogue = 'Tokenator Script';
  private $options: any = {};

  init(scriptName: string, epilogue: string) {
    this.$scriptName = scriptName;
    this.$epilogue = epilogue;
  }

  addOption(name: string, args: Options) {
    this.$options[name] = args;
  }

  abstract start(): Promise<void>;

  abstract finish(): Promise<void>;

  abstract commands(argv: any): Promise<void>;

  async run() {
    const script = yargs(hideBin(process.argv));

    script.scriptName(this.$scriptName);
    script.usage('$0 <cmd> [args]');
    script.epilogue(this.$epilogue);

    script.command(
      '*',
      'Perform user actions',
      (yargs) => yargs.options(this.$options),
      async (argv) => {
        try {
          await this.start();
          await this.commands(argv);
        } catch (error) {
          Logger.fail(error);
        } finally {
          await this.finish();
        }
      },
    );

    script.help().argv;
  }
}
