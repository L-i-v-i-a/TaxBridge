import { Test, TestingModule } from '@nestjs/testing';
import { RefundCalculatorController } from './refund-calculator.controller';

describe('RefundCalculatorController', () => {
  let controller: RefundCalculatorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RefundCalculatorController],
    }).compile();

    controller = module.get<RefundCalculatorController>(RefundCalculatorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
