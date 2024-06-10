// __tests__/models/Products.test.ts
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
import Product from '../../models/Product'; // Ensure this matches the exact file name
// Load environment variables from .env file
dotenv.config();
describe('Product Model Test', () => {
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
        yield Product.deleteMany({});
    }));
    // Disconnect from the database after all tests
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose.connection.close();
    }));
    it('should create a Product successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const sampleProduct = {
            name: 'Sample Product',
            price: 100,
            description: 'This is a sample product.',
            category: 'Electronics',
            rating: 4.5,
            supply: 50,
        };
        const product = new Product(sampleProduct);
        const savedProduct = yield product.save();
        expect(savedProduct._id).toBeDefined();
        expect(savedProduct.name).toBe(sampleProduct.name);
        expect(savedProduct.price).toBe(sampleProduct.price);
        expect(savedProduct.description).toBe(sampleProduct.description);
        expect(savedProduct.category).toBe(sampleProduct.category);
        expect(savedProduct.rating).toBe(sampleProduct.rating);
        expect(savedProduct.supply).toBe(sampleProduct.supply);
    }));
});
