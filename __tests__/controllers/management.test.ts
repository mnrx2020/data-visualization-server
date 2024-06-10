import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../../models/User.ts';
import Transaction from '../../models/Transaction.ts';
import { getAdmins, getUserPerformance } from '../../controllers/management.ts'; // Ensure the correct module is imported

jest.mock('../../models/User');
jest.mock('../../models/Transaction');

describe('Management Controller', () => {
  describe('getAdmins', () => {
    it('should return a list of admins', async () => {
      const req = {} as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockAdmins = [
        { _id: '1', name: 'Admin One', role: 'admin' },
        { _id: '2', name: 'Admin Two', role: 'admin' },
      ];

      (User.find as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockAdmins),
      });

      await getAdmins(req, res);

      expect(User.find).toHaveBeenCalledWith({ role: 'admin' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockAdmins);
    });

    it('should handle errors', async () => {
      const req = {} as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const errorMessage = 'Database error';
      (User.find as jest.Mock).mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error(errorMessage)),
      });

      await getAdmins(req, res);

      expect(User.find).toHaveBeenCalledWith({ role: 'admin' });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('getUserPerformance', () => {
    it('should return user performance data', async () => {
      const req = { params: { id: '507f191e810c19729de860ea' } } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockUserWithStats = [
        {
          _id: new mongoose.Types.ObjectId('507f191e810c19729de860ea'),
          name: 'User One',
          affiliateStats: {
            affiliateSales: [
              new mongoose.Types.ObjectId('507f191e810c19729de860ea'),
              new mongoose.Types.ObjectId('507f191e810c19729de860eb'),
            ],
          },
        },
      ];

      const mockTransactions = [
        { _id: '507f191e810c19729de860ea', amount: 100 },
        { _id: '507f191e810c19729de860eb', amount: 200 },
      ];

      (User.aggregate as jest.Mock).mockResolvedValue(mockUserWithStats);
      (Transaction.findById as jest.Mock)
        .mockResolvedValueOnce(mockTransactions[0])
        .mockResolvedValueOnce(mockTransactions[1]);

      await getUserPerformance(req, res);

      expect(User.aggregate).toHaveBeenCalledWith([
        { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
        {
          $lookup: {
            from: 'affiliatestats',
            localField: '_id',
            foreignField: 'userId',
            as: 'affiliateStats',
          },
        },
        { $unwind: '$affiliateStats' },
      ]);
      expect(Transaction.findById).toHaveBeenCalledTimes(2);
      expect(Transaction.findById).toHaveBeenCalledWith(
        new mongoose.Types.ObjectId('507f191e810c19729de860ea')
      );
      expect(Transaction.findById).toHaveBeenCalledWith(
        new mongoose.Types.ObjectId('507f191e810c19729de860eb')
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        user: mockUserWithStats[0],
        sales: mockTransactions,
      });
    });

    it('should handle errors', async () => {
      const req = { params: { id: '507f191e810c19729de860ea' } } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const errorMessage = 'Database error';
      (User.aggregate as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await getUserPerformance(req, res);

      expect(User.aggregate).toHaveBeenCalledWith([
        { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
        {
          $lookup: {
            from: 'affiliatestats',
            localField: '_id',
            foreignField: 'userId',
            as: 'affiliateStats',
          },
        },
        { $unwind: '$affiliateStats' },
      ]);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
    });
  });
});
