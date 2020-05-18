import { Test, TestingModule } from '@nestjs/testing';
import { BudaService } from './buda.service';

describe('BudaService', () => {
  let service: BudaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BudaService],
    }).compile();

    service = module.get<BudaService>(BudaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
