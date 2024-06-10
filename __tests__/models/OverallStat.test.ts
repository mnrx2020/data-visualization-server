// __tests__/models/OverallStat.test.ts

import mongoose from 'mongoose';
import OverallStat from '../../models/OverallStat.ts';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

describe('OverallStat Model Test', () => {
  // Connect to the database before running any tests
  beforeAll(async () => {
    const mongoURI = process.env.MONGO_URI_TEST; // Retrieve MongoDB URI from environment variables
    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined in the .env file');
    }
    await mongoose.connect(mongoURI, {
      
    });
  });

  // Clear the database after each test
  afterEach(async () => {
    await OverallStat.deleteMany({});
  });

  // Disconnect from the database after all tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create an OverallStat successfully', async () => {
    const sampleOverallStat = {
      totalCustomers: 100,
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
      salesByCategory: new Map([
        ['electronics', 20000],
        ['clothing', 15000],
      ]),
    };

    const overallStat = new OverallStat(sampleOverallStat);
    const savedOverallStat = await overallStat.save();

    expect(savedOverallStat._id).toBeDefined();
    expect(savedOverallStat.totalCustomers).toBe(sampleOverallStat.totalCustomers);
    expect(savedOverallStat.yearlySalesTotal).toBe(sampleOverallStat.yearlySalesTotal);
    expect(savedOverallStat.yearlyTotalSoldUnits).toBe(sampleOverallStat.yearlyTotalSoldUnits);
    expect(savedOverallStat.year).toBe(sampleOverallStat.year);
    expect(savedOverallStat.monthlyData.length).toBe(2);
    expect(savedOverallStat.dailyData.length).toBe(2);

    // Add checks to ensure salesByCategory is defined
    if (savedOverallStat.salesByCategory) {
      expect(savedOverallStat.salesByCategory.get('electronics')).toBe(20000);
      expect(savedOverallStat.salesByCategory.get('clothing')).toBe(15000);
    } else {
      throw new Error('salesByCategory is null or undefined');
    }
  });
});
