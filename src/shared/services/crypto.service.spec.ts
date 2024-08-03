import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto.service';

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoService],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should encrypt a string', async () => {
    const text = 'hello world';
    const encrypted = await service.encrypt(text);

    expect(encrypted).toBeDefined();
    expect(encrypted).not.toEqual(text);
  });

  it('compare encrypted string', async () => {
    const text = 'hello world';
    const encrypted = await service.encrypt(text);
    const compared = await service.compare(text, encrypted);

    expect(encrypted).toBeDefined();
    expect(encrypted).not.toEqual(text);
    expect(compared).toBeTruthy();
  });
});
