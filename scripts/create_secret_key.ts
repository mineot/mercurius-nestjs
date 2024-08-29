import { hideBin } from 'yargs/helpers';
import { Logger } from './helpers/logger';
import * as crypto from 'crypto';
import yargs from 'yargs';

const main = yargs(hideBin(process.argv));

main.scriptName('create_secret_key');
main.usage('$0 <cmd> [args]');
main.epilogue('Generate a random secret key');

main.command('*', 'Perform user actions', async () => {
  try {
    const random = crypto.randomBytes(64).toString('hex');
    Logger.success(random);
  } catch (err) {
    Logger.fail(err);
  }
});

main.help().argv;
