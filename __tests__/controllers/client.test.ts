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
    it('should return products with their stats', async () => {
      const mockProducts = [
        { _id: '1', name: 'Product 1', toObject: jest.fn().mockReturnValue({ _id: '1', name: 'Product 1' }) },
      ];
      const mockStats = [{ productId: '1', stat: 'some stat' }];
      (Product.find as jest.Mock).mockResolvedValue(mockProducts);
      (ProductStat.find as jest.Mock).mockResolvedValue(mockStats);

      const response = await request(app).get('/products');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        {
          _id: '1',
          name: 'Product 1',
          stat: mockStats,
        },
      ]);
    });

    it('should handle errors', async () => {
      (Product.find as jest.Mock).mockRejectedValue(new Error('Test error'));

      const response = await request(app).get('/products');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Test error' });
    });
  });

  describe('getCustomers', () => {
    it('should return customers without passwords', async () => {
      const mockCustomers = [{ _id: '1', name: 'Customer 1', role: 'user' }];
      const mockFind = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockCustomers),
      });
      (User.find as jest.Mock).mockImplementation(mockFind);

      const response = await request(app).get('/customers');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockCustomers);
    });

    it('should handle errors', async () => {
      const mockFind = jest.fn().mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error('Test error')),
      });
      (User.find as jest.Mock).mockImplementation(mockFind);

      const response = await request(app).get('/customers');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Test error' });
    });
  });

  describe('getTransactions', () => {
    it('should return transactions with total count', async () => {
      const mockTransactions = [{ _id: '1', cost: '100', userId: '1' }];
      (Transaction.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockTransactions),
      });
      (Transaction.countDocuments as jest.Mock).mockResolvedValue(1);

      const response = await request(app).get('/transactions');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ transactions: mockTransactions, total: 1 });
    });

    it('should handle errors', async () => {
      (Transaction.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockRejectedValue(new Error('Test error')),
      });

      const response = await request(app).get('/transactions');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Test error' });
    });
  });

  describe('getGeography', () => {
    it('should return formatted locations', async () => {
      const mockUsers = [{ country: 'US' }, { country: 'US' }];
      (User.find as jest.Mock).mockResolvedValue(mockUsers);
      (getCountryIso3 as jest.Mock).mockReturnValue('USA');

      const response = await request(app).get('/geography');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([{ id: 'USA', value: 2 }]);
    });

    it('should handle errors', async () => {
      (User.find as jest.Mock).mockRejectedValue(new Error('Test error'));

      const response = await request(app).get('/geography');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Test error' });
    });
  });
});
