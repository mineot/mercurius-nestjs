import { Observable } from 'rxjs';
import { PrismaService } from '@shared/prisma.service';
import { Language } from '@prisma/client';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

@Injectable()
export class LanguageInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const accepted = request.headers['accept-language'];

    const languages: Language[] = await this.prisma.language.findMany();

    let preferred = languages.find(
      (language: Language) =>
        accepted.includes(`${language.lang}-${language.country}`) ||
        accepted.includes(language.lang),
    );

    preferred =
      preferred ??
      languages.find(
        (language: Language) =>
          language.lang === 'en' && language.country === 'US',
      );

    request.language = preferred;

    return next.handle();
  }
}
