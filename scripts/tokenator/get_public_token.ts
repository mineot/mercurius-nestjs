import { hideBin } from 'yargs/helpers';
import { Logger } from '../helpers/logger';
import { PrismaClient, Token } from '@prisma/client';
import yargs from 'yargs';

yargs(hideBin(process.argv))
  .scriptName('get_public_token')
  .usage('$0 <cmd> [args]')
  .epilogue('Recovery public token for issuer if exists')
  .command(
    '*',
    'Perform user actions',
    (yargs) => {
      return yargs.option('issuer', {
        type: 'string',
        describe:
          'Inform the issuer to recovery a public token, it should be between quotes',
        demandOption: true,
      });
    },
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

        Logger.done('Public Token:');
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
