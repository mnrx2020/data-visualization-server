// __tests__/models/Products.test.ts

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../../models/Product'; // Ensure this matches the exact file name

// Load environment variables from .env file
dotenv.config();

describe('Product Model Test', () => {
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
    await Product.deleteMany({});
  });

  // Disconnect from the database after all tests
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a Product successfully', async () => {
    const sampleProduct = {
      name: 'Sample Product',
      price: 100,
      description: 'This is a sample product.',
      category: 'Electronics',
      rating: 4.5,
      supply: 50,
    };

    const product = new Product(sampleProduct);
    const savedProduct = await product.save();

    expect(savedProduct._id).toBeDefined();
    expect(savedProduct.name).toBe(sampleProduct.name);
    expect(savedProduct.price).toBe(sampleProduct.price);
    expect(savedProduct.description).toBe(sampleProduct.description);
    expect(savedProduct.category).toBe(sampleProduct.category);
    expect(savedProduct.rating).toBe(sampleProduct.rating);
    expect(savedProduct.supply).toBe(sampleProduct.supply);
  });
});
