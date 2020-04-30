import { Test, TestingModule } from '@nestjs/testing';
import { LocalindicatorService } from './localindicator.service';

describe('LocalindicatorService', () => {
  let service: LocalindicatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocalindicatorService],
    }).compile();

    service = module.get<LocalindicatorService>(LocalindicatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
