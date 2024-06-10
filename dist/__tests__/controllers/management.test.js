var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from 'mongoose';
import User from '../../models/User';
import Transaction from '../../models/Transaction';
import { getAdmins, getUserPerformance } from '../../controllers/management'; // Ensure the correct module is imported
jest.mock('../../models/User');
jest.mock('../../models/Transaction');
describe('Management Controller', () => {
    describe('getAdmins', () => {
        it('should return a list of admins', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const mockAdmins = [
                { _id: '1', name: 'Admin One', role: 'admin' },
                { _id: '2', name: 'Admin Two', role: 'admin' },
            ];
            User.find.mockReturnValue({
                select: jest.fn().mockResolvedValue(mockAdmins),
            });
            yield getAdmins(req, res);
            expect(User.find).toHaveBeenCalledWith({ role: 'admin' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockAdmins);
        }));
        it('should handle errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const errorMessage = 'Database error';
            User.find.mockReturnValue({
                select: jest.fn().mockRejectedValue(new Error(errorMessage)),
            });
            yield getAdmins(req, res);
            expect(User.find).toHaveBeenCalledWith({ role: 'admin' });
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: errorMessage });
        }));
    });
    describe('getUserPerformance', () => {
        it('should return user performance data', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { params: { id: '507f191e810c19729de860ea' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
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
            User.aggregate.mockResolvedValue(mockUserWithStats);
            Transaction.findById
                .mockResolvedValueOnce(mockTransactions[0])
                .mockResolvedValueOnce(mockTransactions[1]);
            yield getUserPerformance(req, res);
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
            expect(Transaction.findById).toHaveBeenCalledWith(new mongoose.Types.ObjectId('507f191e810c19729de860ea'));
            expect(Transaction.findById).toHaveBeenCalledWith(new mongoose.Types.ObjectId('507f191e810c19729de860eb'));
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                user: mockUserWithStats[0],
                sales: mockTransactions,
            });
        }));
        it('should handle errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = { params: { id: '507f191e810c19729de860ea' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn(),
            };
            const errorMessage = 'Database error';
            User.aggregate.mockRejectedValue(new Error(errorMessage));
            yield getUserPerformance(req, res);
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
        }));
    });
});
