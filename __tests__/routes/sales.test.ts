import express from 'express';
import request from 'supertest';
import router from '../../routes/sales';
import { getSales } from '../../controllers/sales';

jest.mock('../../controllers/sales');

const mockedGetSales = getSales as jest.MockedFunction<typeof getSales>;

const app = express();
app.use(express.json());
app.use('/', router);

describe('Sales Router', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /sales', () => {
    it('should call getSales and return 200 status', async () => {
      mockedGetSales.mockImplementation(async (req, res) => {
        res.status(200).json({ message: 'Sales data fetched successfully' });
      });

      const response = await request(app).get('/sales');

      expect(mockedGetSales).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Sales data fetched successfully' });
    });

    it('should return 500 status on error', async () => {
      mockedGetSales.mockImplementation(async (req, res) => {
        throw new Error('Internal server error');
      });

      const response = await request(app).get('/sales');

      expect(mockedGetSales).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal server error' });
    });
  });
});
