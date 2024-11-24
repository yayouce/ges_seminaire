import { Test, TestingModule } from '@nestjs/testing';
import { RapportController } from './rapport.controller';
import { RapportService } from './rapport.service';

describe('RapportController', () => {
  let controller: RapportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RapportController],
      providers: [RapportService],
    }).compile();

    controller = module.get<RapportController>(RapportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
