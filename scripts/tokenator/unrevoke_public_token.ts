import { Logger } from '../helpers/logger';
import { PrismaClient, Token } from '@prisma/client';
import { Tokenator } from '../helpers/tonekator';

const unrevokePublicToken = new Tokenator();
unrevokePublicToken.scriptName('unrevoke_public_token');
unrevokePublicToken.epilogue('Unrevoke public token for issuer if exists');
unrevokePublicToken.start('Unrevoking Public Token');
unrevokePublicToken.finish('Finished Public Token Unrevocation');

unrevokePublicToken.option('issuer', {
  type: 'string',
  describe: 'Inform the issuer to unrevoke the public token, it should be between quotes',
  demandOption: true,
});

unrevokePublicToken.command(async (argv): Promise<void> => {
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
  } finally {
    prisma.$disconnect();
  }
});

unrevokePublicToken.run();
