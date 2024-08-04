import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from '@shared/services/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from '@shared/services/token.service';

describe('TokenService', () => {
  let service: TokenService;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: 'testSecret', // Adicionando a chave secreta
          signOptions: { expiresIn: '1h' },
        }),
      ],
      providers: [TokenService, PrismaService],
    }).compile();

    service = module.get<TokenService>(TokenService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);
  });

  it('should return a random secret', async () => {
    const message = 'hello world';
    const result = await service.randomSecret(message);

    expect(result.secret).toBeDefined();
    expect(result.secret).not.toEqual(message);
  });

  it('should include an id in the secret', async () => {
    const message = 'hello world';
    const result = await service.randomSecret(message);

    const secretData = JSON.parse(atob(result.secret));
    expect(secretData.id).toBeDefined();
  });

  it('should include a date in the secret', async () => {
    const message = 'hello world';
    const result = await service.randomSecret(message);

    const secretData = JSON.parse(atob(result.secret));
    expect(secretData.date).toBeDefined();
    expect(typeof secretData.date).toBe('number');
  });

  it('should include the message in the secret', async () => {
    const message = 'hello world';
    const result = await service.randomSecret(message);

    const secretData = JSON.parse(atob(result.secret));
    expect(secretData.message).toEqual(message);
  });

  it('should generate a public access token and store it in the database', async () => {
    const issuer = 'test-issuer';
    const token = 'test-token';

    jest.spyOn(jwt, 'signAsync').mockResolvedValueOnce(token);

    jest.spyOn(prisma.token, 'create').mockResolvedValueOnce({
      id: 'TOKEN_ID',
      value: token,
      issuer,
      revoked: false,
      revoke_at: undefined,
      revoke_days: undefined,
    });

    const result = await service.generatePublicAccess(issuer);

    expect(result).toEqual({ public_access_token: token });

    expect(jwt.signAsync).toHaveBeenCalledWith({
      date: expect.any(String),
      iss: issuer,
      sub: 'public_access',
      aud: 'guest',
    });

    expect(prisma.token.create).toHaveBeenCalledWith({
      data: {
        value: token,
        issuer,
      },
    });
  });

  it('should throw an error if token creation fails', async () => {
    const issuer = 'test-issuer';

    jest
      .spyOn(prisma.token, 'create')
      .mockRejectedValueOnce(new Error('Database error'));

    await expect(service.generatePublicAccess(issuer)).rejects.toThrow(
      'Database error',
    );
  });
});
