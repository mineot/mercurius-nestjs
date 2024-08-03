import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { v4 as uudid } from 'uuid';

@Injectable()
export class TokenService {
  constructor(private readonly jwt: JwtService) {}

  async randomSecret(message: string): Promise<string> {
    const data = {
      id: uudid(),
      date: new Date().getDate(),
      message,
    };

    return btoa(JSON.stringify(data));
  }

  async generatePublicAccess(issuer: string): Promise<string> {
    return this.jwt.signAsync({
      date: new Date().toISOString(),
      iss: issuer,
      sub: 'public_access',
      aud: 'guest',
    });
  }

  async generateSignedUser(user: User): Promise<string> {
    return this.jwt.signAsync({
      username: user.name,
      email: user.email,
      iss: 'user',
      sub: user.id,
      aud: 'admin',
      exp: 86400, //24hrs
    });
  }

  async verify(token: string): Promise<any> {
    return this.jwt.verifyAsync(token);
  }
}
