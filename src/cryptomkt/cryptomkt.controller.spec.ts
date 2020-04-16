import { Test, TestingModule } from '@nestjs/testing';
import { CryptomktController } from './cryptomkt.controller';

describe('Cryptomkt Controller', () => {
  let controller: CryptomktController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CryptomktController],
    }).compile();

    controller = module.get<CryptomktController>(CryptomktController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
