import { Logger } from '../helpers/logger';
import { PrismaClient, Token } from '@prisma/client';
import { Tokenator } from '../helpers/tonekator';

class RevokePublicToken extends Tokenator {
  constructor() {
    super();

    this.init('revoke_public_token', 'Revoke public token for issuer if exists');

    this.addOption('issuer', {
      type: 'string',
      describe: 'Inform the issuer to revoke the public token, it should be between quotes',
      demandOption: true,
    });

    this.addOption('days', {
      type: 'number',
      describe: 'Inform the days to keep the public token',
      demandOption: true,
    });
  }

  start(): Promise<void> {
    Logger.start('Revoking Public Token');
    return;
  }

  finish(): Promise<void> {
    Logger.finish('Finished Public Token Revocation');
    return;
  }

  async commands(argv: any): Promise<void> {
    const { issuer, days } = argv;

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
          revoked: true,
          revoke_at: new Date(),
          revoke_days: days,
        },
      });

      Logger.done('Revoked Public Token:');
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
