import { Test, TestingModule } from '@nestjs/testing';
import { BegeniService } from './begeni.service';

describe('LikeService', () => {
  let service: BegeniService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BegeniService],
    }).compile();

    service = module.get<BegeniService>(BegeniService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
