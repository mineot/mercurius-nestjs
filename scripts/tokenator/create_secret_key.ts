import { Logger } from '../helpers/logger';
import { Tokenator } from '../helpers/tonekator';
import { v4 as uuid } from 'uuid';

class CreateSecretKey extends Tokenator {
  constructor() {
    super();

    this.init('create_secret_key', 'Generate a random secret keys');

    this.addOption('message', {
      type: 'string',
      describe: 'Inform a message to generate a secret key, it should be between quotes',
      demandOption: true,
    });
  }

  start(): Promise<void> {
    Logger.start('Generating Secret Key');
    return;
  }

  finish(): Promise<void> {
    Logger.finish('Finished Secret Key Generation');
    return;
  }

  commands(argv: any): Promise<void> {
    const { message } = argv;

    const data = {
      id: uuid(),
      date: new Date().getDate(),
      message,
    };

    Logger.done('Generated Secret Key:');
    Logger.done(btoa(JSON.stringify(data)));

    return;
  }
}

const createSecretKey = new CreateSecretKey();
createSecretKey.run();
