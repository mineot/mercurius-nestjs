import { hideBin } from 'yargs/helpers';
import { Logger } from './helpers/logger';
import { PrismaClient, Token } from '@prisma/client';
import * as dotenv from 'dotenv';
import yargs from 'yargs';

dotenv.config();

const main = yargs(hideBin(process.argv));

main.scriptName('unrevoke_public_token');
main.usage('$0 <cmd> [args]');
main.epilogue('Unrevoke public token for issuer if exists');

const options: any = {
  issuer: {
    type: 'string',
    describe: 'Inform the issuer to unrevoke the public token, it should be between quotes',
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
      let token: Token = await prisma.token.findFirst({
        where: { issuer },
      });

      if (!token) {
        Logger.warn(`Token not found for issuer "${issuer}"`);
      }

      token = await prisma.token.update({
        where: { id: token.id },
        data: {
          revoked: false,
          revoke_at: null,
          revoke_days: null,
        },
      });

      Logger.success(`Token for issuer "${issuer}" was successfully unrevoke`);
    } finally {
      prisma.$disconnect();
    }
  },
);

main.help().argv;
