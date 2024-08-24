import { hideBin } from 'yargs/helpers';
import { Logger } from '../helpers/logger';
import { PrismaClient, Token } from '@prisma/client';
import yargs from 'yargs';

yargs(hideBin(process.argv))
  .scriptName('remove_public_token')
  .usage('$0 <cmd> [args]')
  .epilogue('Remove public token for issuer if exists')
  .command(
    '*',
    'Perform user actions',
    (yargs) => {
      return yargs.option('issuer', {
        type: 'string',
        describe:
          'Inform the issuer to remove the public token, it should be between quotes',
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

        token = await prisma.token.delete({
          where: { id: token.id },
        });

        Logger.done('Removed Public Token:');
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
