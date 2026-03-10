import { Test, TestingModule } from '@nestjs/testing';
import { RefundCalculatorService } from './refund-calculator.service';

describe('RefundCalculatorService', () => {
  let service: RefundCalculatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RefundCalculatorService],
    }).compile();

    service = module.get<RefundCalculatorService>(RefundCalculatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
