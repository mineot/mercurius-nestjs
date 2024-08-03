import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '@shared/services/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from '@shared/services/token.service';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule],
      providers: [TokenService, PrismaService],
    }).compile();

    service = module.get<TokenService>(TokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a random secret', async () => {
    const secret = await service.randomSecret('test message');
    expect(secret).toBeDefined();
    expect(typeof secret.secret).toBe('string');
    expect(secret.secret.length).toBeGreaterThan(0);
  });

  it('should include the message in the secret', async () => {
    const message = 'test message';
    const secret = await service.randomSecret(message);
    const data = JSON.parse(atob(secret.secret));
    expect(data.message).toBe(message);
  });

  it('should include a unique id in the secret', async () => {
    const secret1 = await service.randomSecret('test message');
    const secret2 = await service.randomSecret('test message');
    expect(secret1.secret).not.toBe(secret2.secret);
  });
});
