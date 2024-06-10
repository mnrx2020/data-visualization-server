// __tests__/models/User.test.ts
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
import User from '../../models/User';
// Load environment variables from .env file
dotenv.config();
describe('User Model Test', () => {
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
        yield User.deleteMany({});
    }));
    // Disconnect from the database after all tests
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose.connection.close();
    }));
    it('should create a User successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const sampleUser = {
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
            password: 'securepassword',
            city: 'Sample City',
            state: 'Sample State',
            country: 'Sample Country',
            occupation: 'Sample Occupation',
            phoneNumber: '123-456-7890',
            transactions: [],
            role: 'user',
        };
        const user = new User(sampleUser);
        const savedUser = yield user.save();
        expect(savedUser._id).toBeDefined();
        expect(savedUser.name).toBe(sampleUser.name);
        expect(savedUser.email).toBe(sampleUser.email);
        expect(savedUser.password).toBe(sampleUser.password);
        expect(savedUser.city).toBe(sampleUser.city);
        expect(savedUser.state).toBe(sampleUser.state);
        expect(savedUser.country).toBe(sampleUser.country);
        expect(savedUser.occupation).toBe(sampleUser.occupation);
        expect(savedUser.phoneNumber).toBe(sampleUser.phoneNumber);
        expect(savedUser.transactions).toEqual(sampleUser.transactions);
        expect(savedUser.role).toBe(sampleUser.role);
    }), 30000); // Increase timeout to 30 seconds
    it('should not create a User without required fields', () => __awaiter(void 0, void 0, void 0, function* () {
        const incompleteUser = {
            email: 'incomplete@example.com',
            password: 'password123',
        };
        let err; // Explicitly define err as any
        try {
            const user = new User(incompleteUser);
            yield user.save();
        }
        catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.name).toBeDefined();
    }), 30000); // Increase timeout to 30 seconds
    it('should not create a User with a duplicate email', () => __awaiter(void 0, void 0, void 0, function* () {
        const sampleUser = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'password123',
            city: 'Sample City',
            state: 'Sample State',
            country: 'Sample Country',
            occupation: 'Sample Occupation',
            phoneNumber: '123-456-7890',
            transactions: [],
            role: 'user',
        };
        const user1 = new User(sampleUser);
        yield user1.save();
        let err; // Explicitly define err as any
        try {
            const user2 = new User(sampleUser);
            yield user2.save();
        }
        catch (error) {
            err = error;
        }
        if (err.name === 'MongoServerError' && err.code === 11000) {
            // Handle duplicate key error
            expect(err.code).toBe(11000); // Duplicate key error code
        }
        else {
            // If the error is not what we expect, rethrow it
            throw err;
        }
    }), 30000); // Increase timeout to 30 seconds
});
