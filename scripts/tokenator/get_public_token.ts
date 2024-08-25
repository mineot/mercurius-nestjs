import { Logger } from '../helpers/logger';
import { PrismaClient, Token } from '@prisma/client';
import { Tokenator } from '../helpers/tonekator';

const getPublicToken = new Tokenator();
getPublicToken.scriptName('get_public_token');
getPublicToken.epilogue('Recovery public token for issuer if exists');
getPublicToken.start('Recovering Public Token');
getPublicToken.finish('Finished Public Token Recovery');

getPublicToken.option('issuer', {
  type: 'string',
  describe: 'Inform the issuer to recovery a public token, it should be between quotes',
  demandOption: true,
});

getPublicToken.command(async (argv): Promise<void> => {
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
  } finally {
    prisma.$disconnect();
  }
});

getPublicToken.run();
