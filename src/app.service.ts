import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() {}

  index(): string {
    return 'Hello World!';
  }
}
