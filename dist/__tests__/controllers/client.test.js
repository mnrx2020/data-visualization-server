var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import request from 'supertest';
import express from 'express';
import { getProducts, getCustomers, getTransactions, getGeography } from '../../controllers/client';
import Product from '../../models/Product';
import ProductStat from '../../models/ProductStat';
import User from '../../models/User';
import Transaction from '../../models/Transaction';
import getCountryIso3 from 'country-iso-2-to-3';
jest.mock('../../models/Product');
jest.mock('../../models/ProductStat');
jest.mock('../../models/User');
jest.mock('../../models/Transaction');
jest.mock('country-iso-2-to-3');
const app = express();
app.get('/products', getProducts);
app.get('/customers', getCustomers);
app.get('/transactions', getTransactions);
app.get('/geography', getGeography);
describe('Client Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('getProducts', () => {
        it('should return products with their stats', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockProducts = [
                { _id: '1', name: 'Product 1', toObject: jest.fn().mockReturnValue({ _id: '1', name: 'Product 1' }) },
            ];
            const mockStats = [{ productId: '1', stat: 'some stat' }];
            Product.find.mockResolvedValue(mockProducts);
            ProductStat.find.mockResolvedValue(mockStats);
            const response = yield request(app).get('/products');
            expect(response.status).toBe(200);
            expect(response.body).toEqual([
                {
                    _id: '1',
                    name: 'Product 1',
                    stat: mockStats,
                },
            ]);
        }));
        it('should handle errors', () => __awaiter(void 0, void 0, void 0, function* () {
            Product.find.mockRejectedValue(new Error('Test error'));
            const response = yield request(app).get('/products');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'Test error' });
        }));
    });
    describe('getCustomers', () => {
        it('should return customers without passwords', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockCustomers = [{ _id: '1', name: 'Customer 1', role: 'user' }];
            const mockFind = jest.fn().mockReturnValue({
                select: jest.fn().mockResolvedValue(mockCustomers),
            });
            User.find.mockImplementation(mockFind);
            const response = yield request(app).get('/customers');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockCustomers);
        }));
        it('should handle errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockFind = jest.fn().mockReturnValue({
                select: jest.fn().mockRejectedValue(new Error('Test error')),
            });
            User.find.mockImplementation(mockFind);
            const response = yield request(app).get('/customers');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'Test error' });
        }));
    });
    describe('getTransactions', () => {
        it('should return transactions with total count', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockTransactions = [{ _id: '1', cost: '100', userId: '1' }];
            Transaction.find.mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue(mockTransactions),
            });
            Transaction.countDocuments.mockResolvedValue(1);
            const response = yield request(app).get('/transactions');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ transactions: mockTransactions, total: 1 });
        }));
        it('should handle errors', () => __awaiter(void 0, void 0, void 0, function* () {
            Transaction.find.mockReturnValue({
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockRejectedValue(new Error('Test error')),
            });
            const response = yield request(app).get('/transactions');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'Test error' });
        }));
    });
    describe('getGeography', () => {
        it('should return formatted locations', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUsers = [{ country: 'US' }, { country: 'US' }];
            User.find.mockResolvedValue(mockUsers);
            getCountryIso3.mockReturnValue('USA');
            const response = yield request(app).get('/geography');
            expect(response.status).toBe(200);
            expect(response.body).toEqual([{ id: 'USA', value: 2 }]);
        }));
        it('should handle errors', () => __awaiter(void 0, void 0, void 0, function* () {
            User.find.mockRejectedValue(new Error('Test error'));
            const response = yield request(app).get('/geography');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ message: 'Test error' });
        }));
    });
});
