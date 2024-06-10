var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import request from "supertest";
import express from "express";
import router from "../../routes/general";
import { getUser, getDashboardStats } from "../../controllers/general";
jest.mock("../../controllers/general", () => ({
    getUser: jest.fn((req, res) => res.status(200).json({ id: req.params.id, name: "Test User" })),
    getDashboardStats: jest.fn((req, res) => res.status(200).json({ stats: "Dashboard Stats" })),
}));
const app = express();
app.use(express.json());
app.use("/", router);
describe("General routes", () => {
    it("should fetch a user by ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app).get("/user/1");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ id: "1", name: "Test User" });
    }));
    it("should fetch dashboard stats", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request(app).get("/dashboard");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ stats: "Dashboard Stats" });
    }));
    it("should handle errors on getUser", () => __awaiter(void 0, void 0, void 0, function* () {
        const errorMessage = "Internal server error";
        getUser.mockImplementationOnce((req, res) => {
            res.status(500).json({ message: errorMessage });
        });
        const response = yield request(app).get("/user/1");
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: errorMessage });
    }));
    it("should handle errors on getDashboardStats", () => __awaiter(void 0, void 0, void 0, function* () {
        const errorMessage = "Internal server error";
        getDashboardStats.mockImplementationOnce((req, res) => {
            res.status(500).json({ message: errorMessage });
        });
        const response = yield request(app).get("/dashboard");
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: errorMessage });
    }));
});
