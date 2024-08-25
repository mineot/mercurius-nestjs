import { Logger } from '../helpers/logger';
import { PrismaClient, Token } from '@prisma/client';
import { Tokenator } from '../helpers/tonekator';

class RemovePublicToken extends Tokenator {
  constructor() {
    super();

    this.init('remove_public_token', 'Remove public token for issuer if exists');

    this.addOption('issuer', {
      type: 'string',
      describe: 'Inform the issuer to remove the public token, it should be between quotes',
      demandOption: true,
    });
  }

  start(): Promise<void> {
    Logger.start('Removing Public Token');
    return;
  }

  finish(): Promise<void> {
    Logger.finish('Finished Public Token Removal');
    return;
  }

  async commands(argv: any): Promise<void> {
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

      return;
    } finally {
      prisma.$disconnect();
    }
  }
}

const removePublicToken = new RemovePublicToken();
removePublicToken.run();
