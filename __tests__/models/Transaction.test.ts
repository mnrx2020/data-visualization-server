// __tests__/models/Transaction.test.ts

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Transaction from '../../models/Transaction';

// Load environment variables from .env file
dotenv.config();

describe('Transaction Model Test', () => {
  // Connect to the database before running any tests
  beforeAll(async () => {
    const mongoURI = process.env.MONGO_URI_TEST; // Retrieve MongoDB URI from environment variables
    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined in the .env file');
    }
    await mongoose.connect(mongoURI, {
      // Add your mongoose connection options here if needed
    });
  }, 30000); // Increase timeout to 30 seconds

  // Clear the database after each test
  afterEach(async () => {
    await Transaction.deleteMany({});
  });

  // Disconnect from the database after all tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a Transaction successfully', async () => {
    const sampleTransaction = {
      userId: '12345',
      cost: '100',
      products: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
    };

    const transaction = new Transaction(sampleTransaction);
    const savedTransaction = await transaction.save();

    expect(savedTransaction._id).toBeDefined();
    expect(savedTransaction.userId).toBe(sampleTransaction.userId);
    expect(savedTransaction.cost).toBe(sampleTransaction.cost);
    expect(savedTransaction.products.length).toBe(2);
    expect(savedTransaction.products).toContain(sampleTransaction.products[0]);
    expect(savedTransaction.products).toContain(sampleTransaction.products[1]);
  }, 30000); // Increase timeout to 30 seconds
});
