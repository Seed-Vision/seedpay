import { Test, TestingModule } from '@nestjs/testing';
import { FeexpayController } from './feexpay.controller';

describe('FeexpayController', () => {
  let controller: FeexpayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeexpayController],
    }).compile();

    controller = module.get<FeexpayController>(FeexpayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
