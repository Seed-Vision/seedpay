import { Test, TestingModule } from '@nestjs/testing';
import { FeexpayService } from './feexpay.service';

describe('FeexpayService', () => {
  let service: FeexpayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeexpayService],
    }).compile();

    service = module.get<FeexpayService>(FeexpayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
