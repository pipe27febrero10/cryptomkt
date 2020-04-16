import { Test, TestingModule } from '@nestjs/testing';
import { CryptomktService } from './cryptomkt.service';

describe('CryptomktService', () => {
  let service: CryptomktService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptomktService],
    }).compile();

    service = module.get<CryptomktService>(CryptomktService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
