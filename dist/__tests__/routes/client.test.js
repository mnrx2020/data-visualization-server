var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// __tests__/routes/client.test.ts
import request from "supertest";
import express from "express";
import router from "../../routes/client";
import { getProducts } from "../../controllers/client";
// Mocking controller functions
jest.mock("../../controllers/client", () => ({
    getProducts: jest.fn((req, res) => res.status(200).json({ products: [] })),
    getCustomers: jest.fn((req, res) => res.status(200).json({ customers: [] })),
    getTransactions: jest.fn((req, res) => res.status(200).json({ transactions: [] })),
    getGeography: jest.fn((req, res) => res.status(200).json({ geography: [] })),
}));
const app = express();
app.use(express.json());
app.use("/", router);
describe("Client routes", () => {
    it("should fetch products", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app).get("/products");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ products: [] });
    }));
    it("should fetch customers", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app).get("/customers");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ customers: [] });
    }));
    it("should fetch transactions", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app).get("/transactions");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ transactions: [] });
    }));
    it("should fetch geography", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app).get("/geography");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ geography: [] });
    }));
    it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
        const errorMessage = "Internal server error";
        getProducts.mockImplementationOnce((req, res) => {
            res.status(500).json({ message: errorMessage });
        });
        const response = yield request(app).get("/products");
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: errorMessage });
    }));
});
