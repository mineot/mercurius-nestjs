import { hideBin } from 'yargs/helpers';
import { Logger } from './helpers/logger';
import { PrismaClient, Token } from '@prisma/client';
import * as dotenv from 'dotenv';
import yargs from 'yargs';

dotenv.config();

const main = yargs(hideBin(process.argv));

main.scriptName('get_public_token');
main.usage('$0 <cmd> [args]');
main.epilogue('Get a public token for issuer if exists');

const options: any = {
  issuer: {
    type: 'string',
    describe: 'Inform the issuer to get a public token, it should be between quotes',
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
      const token: Token = await prisma.token.findFirst({
        where: { issuer },
      });

      if (!token) {
        Logger.warn(`Token not found for issuer "${issuer}"`);
      }

      Logger.success(`Token found for issuer "${issuer}": ${token?.value}`);
    } finally {
      prisma.$disconnect();
    }
  },
);

main.help().argv;
