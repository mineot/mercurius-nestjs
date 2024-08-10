import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class Tokenator {
  @IsOptional()
  @IsBoolean()
  randomSecret?: boolean;

  @IsOptional()
  @IsBoolean()
  createPublicAccess?: boolean;

  @IsOptional()
  @IsBoolean()
  recoveryPublicAccess?: boolean;

  @IsOptional()
  @IsBoolean()
  revokePublicAccess?: boolean;

  @IsOptional()
  @IsBoolean()
  removeExpiredTokens?: boolean;

  @ValidateIf((o) => o.randomSecret)
  @IsString()
  message?: string;

  @ValidateIf((o) => {
    return (
      o.createPublicAccess || o.recoveryPublicAccess || o.revokePublicAccess
    );
  })
  @IsString()
  issuer?: string;

  @ValidateIf((o) => o.revokePublicAccess)
  @IsNumber()
  days?: number;
}
