import { hideBin } from 'yargs/helpers';
import { Logger } from './logger';
import * as dotenv from 'dotenv';
import yargs, { Options } from 'yargs';

dotenv.config();

export class Tokenator {
  private $scriptName = 'Tokenator';
  private $epilogue = 'Tokenator Script';
  private $options: any = {};
  private $start: string;
  private $finish: string;

  private $command: (argv: any) => Promise<any> = async (argv) => {};

  scriptName(scriptName: string) {
    this.$scriptName = scriptName;
  }

  epilogue(epilogue: string) {
    this.$epilogue = epilogue;
  }

  option(name: string, args: Options) {
    this.$options[name] = args;
  }

  start(start: string) {
    this.$start = start;
  }

  finish(finish: string) {
    this.$finish = finish;
  }

  command(fn: (argv: any) => Promise<any>) {
    this.$command = fn;
  }

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
          Logger.start(this.$start);
          await this.$command(argv);
        } catch (error) {
          Logger.fail(error);
        } finally {
          Logger.finish(this.$finish);
        }
      },
    );

    script.help().argv;
  }
}
