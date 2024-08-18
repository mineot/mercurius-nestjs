import { hideBin } from 'yargs/helpers';
import { Logger } from './logger';
import { PrismaClient } from '@prisma/client';
import yargs from 'yargs';

import * as dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken';

dotenv.config();

yargs(hideBin(process.argv))
  .scriptName('create_public_token')
  .usage('$0 <cmd> [args]')
  .epilogue('Create a public token to allow access to the public content')
  .command(
    '*',
    'Perform user actions',
    (yargs) => {
      return yargs.option('issuer', {
        type: 'string',
        describe:
          'Inform the issuer to generate a public token, it should be between quotes',
        demandOption: true,
      });
    },
    async (argv) => {
      const { issuer } = argv;

      const prisma = new PrismaClient();

      try {
        const exists: number = await prisma.token.count({
          where: { issuer },
        });

        if (exists > 0) {
          Logger.warning(`The token for issuer "${issuer}" already exists`);
        }

        const payload = {
          date: new Date().toISOString(),
          iss: issuer,
          sub: 'public_access',
          aud: 'guest',
        };

        const token: string = jwt.sign(payload, process.env.JWT_SECRET, {
          algorithm: 'HS256',
        });

        await prisma.token.create({
          data: {
            id: undefined,
            value: token,
            issuer,
          },
        });

        Logger.success('Generated Public Token:', true);
        Logger.success(token);
      } catch (err) {
        Logger.fail(err.message);
      } finally {
        prisma.$disconnect();
      }
    },
  )
  .help().argv;
