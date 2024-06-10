// __tests__/models/Transaction.test.ts
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
import Transaction from '../../models/Transaction';
// Load environment variables from .env file
dotenv.config();
describe('Transaction Model Test', () => {
    // Connect to the database before running any tests
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        const mongoURI = process.env.MONGO_URI_TEST; // Retrieve MongoDB URI from environment variables
        if (!mongoURI) {
            throw new Error('MONGO_URI is not defined in the .env file');
        }
        yield mongoose.connect(mongoURI, {
        // Add your mongoose connection options here if needed
        });
    }), 30000); // Increase timeout to 30 seconds
    // Clear the database after each test
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield Transaction.deleteMany({});
    }));
    // Disconnect from the database after all tests
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose.connection.close();
    }));
    it('should create a Transaction successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const sampleTransaction = {
            userId: '12345',
            cost: '100',
            products: [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()],
        };
        const transaction = new Transaction(sampleTransaction);
        const savedTransaction = yield transaction.save();
        expect(savedTransaction._id).toBeDefined();
        expect(savedTransaction.userId).toBe(sampleTransaction.userId);
        expect(savedTransaction.cost).toBe(sampleTransaction.cost);
        expect(savedTransaction.products.length).toBe(2);
        expect(savedTransaction.products).toContain(sampleTransaction.products[0]);
        expect(savedTransaction.products).toContain(sampleTransaction.products[1]);
    }), 30000); // Increase timeout to 30 seconds
});
