import { Test, TestingModule } from '@nestjs/testing';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';

describe('PortfolioController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [PortfolioController],
      providers: [PortfolioService],
    }).compile();
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      const portfolioController = app.get(PortfolioController);
      expect(portfolioController.getPortfolios()).toBe('Hello World!');
    });
  });
});
