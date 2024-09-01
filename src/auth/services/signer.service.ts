import { Injectable } from '@nestjs/common';

@Injectable()
export class SignerService {
  async signIn(username: string, password: string): Promise<void> {
    // const user = await this.usersService.findByEmail(email);
    // if (user && user.password === password) {
    //   const isValidToken = this.twoFactorAuthService.verifyToken(
    //     user.twoFactorSecret,
    //     token,
    //   );
    //   if (isValidToken) {
    //     // RETURN JWT
    //   }
    // }
    // return null;
  }

  async signUp(username: string, password: string): Promise<void> {}

  async recoveryPassword(email: string): Promise<void> {}

  async changePassword(password: string): Promise<void> {}
}
