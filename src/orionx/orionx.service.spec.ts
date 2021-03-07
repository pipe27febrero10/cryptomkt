import { Test, TestingModule } from '@nestjs/testing';
import { OrionxService } from './orionx.service';

describe('OrionxService', () => {
  let service: OrionxService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrionxService],
    }).compile();

    service = module.get<OrionxService>(OrionxService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
