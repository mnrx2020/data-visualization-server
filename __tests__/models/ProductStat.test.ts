// __tests__/models/ProductStat.test.ts

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ProductStat from '../../models/ProductStat.ts';

// Load environment variables from .env file
dotenv.config();

describe('ProductStat Model Test', () => {
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
    await ProductStat.deleteMany({});
  });

  // Disconnect from the database after all tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a ProductStat successfully', async () => {
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
    const savedProductStat = await productStat.save();

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
  });
});
