import { hideBin } from 'yargs/helpers';
import { Logger } from './helpers/logger';
import { PrismaClient, Token } from '@prisma/client';
import * as dotenv from 'dotenv';
import yargs from 'yargs';

dotenv.config();

const main = yargs(hideBin(process.argv));

main.scriptName('revoke_public_token');
main.usage('$0 <cmd> [args]');
main.epilogue('Revoke public token for issuer if exists');

const options: any = {
  issuer: {
    type: 'string',
    describe: 'Inform the issuer to revoke the public token, it should be between quotes',
    demandOption: true,
  },
  days: {
    type: 'number',
    describe: 'Inform the number of days to revoke the public token',
    demandOption: true,
  },
};

main.command(
  '*',
  'Perform user actions',
  (yargs) => yargs.options(options),
  async (argv) => {
    const { issuer, days } = argv;

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
          revoked: true,
          revoke_at: new Date(),
          revoke_days: days,
        },
      });

      Logger.success(`Token revoked for issuer "${issuer}"`);
    } finally {
      prisma.$disconnect();
    }
  },
);

main.help().argv;
