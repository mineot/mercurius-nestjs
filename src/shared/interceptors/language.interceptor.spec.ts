import { Test, TestingModule } from '@nestjs/testing';
import { LanguageInterceptor } from '@shared/interceptors/language.interceptor';
import { PrismaService } from '@src/shared/services/prisma.service';

describe('LanguageInterceptor', () => {
  let interceptor: LanguageInterceptor;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LanguageInterceptor,
        PrismaService,
        {
          provide: PrismaService,
          useValue: {
            language: {
              findMany: jest.fn().mockResolvedValue([]),
            },
          },
        },
      ],
    }).compile();

    interceptor = module.get<LanguageInterceptor>(LanguageInterceptor);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should set the preferred language based on the request headers', async () => {
    const context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {
            'accept-language': 'en-US,en;q=0.9',
          },
        }),
      }),
    } as any;

    const next = {
      handle: jest.fn().mockReturnValue(Promise.resolve(null)),
    } as any;

    const findManyMock = jest.fn().mockResolvedValueOnce([
      { lang: 'en', country: 'US', name: 'English' },
      { lang: 'en', country: 'GB', name: 'English (UK)' },
      { lang: 'es', country: 'ES', name: 'Español' },
    ]);

    prismaService.language.findMany = findManyMock;

    await interceptor.intercept(context, next);

    expect(prismaService.language.findMany).toHaveBeenCalledWith();

    expect(context.switchToHttp().getRequest().language).toEqual({
      lang: 'en',
      country: 'US',
      name: 'English',
    });
  });

  it('should set the preferred language to English (US) if no match is found', async () => {
    const context = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({
          headers: {
            'accept-language': 'fr-FR,fr;q=0.9,en-US,en;q=0.8',
          },
        }),
      }),
    } as any;

    const next = {
      handle: jest.fn().mockReturnValue(Promise.resolve(null)),
    } as any;

    (prismaService.language.findMany as jest.Mock).mockResolvedValue([
      { lang: 'en', country: 'US', name: 'English' },
      { lang: 'fr', country: 'FR', name: 'Français' },
    ]);

    await interceptor.intercept(context, next);

    expect(prismaService.language.findMany).toHaveBeenCalledWith();

    expect(context.switchToHttp().getRequest().language).toEqual({
      lang: 'en',
      country: 'US',
      name: 'English',
    });
  });
});
