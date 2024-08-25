import { Logger } from '../helpers/logger';
import { PrismaClient, Token } from '@prisma/client';
import { Tokenator } from '../helpers/tonekator';

const removePublicToken = new Tokenator();
removePublicToken.scriptName('remove_public_token');
removePublicToken.epilogue('Remove public token for issuer if exists');
removePublicToken.start('Removing Public Token');
removePublicToken.finish('Finished Public Token Removal');

removePublicToken.option('issuer', {
  type: 'string',
  describe: 'Inform the issuer to remove the public token, it should be between quotes',
  demandOption: true,
});

removePublicToken.command(async (argv): Promise<void> => {
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
  } finally {
    prisma.$disconnect();
  }
});

removePublicToken.run();
