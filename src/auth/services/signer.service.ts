import { Injectable } from '@nestjs/common';

@Injectable()
export class SignerService {
  async signIn(username: string, password: string): Promise<void> {}

  async signUp(username: string, password: string): Promise<void> {}

  async signOut(): Promise<void> {}

  async forgotPassword(email: string): Promise<void> {}

  async changePassword(password: string): Promise<void> {}

  async sendCode(): Promise<void> {}

  async validateCode(): Promise<void> {}
}
