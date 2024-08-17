import { hideBin } from 'yargs/helpers';
import { Logger } from './logger';
import { PrismaClient } from '@prisma/client';
import { v4 as uuid } from 'uuid';
import yargs from 'yargs';

import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

dotenv.config();

enum Target {
  SECRET_KEY = 'secret_key',
  PUBLIC_TOKEN = 'public_token',
}

enum Command {
  CREATE = 'create',
}

interface Tokenator {
  target: Target;
  cmd: Command;
  message?: string;
  issuer?: string;
  revoke?: boolean;
  revoke_days?: number;
}

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
        });
    },
    async (argv) => {
      const tokenator: Tokenator = {
        target: argv.target as Target,
        cmd: argv.cmd as Command,
        message: argv.message as string,
        issuer: argv.issuer as string,
        revoke: argv.revoke as boolean,
        revoke_days: argv.revoke_days as number,
      };

      await validator(tokenator);
      await createRandomSecretKey(tokenator);
      await createPublicToken(tokenator);
    },
  )
  .help().argv;

async function validator(tokenator: Tokenator): Promise<boolean> {
  const { target, cmd, message, issuer } = tokenator;

  if (target === Target.SECRET_KEY && cmd === Command.CREATE && !message) {
    Logger.warning(
      'Please inform the "message" parameter to create the secret key',
    );
  }

  if (target === Target.PUBLIC_TOKEN && cmd === Command.CREATE && !issuer) {
    Logger.warning(
      'Please inform the "issuer" parameter to create a public token',
    );
  }

  return true;
}

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
