import { ConfigurationService } from '@/shared/services/configuration.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Logged, Login, Register } from '@/auth/services/contracts/auth.contract';
import { MessageContants } from '@/shared/constants/messages.contant';
import { TokenatorService } from '@/shared/core/tokenator.service';
import { TwoFactorService } from '@/auth/services/two-factor.service';
import { User } from '@prisma/client';
import { UserService } from '@/shared/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configurationService: ConfigurationService,
    private readonly tokenatorService: TokenatorService,
    private readonly twoFactorService: TwoFactorService,
    private readonly userService: UserService,
  ) {}

  async login(login: Login): Logged {
    const { email, password, token } = login;

    const user: User = await this.userService.findBy({ email });

    if (this.userService.validatePassword({ user, password })) {
      throw new UnauthorizedException(MessageContants.INVALID_CREDENTIALS);
    }

    if (this.configurationService.twoFactorAllowed()) {
      const isValidToken = await this.twoFactorService.verifyToken({
        secret: user.twoFactorSecret,
        token,
      });

      if (!isValidToken) {
        throw new UnauthorizedException(MessageContants.INVALID_CREDENTIALS);
      }
    }

    return { token: (await this.tokenatorService.create({ user })).jwtToken };
  }

  async register(register: Register): Promise<Logged> {
    const { name, email, password } = register;

    if (!this.configurationService.registerAllowed()) {
      throw new UnauthorizedException(MessageContants.REGISTER_NOT_ALLOWED);
    }

    if (this.userService.exists(email)) {
      throw new UnauthorizedException(MessageContants.USER_ALREADY_EXISTS);
    }

    const user: User = await this.userService.create({ name, email, password });

    return await this.login({
      email: user.email,
      password: user.password,
      token: undefined,
    });
  }

  async recoveryPassword(email: string): Promise<void> {}

  async changePassword(password: string): Promise<void> {}
}
