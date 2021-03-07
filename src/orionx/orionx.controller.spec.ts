import { Test, TestingModule } from '@nestjs/testing';
import { OrionxController } from './orionx.controller';

describe('Orionx Controller', () => {
  let controller: OrionxController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrionxController],
    }).compile();

    controller = module.get<OrionxController>(OrionxController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
