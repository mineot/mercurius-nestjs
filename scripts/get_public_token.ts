import { hideBin } from 'yargs/helpers';
import { Logger } from './logger';
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
          Logger.warning(`Token not found for issuer "${issuer}"`);
        }

        Logger.success('Public Token:', true);
        Logger.success(`Issuer: ${token.issuer}`);
        Logger.success(`Token: ${token.value}`);
        Logger.success(`Revoked: ${token.revoked ? 'Yes' : 'No'}`);
        Logger.success(`Revoked At: ${token.revoke_at}`);
        Logger.success(`Revoked Days: ${token.revoke_days}`);
      } catch (err) {
        Logger.fail(err.message);
      } finally {
        prisma.$disconnect();
      }
    },
  )
  .help().argv;
