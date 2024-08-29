import { hideBin } from 'yargs/helpers';
import { Logger } from './helpers/logger';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';
import yargs from 'yargs';

dotenv.config();

const main = yargs(hideBin(process.argv));

main.scriptName('create_public_token');
main.usage('$0 <cmd> [args]');
main.epilogue('Create a public token to allow access to the public content');

const options: any = {
  issuer: {
    type: 'string',
    describe: 'Inform the issuer to generate a public token, it should be between quotes',
    demandOption: true,
  },
};

main.command(
  '*',
  'Perform user actions',
  (yargs) => yargs.options(options),
  async (argv) => {
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
        algorithm: 'HS512',
      });

      await prisma.token.create({
        data: {
          id: undefined,
          value: token,
          issuer: issuer as string,
        },
      });

      Logger.success(`The token for issuer "${issuer}" has been created: ${token}`);
    } finally {
      prisma.$disconnect();
    }
  },
);

main.help().argv;
