import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Language } from '@prisma/client';
import { PrismaService } from '@shared/prisma.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
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

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  it('should return a profile when language is provided', async () => {
    const mockLanguage: Language = {
      id: 'ABC123',
      lang: 'en',
      country: 'US',
      name: 'English',
    };

    jest.spyOn(appService, 'index').mockResolvedValue({
      id: 'DEF123',
      langId: 'ABC123',
      name: 'John Doe',
      job_title: 'Software Engineer',
      summary: 'Lorem ipsum...',
      biography: 'Software engineer',
      photo_sm: 'https://example.com/photo_sm.jpg',
      photo_lg: 'https://example.com/photo_lg.jpg',
      activity: 'Your activity goes here',
    });

    const result = await appController.index(mockLanguage);

    expect(result).toEqual({
      id: 'DEF123',
      langId: 'ABC123',
      name: 'John Doe',
      job_title: 'Software Engineer',
      summary: 'Lorem ipsum...',
      biography: 'Software engineer',
      photo_sm: 'https://example.com/photo_sm.jpg',
      photo_lg: 'https://example.com/photo_lg.jpg',
      activity: 'Your activity goes here',
    });
    expect(appService.index).toHaveBeenCalledWith(mockLanguage);
  });

  it('should throw an error when language is not provided', async () => {
    const mockLanguage: Language = undefined;
    jest
      .spyOn(appService, 'index')
      .mockRejectedValue(new Error('Language is required'));

    await expect(appController.index(mockLanguage)).rejects.toThrow(
      'Language is required',
    );
    expect(appService.index).toHaveBeenCalledWith(mockLanguage);
  });
});
