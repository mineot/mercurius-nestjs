import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from '@shared/services/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from '@shared/services/token.service';
import { NotFoundException } from '@nestjs/common';
// import { Token } from '@prisma/client';

describe('TokenService', () => {
  let jwtService: JwtService;
  let prismaService: PrismaService;
  let tokenService: TokenService;

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

    tokenService = module.get<TokenService>(TokenService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(async () => {
    await prismaService.token.deleteMany();
  });

  it('should return a random secret', async () => {
    const message = 'hello world';
    const result = await tokenService.randomSecret(message);

    expect(result.secret).toBeDefined();
    expect(result.secret).not.toEqual(message);
  });

  it('should include an id in the secret', async () => {
    const message = 'hello world';
    const result = await tokenService.randomSecret(message);

    const secretData = JSON.parse(atob(result.secret));
    expect(secretData.id).toBeDefined();
  });

  it('should include a date in the secret', async () => {
    const message = 'hello world';
    const result = await tokenService.randomSecret(message);

    const secretData = JSON.parse(atob(result.secret));
    expect(secretData.date).toBeDefined();
    expect(typeof secretData.date).toBe('number');
  });

  it('should include the message in the secret', async () => {
    const message = 'hello world';
    const result = await tokenService.randomSecret(message);

    const secretData = JSON.parse(atob(result.secret));
    expect(secretData.message).toEqual(message);
  });

  it('should generate a public access token and store it in the database', async () => {
    const issuer = 'test-issuer';
    const token = 'test-token';

    jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce(token);

    jest.spyOn(prismaService.token, 'create').mockResolvedValueOnce({
      id: 'TOKEN_ID',
      value: token,
      issuer,
      revoked: false,
      revoke_at: undefined,
      revoke_days: undefined,
    });

    const result = await tokenService.generatePublicAccess(issuer);

    expect(result).toEqual({ public_access_token: token });

    expect(jwtService.signAsync).toHaveBeenCalledWith({
      date: expect.any(String),
      iss: issuer,
      sub: 'public_access',
      aud: 'guest',
    });

    expect(prismaService.token.create).toHaveBeenCalledWith({
      data: {
        value: token,
        issuer,
      },
    });
  });

  it('should throw an error if token creation fails', async () => {
    const issuer = 'test-issuer';

    jest
      .spyOn(prismaService.token, 'create')
      .mockRejectedValueOnce(new Error('Database error'));

    await expect(tokenService.generatePublicAccess(issuer)).rejects.toThrow(
      'Database error',
    );
  });

  it('should revoke public access and update token', async () => {
    const issuer = 'test-issuer';
    const days = 7;

    const token = await prismaService.token.create({
      data: {
        id: 'TOKEN_ID',
        value: 'test-token',
        issuer,
        revoked: false,
        revoke_at: null,
        revoke_days: null,
      },
    });

    const result = await tokenService.revokePublicAccess(issuer, days);

    expect(result).toEqual({
      revoked: true,
      remove_at: expect.any(Date),
      remove_days: days,
      issuer,
    });

    const updatedToken = await prismaService.token.findUnique({
      where: {
        id: token.id,
      },
    });

    expect(updatedToken).toEqual({
      ...token,
      revoked: true,
      revoke_at: expect.any(Date),
      revoke_days: days,
    });
  });

  it('should throw NotFoundException if token not found', async () => {
    const issuer = 'test-issuer';
    const days = 7;

    await expect(tokenService.revokePublicAccess(issuer, days)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should return the public access token and issuer', async () => {
    const issuer = 'test-issuer';
    const tokenValue = 'test-token';

    jest.spyOn(prismaService.token, 'findFirst').mockResolvedValueOnce({
      id: 'TOKEN_ID',
      value: tokenValue,
      issuer,
      revoked: false,
      revoke_at: null,
      revoke_days: null,
    });

    const result = await tokenService.getPublicAccess(issuer);

    expect(result).toEqual({ public_access_token: tokenValue, issuer });
    expect(prismaService.token.findFirst).toHaveBeenCalledWith({
      where: { issuer },
    });
  });

  it('should throw an error if the token is not found', async () => {
    const issuer = 'test-issuer';

    jest.spyOn(prismaService.token, 'findFirst').mockResolvedValueOnce(null);

    await expect(tokenService.getPublicAccess(issuer)).rejects.toThrow(
      NotFoundException,
    );

    expect(prismaService.token.findFirst).toHaveBeenCalledWith({
      where: { issuer },
    });
  });

  // it('should filter tokens based on revoke_days', async () => {
  //   // Mock today's date
  //   const today = new Date('2022-09-20');

  //   jest.spyOn(global, 'Date').mockImplementation(() => today);

  //   const tokens: Token[] = [
  //     {
  //       id: '1',
  //       issuer: 'issuer1',
  //       revoke_at: new Date('2022-09-15'),
  //       revoke_days: 5,
  //       revoked: true,
  //       value: 'token1',
  //     },
  //     {
  //       id: '2',
  //       issuer: 'issuer2',
  //       revoke_at: new Date('2022-09-10'),
  //       revoke_days: 10,
  //       revoked: true,
  //       value: 'token2',
  //     },
  //   ];

  //   // Mock the Prisma token findMany method
  //   jest.spyOn(prismaService.token, 'findMany').mockResolvedValueOnce(tokens);

  //   // Mock the Prisma token delete method
  //   jest.spyOn(prismaService.token, 'delete').mockResolvedValueOnce(tokens[0]);

  //   // Call revokeShrink method
  //   const result = await tokenService.revokeShrink();

  //   // Assert that tokens with revoke_days lesser than the difference in days are deleted
  //   expect(result.deleted_tokens).toHaveLength(1);
  //   expect(result.deleted_tokens[0].issuer).toEqual('issuer1');

  //   // Restore the original Date implementation
  //   jest.spyOn(global, 'Date').mockRestore();
  // });

  // it('should delete tokens', async () => {
  //   // Mock tokens to delete
  //   const tokens: Token[] = [
  //     {
  //       id: '1',
  //       revoke_at: new Date('2022-09-15'),
  //       revoke_days: 5,
  //       issuer: 'issuer1',
  //     },
  //     {
  //       id: '2',
  //       revoke_at: new Date('2022-09-10'),
  //       revoke_days: 10,
  //       issuer: 'issuer2',
  //     },
  //   ];

  //   // Call revokeShrink method
  //   const result = await tokenService.revokeShrink();

  //   // Assert that tokens are deleted
  //   expect(prismaService.token.delete).toHaveBeenCalledTimes(tokens.length);
  // });

  // it('should return deleted tokens', async () => {
  //   // Mock tokens and expected result
  //   const tokens: Token[] = [
  //     {
  //       id: '1',
  //       revoke_at: new Date('2022-09-15'),
  //       revoke_days: 5,
  //       issuer: 'issuer1',
  //     },
  //     {
  //       id: '2',
  //       revoke_at: new Date('2022-09-10'),
  //       revoke_days: 10,
  //       issuer: 'issuer2',
  //     },
  //   ];

  //   const expectedDeletedTokens = tokens.map((token) => ({
  //     issuer: token.issuer,
  //     revoke_at: token.revoke_at,
  //   }));

  //   // Call revokeShrink method
  //   const result = await tokenService.revokeShrink();

  //   // Assert that the returned object contains the deleted tokens
  //   expect(result.deleted_tokens).toEqual(expectedDeletedTokens);
  // });

  // it('should generate a signed user token', async () => {
  //   const user: User = {
  //     id: '1',
  //     name: 'Test User',
  //     email: 'test@example.com',
  //   };
  //   const token = await tokenService.generateSignedUser(user);

  //   expect(jwtService.signAsync).toHaveBeenCalledWith({
  //     username: user.name,
  //     email: user.email,
  //     iss: 'user',
  //     sub: user.id,
  //     aud: 'admin',
  //     exp: 86400,
  //   });

  //   expect(token).toEqual(expect.any(String));
  // });

  // it('should call jwtService.verifyAsync with the provided token', async () => {
  //   const token = 'test-token';
  //   await tokenService.verify(token);
  //   expect(jwtService.verifyAsync).toHaveBeenCalledWith(token);
  // });

  // it('should return the result of jwtService.verifyAsync', async () => {
  //   const token = 'test-token';
  //   const result = { userId: 'test-user-id' };
  //   (jwtService.verifyAsync as jest.Mock).mockResolvedValueOnce(result);
  //   const verifyResult = await tokenService.verify(token);
  //   expect(verifyResult).toEqual(result);
  // });
});
