import { Logger } from '../helpers/logger';
import { PrismaClient, Token } from '@prisma/client';
import { Tokenator } from '../helpers/tonekator';

class GetPublicToken extends Tokenator {
  constructor() {
    super();

    this.init('get_public_token', 'Recovery public token for issuer if exists');

    this.addOption('issuer', {
      type: 'string',
      describe: 'Inform the issuer to recovery a public token, it should be between quotes',
      demandOption: true,
    });
  }

  start(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  finish(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async commands(argv: any): Promise<void> {
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

      return;
    } finally {
      prisma.$disconnect();
    }
  }
}

const getPublicToken = new GetPublicToken();
getPublicToken.run();
