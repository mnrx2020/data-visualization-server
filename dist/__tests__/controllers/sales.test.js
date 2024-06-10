var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getSales } from '../../controllers/sales';
import OverallStat from '../../models/OverallStat';
jest.mock('../../models/OverallStat');
describe('Sales Controller', () => {
    const mockRequest = () => {
        const req = {};
        return req;
    };
    const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('getSales', () => {
        it('should return overall stats', () => __awaiter(void 0, void 0, void 0, function* () {
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
            OverallStat.find.mockResolvedValue(mockOverallStats);
            yield getSales(req, res);
            expect(OverallStat.find).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockOverallStats[0]);
        }));
        it('should return 404 on error', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = mockRequest();
            const res = mockResponse();
            OverallStat.find.mockRejectedValue(new Error('Error'));
            yield getSales(req, res);
            expect(OverallStat.find).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error' });
        }));
    });
});
