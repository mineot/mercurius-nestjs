import { hideBin } from 'yargs/helpers';
import { Logger } from './logger';
import { v4 as uuid } from 'uuid';
import yargs from 'yargs';

yargs(hideBin(process.argv))
  .scriptName('create_secret_key')
  .usage('$0 <cmd> [args]')
  .epilogue('Generate a random secret keys')
  .command(
    '*',
    'Perform user actions',
    (yargs) => {
      return yargs.option('message', {
        type: 'string',
        describe:
          'Inform a message to generate a secret key, it should be between quotes',
        demandOption: true,
      });
    },
    async (argv) => {
      const { message } = argv;

      const data = {
        id: uuid(),
        date: new Date().getDate(),
        message,
      };

      Logger.success('Generated Secret Key:', true);
      Logger.success(btoa(JSON.stringify(data)));
    },
  )
  .help().argv;
