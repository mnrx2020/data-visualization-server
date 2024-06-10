// __tests__/models/AffiliateStat.test.ts

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import AffiliateStat from '../../models/AffiliateStat';
import User from '../../models/User';
import Transaction from '../../models/Transaction';

// Load environment variables from .env file
dotenv.config();

describe('AffiliateStat Model Test', () => {
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
    await AffiliateStat.deleteMany({});
    await User.deleteMany({});
    await Transaction.deleteMany({});
  });

  // Disconnect from the database after all tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create an AffiliateStat successfully', async () => {
    const user = new User({ 
      name: 'John Doe', 
      email: 'john.doe@example.com', // Added email
      password: 'securepassword123'  // Added password
    });
    await user.save();

    const transaction1 = new Transaction({ amount: 100 });
    const transaction2 = new Transaction({ amount: 200 });
    await transaction1.save();
    await transaction2.save();

    const affiliateStat = new AffiliateStat({
      userId: user._id,
      affiliateSales: [transaction1._id, transaction2._id],
    });

    const savedAffiliateStat = await affiliateStat.save();
    
    expect(savedAffiliateStat._id).toBeDefined();
    expect(savedAffiliateStat.userId).toBe(user._id);
    expect(savedAffiliateStat.affiliateSales.length).toBe(2);
    expect(savedAffiliateStat.affiliateSales).toContain(transaction1._id);
    expect(savedAffiliateStat.affiliateSales).toContain(transaction2._id);
  });
});
