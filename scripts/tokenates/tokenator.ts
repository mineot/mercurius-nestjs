import { Command, Target, Tokenator } from './contract';
import { hideBin } from 'yargs/helpers';
import { Logger } from '../logger';
import { PrismaClient, Token } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import { validator } from './validator';
import yargs from 'yargs';

import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

dotenv.config();

yargs(hideBin(process.argv))
  .scriptName('tokenator')
  .usage('$0 <cmd> [args]')
  .command(
    '*',
    'Perform user actions',
    (yargs) => {
      return yargs
        .option('target', {
          type: 'string',
          describe: 'Inform the target to execute',
          choices: Object.values(Target),
          demandOption: true,
        })
        .option('cmd', {
          type: 'string',
          describe: 'Inform the command to execute',
          choices: Object.values(Command),
          demandOption: true,
        })
        .option('message', {
          type: 'string',
          describe: 'Inform a message between quotes',
          demandOption: false,
        })
        .option('issuer', {
          type: 'string',
          describe: 'Inform a issuer',
          demandOption: false,
        })
        .option('days', {
          type: 'number',
          describe: 'Inform a revoke days',
          demandOption: false,
        });
    },
    async (argv) => {
      const tokenator: Tokenator = {
        target: argv.target as Target,
        cmd: argv.cmd as Command,
        message: argv.message as string,
        issuer: argv.issuer as string,
        days: argv.days as number,
      };

      await validator(tokenator);
      await createRandomSecretKey(tokenator);
      await createPublicToken(tokenator);
      await revokePublicToken(tokenator);
    },
  )
  .help().argv;

async function createRandomSecretKey({ target, cmd, message }: Tokenator) {
  if (target === Target.SECRET_KEY && cmd === Command.CREATE) {
    const data = {
      id: uuid(),
      date: new Date().getDate(),
      message,
    };

    Logger.success('Generated random secret key:', true);
    Logger.success(btoa(JSON.stringify(data)));
  }
}

async function createPublicToken({ target, cmd, issuer }: Tokenator) {
  if (target === Target.PUBLIC_TOKEN && cmd === Command.CREATE) {
    const prisma = new PrismaClient();

    try {
      const exists: number = await prisma.token.count({
        where: { issuer },
      });

      if (exists > 0) {
        Logger.warning(`The token for issuer ${issuer} already exists`);
      }

      const payload = {
        date: new Date().toISOString(),
        iss: issuer,
        sub: 'public_access',
        aud: 'guest',
      };

      const token: string = jwt.sign(payload, process.env.JWT_SECRET, {});

      await prisma.token.create({
        data: {
          id: undefined,
          value: token,
          issuer,
        },
      });

      Logger.success('Generated public access token:', true);
      Logger.success(token);
    } catch (err) {
      Logger.fail(err.message);
    } finally {
      prisma.$disconnect();
    }
  }
}

async function revokePublicToken({ target, cmd, issuer, days }: Tokenator) {
  if (target === Target.PUBLIC_TOKEN && cmd === Command.REVOKE) {
    const prisma = new PrismaClient();

    try {
      const token: Token = await prisma.token.findFirst({
        where: { issuer, revoked: false },
      });

      if (!token) {
        Logger.warning(
          `Token not found or already revoked for issuer ${issuer}`,
        );
      }

      token.revoked = true;
      token.revoke_at = new Date();
      token.revoke_days = days;

      const revokedToken: Token = await prisma.token.update({
        where: { id: token.id },
        data: token,
      });

      Logger.success('Revoked public access token:', true);
      Logger.success(JSON.stringify(revokedToken));
    } catch (err) {
      Logger.fail(err.message);
    } finally {
      prisma.$disconnect();
    }
  }
}
