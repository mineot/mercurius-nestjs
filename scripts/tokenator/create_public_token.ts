import { Logger } from '../helpers/logger';
import { PrismaClient } from '@prisma/client';
import { Tokenator } from '../helpers/tonekator';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

dotenv.config();

class CreatePublicToken extends Tokenator {
  constructor() {
    super();

    this.init('create_public_token', 'Create a public token to allow access to the public content');

    this.addOption('issuer', {
      type: 'string',
      describe: 'Inform the issuer to generate a public token, it should be between quotes',
      demandOption: true,
    });
  }

  start(): Promise<void> {
    Logger.start('Creating Public Token');
    return;
  }

  finish(): Promise<void> {
    Logger.finish('Finished Public Token Creation');
    return;
  }

  async commands(argv: any): Promise<void> {
    const { issuer } = argv;
    const prisma = new PrismaClient();

    try {
      const exists: number = await prisma.token.count({
        where: { issuer },
      });

      if (exists > 0) {
        Logger.warn(`The token for issuer "${issuer}" already exists`);
      }

      const payload = {
        date: new Date().toISOString(),
        iss: issuer,
        sub: 'public_access',
        aud: 'guest',
      };

      const token: string = jwt.sign(payload, process.env.JWT_SECRET, {
        algorithm: 'HS256',
      });

      await prisma.token.create({
        data: {
          id: undefined,
          value: token,
          issuer,
        },
      });

      Logger.done('Generated Public Token:');
      Logger.done(token);

      return;
    } finally {
      prisma.$disconnect();
    }
  }
}

const createPublicToken = new CreatePublicToken();
createPublicToken.run();
