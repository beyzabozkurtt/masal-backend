import { Test, TestingModule } from '@nestjs/testing';
import { BegeniController } from './begeni.controller';

describe('BegeniController', () => {
  let controller: BegeniController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BegeniController],
    }).compile();

    controller = module.get<BegeniController>(BegeniController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
