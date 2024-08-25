import { Logger } from '../helpers/logger';
import { Tokenator } from '../helpers/tonekator';
import { v4 as uuid } from 'uuid';

const createSecretKey = new Tokenator();
createSecretKey.scriptName('create_secret_key');
createSecretKey.epilogue('Generate a random secret keys');
createSecretKey.start('Generating Secret Key');
createSecretKey.finish('Finished Secret Key Generation');

createSecretKey.option('message', {
  type: 'string',
  describe: 'Inform a message to generate a secret key, it should be between quotes',
  demandOption: true,
});

createSecretKey.command(async (argv: any): Promise<void> => {
  const { message } = argv;

  const data = {
    id: uuid(),
    date: new Date().getDate(),
    message,
  };

  Logger.done('Generated Secret Key:');
  Logger.done(btoa(JSON.stringify(data)));
});

createSecretKey.run();
