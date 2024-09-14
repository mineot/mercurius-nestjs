import { Injectable } from '@nestjs/common';

import { Compare, Compared, Encrypted, Hash } from './contracts';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptoService {
  async hash({ text }: Hash): Encrypted {
    return await bcrypt.hash(text, 10);
  }

  async compare({ text, hash }: Compare): Compared {
    return await bcrypt.compare(text, hash);
  }
}
