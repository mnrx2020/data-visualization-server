var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import request from 'supertest';
import router from '../../routes/sales';
import { getSales } from '../../controllers/sales';
jest.mock('../../controllers/sales');
const mockedGetSales = getSales;
const app = express();
app.use(express.json());
app.use('/', router);
describe('Sales Router', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('GET /sales', () => {
        it('should call getSales and return 200 status', () => __awaiter(void 0, void 0, void 0, function* () {
            mockedGetSales.mockImplementation((req, res) => __awaiter(void 0, void 0, void 0, function* () {
                res.status(200).json({ message: 'Sales data fetched successfully' });
            }));
            const response = yield request(app).get('/sales');
            expect(mockedGetSales).toHaveBeenCalledTimes(1);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Sales data fetched successfully' });
        }));
        it('should return 500 status on error', () => __awaiter(void 0, void 0, void 0, function* () {
            mockedGetSales.mockImplementation((req, res) => __awaiter(void 0, void 0, void 0, function* () {
                throw new Error('Internal server error');
            }));
            const response = yield request(app).get('/sales');
            expect(mockedGetSales).toHaveBeenCalledTimes(1);
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Internal server error' });
        }));
    });
});
