import { hideBin } from 'yargs/helpers';
import { Logger } from '../helpers/logger';
import { PrismaClient, Token } from '@prisma/client';
import yargs from 'yargs';

yargs(hideBin(process.argv))
  .scriptName('unrevoke_public_token')
  .usage('$0 <cmd> [args]')
  .epilogue('Unrevoke public token for issuer if exists')
  .command(
    '*',
    'Perform user actions',
    (yargs) => {
      return yargs.option('issuer', {
        type: 'string',
        describe:
          'Inform the issuer to unrevoke the public token, it should be between quotes',
        demandOption: true,
      });
    },
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

        Logger.done('Unrevoked Public Token:');
        Logger.done(`Issuer: ${token.issuer}`);
        Logger.done(`Token: ${token.value}`);
        Logger.done(`Revoked: ${token.revoked ? 'Yes' : 'No'}`);
        Logger.done(`Revoked At: ${token.revoke_at}`);
        Logger.done(`Revoked Days: ${token.revoke_days}`);
      } catch (err) {
        Logger.fail(err.message);
      } finally {
        prisma.$disconnect();
      }
    },
  )
  .help().argv;
