import { Test, TestingModule } from '@nestjs/testing';
import { BudaController } from './buda.controller';

describe('Buda Controller', () => {
  let controller: BudaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BudaController],
    }).compile();

    controller = module.get<BudaController>(BudaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
