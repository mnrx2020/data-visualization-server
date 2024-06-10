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
import router from '../../routes/management';
import { getAdmins, getUserPerformance } from '../../controllers/management';
jest.mock('../../controllers/management');
const mockedGetAdmins = getAdmins;
const mockedGetUserPerformance = getUserPerformance;
const app = express();
app.use(express.json());
app.use('/', router);
describe('Management Router', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('GET /admins', () => {
        it('should call getAdmins and return 200 status', () => __awaiter(void 0, void 0, void 0, function* () {
            mockedGetAdmins.mockImplementation((req, res) => __awaiter(void 0, void 0, void 0, function* () {
                res.status(200).json({ message: 'Admins fetched successfully' });
            }));
            const response = yield request(app).get('/admins');
            expect(mockedGetAdmins).toHaveBeenCalledTimes(1);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'Admins fetched successfully' });
        }));
        it('should return 500 status on error', () => __awaiter(void 0, void 0, void 0, function* () {
            mockedGetAdmins.mockImplementation((req, res) => __awaiter(void 0, void 0, void 0, function* () {
                throw new Error('Internal server error');
            }));
            const response = yield request(app).get('/admins');
            expect(mockedGetAdmins).toHaveBeenCalledTimes(1);
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Internal server error' });
        }));
    });
    describe('GET /performance/:id', () => {
        it('should call getUserPerformance and return 200 status', () => __awaiter(void 0, void 0, void 0, function* () {
            mockedGetUserPerformance.mockImplementation((req, res) => __awaiter(void 0, void 0, void 0, function* () {
                res.status(200).json({ message: 'User performance fetched successfully' });
            }));
            const response = yield request(app).get('/performance/1');
            expect(mockedGetUserPerformance).toHaveBeenCalledTimes(1);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: 'User performance fetched successfully' });
        }));
        it('should return 500 status on error', () => __awaiter(void 0, void 0, void 0, function* () {
            mockedGetUserPerformance.mockImplementation((req, res) => __awaiter(void 0, void 0, void 0, function* () {
                throw new Error('Internal server error');
            }));
            const response = yield request(app).get('/performance/1');
            expect(mockedGetUserPerformance).toHaveBeenCalledTimes(1);
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Internal server error' });
        }));
    });
});
