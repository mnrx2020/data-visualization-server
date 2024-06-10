import { Request, Response } from 'express';
import { getSales } from '../../controllers/sales';
import OverallStat from '../../models/OverallStat';

jest.mock('../../models/OverallStat');

describe('Sales Controller', () => {
  const mockRequest = () => {
    const req = {} as Request;
    return req;
  };

  const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSales', () => {
    it('should return overall stats', async () => {
      const req = mockRequest();
      const res = mockResponse();

      const mockOverallStats = [{
        totalCustomers: 100,
        yearlyTotalSoldUnits: 1000,
        yearlySalesTotal: 50000,
        monthlyData: [{ month: 'January', sales: 5000 }],
        dailyData: [{ date: '2021-01-01', sales: 200 }],
        salesByCategory: { electronics: 30000, clothing: 20000 }
      }];

      (OverallStat.find as jest.Mock).mockResolvedValue(mockOverallStats);

      await getSales(req, res);

      expect(OverallStat.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockOverallStats[0]);
    });

    it('should return 404 on error', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (OverallStat.find as jest.Mock).mockRejectedValue(new Error('Error'));

      await getSales(req, res);

      expect(OverallStat.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Error' });
    });
  });
});
