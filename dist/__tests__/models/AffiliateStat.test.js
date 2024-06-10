// __tests__/models/AffiliateStat.test.ts
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
import AffiliateStat from '../../models/AffiliateStat';
import User from '../../models/User';
import Transaction from '../../models/Transaction';
// Load environment variables from .env file
dotenv.config();
describe('AffiliateStat Model Test', () => {
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
        yield AffiliateStat.deleteMany({});
        yield User.deleteMany({});
        yield Transaction.deleteMany({});
    }));
    // Disconnect from the database after all tests
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose.connection.close();
    }));
    it('should create an AffiliateStat successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = new User({
            name: 'John Doe',
            email: 'john.doe@example.com', // Added email
            password: 'securepassword123' // Added password
        });
        yield user.save();
        const transaction1 = new Transaction({ amount: 100 });
        const transaction2 = new Transaction({ amount: 200 });
        yield transaction1.save();
        yield transaction2.save();
        const affiliateStat = new AffiliateStat({
            userId: user._id,
            affiliateSales: [transaction1._id, transaction2._id],
        });
        const savedAffiliateStat = yield affiliateStat.save();
        expect(savedAffiliateStat._id).toBeDefined();
        expect(savedAffiliateStat.userId).toBe(user._id);
        expect(savedAffiliateStat.affiliateSales.length).toBe(2);
        expect(savedAffiliateStat.affiliateSales).toContain(transaction1._id);
        expect(savedAffiliateStat.affiliateSales).toContain(transaction2._id);
    }));
});
