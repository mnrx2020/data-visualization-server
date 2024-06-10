import { getUser, getDashboardStats } from "../../controllers/general.ts";
import User from "../../models/User.ts";
import OverallStat from "../../models/OverallStat.ts";
import Transaction from "../../models/Transaction.ts";
import { Request, Response } from "express";

// Mock utility functions for request and response
interface MockRequest extends Partial<Request> {}
interface MockResponse extends Partial<Response> {
  status: jest.Mock;
  json: jest.Mock;
}

const mockRequest = (params = {}, body = {}, query = {}): MockRequest => ({
  params,
  body,
  query,
});

const mockResponse = (): MockResponse => {
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
    it("should return user data if user is found", async () => {
      const req = mockRequest({ id: "1" });
      const res = mockResponse();

      const user = { _id: "1", name: "John Doe" };
      (User.findById as jest.Mock).mockResolvedValue(user);

      await getUser(req as Request, res as Response);

      expect(User.findById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(user);
    });

    it("should return 404 if user is not found", async () => {
      const req = mockRequest({ id: "1" });
      const res = mockResponse();

      (User.findById as jest.Mock).mockResolvedValue(null);

      await getUser(req as Request, res as Response);

      expect(User.findById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should return 404 if an error occurs", async () => {
      const req = mockRequest({ id: "1" });
      const res = mockResponse();

      const error = new Error("Database error");
      (User.findById as jest.Mock).mockRejectedValue(error);

      await getUser(req as Request, res as Response);

      expect(User.findById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });

  describe("getDashboardStats", () => {
    it("should return dashboard statistics", async () => {
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

      (Transaction.find as jest.Mock).mockReturnValue({
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(transactions)
      });
      (OverallStat.find as jest.Mock).mockResolvedValue(overallStat);

      await getDashboardStats(req as Request, res as Response);

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
    });

    it("should return 404 if an error occurs", async () => {
      const req = mockRequest();
      const res = mockResponse();

      const error = new Error("Database error");
      (Transaction.find as jest.Mock).mockReturnValue({
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockRejectedValue(error)
      });
      (OverallStat.find as jest.Mock).mockRejectedValue(error);

      await getDashboardStats(req as Request, res as Response);

      expect(Transaction.find).toHaveBeenCalled();
      expect(OverallStat.find).toHaveBeenCalledWith({ year: 2021 });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: error.message });
    });
  });
});
