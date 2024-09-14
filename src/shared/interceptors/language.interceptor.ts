import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

import { Language } from '@prisma/client';
import { LanguageService } from '../services/language.service';

@Injectable()
export class LanguageInterceptor implements NestInterceptor {
  constructor(private readonly languageService: LanguageService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const accepted = request.headers['accept-language'];

    const languages: Language[] = await this.languageService.fetchAll();

    let preferred = languages.find(
      (language: Language) =>
        accepted.includes(`${language.lang}-${language.country}`) ||
        accepted.includes(language.lang),
    );

    preferred =
      preferred ??
      languages.find((language: Language) => {
        return language.lang === 'en' && language.country === 'US';
      });

    request.language = preferred;

    return next.handle();
  }
}
