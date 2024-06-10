import express from 'express';
import request from 'supertest';
import router from '../../routes/management.ts';
import { getAdmins, getUserPerformance } from '../../controllers/management.ts';

jest.mock('../../controllers/management');

const mockedGetAdmins = getAdmins as jest.MockedFunction<typeof getAdmins>;
const mockedGetUserPerformance = getUserPerformance as jest.MockedFunction<typeof getUserPerformance>;

const app = express();
app.use(express.json());
app.use('/', router);

describe('Management Router', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /admins', () => {
    it('should call getAdmins and return 200 status', async () => {
      mockedGetAdmins.mockImplementation(async (req, res) => {
        res.status(200).json({ message: 'Admins fetched successfully' });
      });

      const response = await request(app).get('/admins');

      expect(mockedGetAdmins).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Admins fetched successfully' });
    });

    it('should return 500 status on error', async () => {
      mockedGetAdmins.mockImplementation(async (req, res) => {
        throw new Error('Internal server error');
      });

      const response = await request(app).get('/admins');

      expect(mockedGetAdmins).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal server error' });
    });
  });

  describe('GET /performance/:id', () => {
    it('should call getUserPerformance and return 200 status', async () => {
      mockedGetUserPerformance.mockImplementation(async (req, res) => {
        res.status(200).json({ message: 'User performance fetched successfully' });
      });

      const response = await request(app).get('/performance/1');

      expect(mockedGetUserPerformance).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'User performance fetched successfully' });
    });

    it('should return 500 status on error', async () => {
      mockedGetUserPerformance.mockImplementation(async (req, res) => {
        throw new Error('Internal server error');
      });

      const response = await request(app).get('/performance/1');

      expect(mockedGetUserPerformance).toHaveBeenCalledTimes(1);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: 'Internal server error' });
    });
  });
});
