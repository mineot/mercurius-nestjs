import { hideBin } from 'yargs/helpers';
import { Logger } from './helpers/logger_tokenator';
import { PrismaClient, Token } from '@prisma/client';
import yargs from 'yargs';

yargs(hideBin(process.argv))
  .scriptName('revoke_public_token')
  .usage('$0 <cmd> [args]')
  .epilogue('Revoke public token for issuer if exists')
  .command(
    '*',
    'Perform user actions',
    (yargs) => {
      return yargs
        .option('issuer', {
          type: 'string',
          describe:
            'Inform the issuer to revoke the public token, it should be between quotes',
          demandOption: true,
        })
        .option('days', {
          type: 'number',
          describe: 'Inform the days to keep the public token',
          demandOption: true,
        });
    },
    async (argv) => {
      const { issuer, days } = argv;

      const prisma = new PrismaClient();

      try {
        let token: Token = await prisma.token.findFirst({
          where: { issuer },
        });

        if (!token) {
          Logger.warning(`Token not found for issuer "${issuer}"`);
        }

        token = await prisma.token.update({
          where: { id: token.id },
          data: {
            revoked: true,
            revoke_at: new Date(),
            revoke_days: days,
          },
        });

        Logger.success('Revoked Public Token:', true);
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
