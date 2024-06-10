var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getUser, getDashboardStats } from "../../controllers/general";
import User from "../../models/User";
import OverallStat from "../../models/OverallStat";
import Transaction from "../../models/Transaction";
const mockRequest = (params = {}, body = {}, query = {}) => ({
    params,
    body,
    query,
});
const mockResponse = () => {
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };
    return res;
};
jest.mock("../../models/User");
jest.mock("../../models/OverallStat");
jest.mock("../../models/Transaction");
describe("General Controller", () => {
    describe("getUser", () => {
        it("should return user data if user is found", () => __awaiter(void 0, void 0, void 0, function* () {
            const req = mockRequest({ id: "1" });
            const res = mockResponse();
            const user = { _id: "1", name: "John Doe" };
            User.findById.mockResolvedValue(user);
            yield getUser(req, res);
            expect(User.findById).toHaveBeenCalledWith("1");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(user);
        }));
        it("should return 404 if user is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const req = mockRequest({ id: "1" });
            const res = mockResponse();
            User.findById.mockResolvedValue(null);
            yield getUser(req, res);
            expect(User.findById).toHaveBeenCalledWith("1");
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
        }));
        it("should return 404 if an error occurs", () => __awaiter(void 0, void 0, void 0, function* () {
            const req = mockRequest({ id: "1" });
            const res = mockResponse();
            const error = new Error("Database error");
            User.findById.mockRejectedValue(error);
            yield getUser(req, res);
            expect(User.findById).toHaveBeenCalledWith("1");
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: error.message });
        }));
    });
    describe("getDashboardStats", () => {
        it("should return dashboard statistics", () => __awaiter(void 0, void 0, void 0, function* () {
            const req = mockRequest();
            const res = mockResponse();
            const transactions = [{ id: "t1" }, { id: "t2" }];
            const overallStat = [{
                    totalCustomers: 100,
                    yearlyTotalSoldUnits: 1000,
                    yearlySalesTotal: 50000,
                    monthlyData: [{ month: "November", sales: 5000 }],
                    salesByCategory: { electronics: 10000 },
                    dailyData: [{ date: "2021-11-15", sales: 500 }]
                }];
            Transaction.find.mockReturnValue({
                limit: jest.fn().mockReturnThis(),
                sort: jest.fn().mockResolvedValue(transactions)
            });
            OverallStat.find.mockResolvedValue(overallStat);
            yield getDashboardStats(req, res);
            expect(Transaction.find).toHaveBeenCalled();
            expect(OverallStat.find).toHaveBeenCalledWith({ year: 2021 });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                totalCustomers: 100,
                yearlyTotalSoldUnits: 1000,
                yearlySalesTotal: 50000,
                monthlyData: overallStat[0].monthlyData,
                salesByCategory: overallStat[0].salesByCategory,
                thisMonthStats: overallStat[0].monthlyData[0],
                todayStats: overallStat[0].dailyData[0],
                transactions
            });
        }));
        it("should return 404 if an error occurs", () => __awaiter(void 0, void 0, void 0, function* () {
            const req = mockRequest();
            const res = mockResponse();
            const error = new Error("Database error");
            Transaction.find.mockReturnValue({
                limit: jest.fn().mockReturnThis(),
                sort: jest.fn().mockRejectedValue(error)
            });
            OverallStat.find.mockRejectedValue(error);
            yield getDashboardStats(req, res);
            expect(Transaction.find).toHaveBeenCalled();
            expect(OverallStat.find).toHaveBeenCalledWith({ year: 2021 });
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: error.message });
        }));
    });
});
