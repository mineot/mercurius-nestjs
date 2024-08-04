import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from '@shared/services/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Language, Profile } from '@prisma/client';
import { JwtModule } from '@nestjs/jwt';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule],
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

  it('should return a profile when a valid language is provided', async () => {
    const language: Language = {
      id: 'ENGLISH_ID',
      name: 'English',
      lang: 'en',
      country: 'US',
    };

    const profile: Profile = {
      id: 'PROFILE_ID',
      name: 'John Doe',
      langId: 'ENGLISH_ID',
      job_title: 'Job Title',
      summary: 'Summary',
      biography: 'Biography',
      photo_sm: 'https://photo_sm/',
      photo_lg: 'https://photo_lg/',
      activity: 'Activity',
    };

    jest.spyOn(appService, 'getProfile').mockResolvedValue(profile);

    const result = await appController.index(language);
    expect(result).toBe(profile);
  });

  it('should throw an error when an invalid language is provided', async () => {
    const language: Language = null;

    try {
      await appController.index(language);
      fail('Expected an error to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('should call appService.getProfile with the correct language', async () => {
    const language: Language = {
      id: 'ENGLISH_ID',
      name: 'English',
      lang: 'en',
      country: 'US',
    };

    jest.spyOn(appService, 'getProfile');

    await appController.index(language);
    expect(appService.getProfile).toHaveBeenCalledTimes(1);
    expect(appService.getProfile).toHaveBeenCalledWith(language);
  });
});
