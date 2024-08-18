import { Logger } from '../logger';
import { Command, Target, Tokenator } from './contract';

export async function validator(tokenator: Tokenator): Promise<boolean> {
  await validateRandomSecretKey(tokenator);
  await validatePublicToken(tokenator);
  await validateRevokePublicToken(tokenator);
  return true;
}

async function validateRandomSecretKey({ target, cmd, message }: Tokenator) {
  if (target === Target.SECRET_KEY && cmd === Command.CREATE && !message) {
    Logger.warning(
      'Please inform the "message" parameter to create the secret key',
    );
  }
}

async function validatePublicToken({ target, cmd, issuer }: Tokenator) {
  if (target === Target.PUBLIC_TOKEN && cmd === Command.CREATE && !issuer) {
    Logger.warning(
      'Please inform the "issuer" parameter to create a public token',
    );
  }
}

async function validateRevokePublicToken(tokenator: Tokenator) {
  const { target, cmd, issuer, days } = tokenator;

  let invalid = target === Target.PUBLIC_TOKEN && cmd === Command.REVOKE;

  invalid = invalid && !issuer && !days;

  if (invalid) {
    Logger.warning(
      'Please inform the "issuer" and "revoke_days" parameter to revoke a public token',
    );
  }
}
