// __tests__/models/ProductStat.test.ts
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
import dotenv from 'dotenv';
import ProductStat from '../../models/ProductStat';
// Load environment variables from .env file
dotenv.config();
describe('ProductStat Model Test', () => {
    // Connect to the database before running any tests
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const mongoURI = process.env.MONGO_URI_TEST; // Retrieve MongoDB URI from environment variables
        if (!mongoURI) {
            throw new Error('MONGO_URI is not defined in the .env file');
        }
        yield mongoose.connect(mongoURI, {});
    }));
    // Clear the database after each test
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield ProductStat.deleteMany({});
    }));
    // Disconnect from the database after all tests
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose.connection.close();
    }));
    it('should create a ProductStat successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const sampleProductStat = {
            productId: '12345',
            yearlySalesTotal: 50000,
            yearlyTotalSoldUnits: 300,
            year: 2023,
            monthlyData: [
                { month: 'January', totalSales: 4000, totalUnits: 30 },
                { month: 'February', totalSales: 5000, totalUnits: 35 },
            ],
            dailyData: [
                { date: '2023-01-01', totalSales: 150, totalUnits: 5 },
                { date: '2023-01-02', totalSales: 200, totalUnits: 10 },
            ],
        };
        const productStat = new ProductStat(sampleProductStat);
        const savedProductStat = yield productStat.save();
        expect(savedProductStat._id).toBeDefined();
        expect(savedProductStat.productId).toBe(sampleProductStat.productId);
        expect(savedProductStat.yearlySalesTotal).toBe(sampleProductStat.yearlySalesTotal);
        expect(savedProductStat.yearlyTotalSoldUnits).toBe(sampleProductStat.yearlyTotalSoldUnits);
        expect(savedProductStat.year).toBe(sampleProductStat.year);
        expect(savedProductStat.monthlyData.length).toBe(2);
        expect(savedProductStat.dailyData.length).toBe(2);
        // Check monthlyData
        expect(savedProductStat.monthlyData[0].month).toBe('January');
        expect(savedProductStat.monthlyData[0].totalSales).toBe(4000);
        expect(savedProductStat.monthlyData[0].totalUnits).toBe(30);
        expect(savedProductStat.monthlyData[1].month).toBe('February');
        expect(savedProductStat.monthlyData[1].totalSales).toBe(5000);
        expect(savedProductStat.monthlyData[1].totalUnits).toBe(35);
        // Check dailyData
        expect(savedProductStat.dailyData[0].date).toBe('2023-01-01');
        expect(savedProductStat.dailyData[0].totalSales).toBe(150);
        expect(savedProductStat.dailyData[0].totalUnits).toBe(5);
        expect(savedProductStat.dailyData[1].date).toBe('2023-01-02');
        expect(savedProductStat.dailyData[1].totalSales).toBe(200);
        expect(savedProductStat.dailyData[1].totalUnits).toBe(10);
    }));
});
