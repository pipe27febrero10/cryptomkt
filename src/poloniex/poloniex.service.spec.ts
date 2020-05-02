import { Test, TestingModule } from '@nestjs/testing';
import { PoloniexService } from './poloniex.service';

describe('PoloniexService', () => {
  let service: PoloniexService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PoloniexService],
    }).compile();

    service = module.get<PoloniexService>(PoloniexService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
