// __tests__/routes/client.test.ts
import request from "supertest";
import express from "express";
import router from "../../routes/client";
import { getProducts, getCustomers, getTransactions, getGeography } from "../../controllers/client";

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
  it("should fetch products", async () => {
    const response = await request(app).get("/products");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ products: [] });
  });

  it("should fetch customers", async () => {
    const response = await request(app).get("/customers");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ customers: [] });
  });

  it("should fetch transactions", async () => {
    const response = await request(app).get("/transactions");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ transactions: [] });
  });

  it("should fetch geography", async () => {
    const response = await request(app).get("/geography");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ geography: [] });
  });

  it("should handle errors", async () => {
    const errorMessage = "Internal server error";
    (getProducts as jest.Mock).mockImplementationOnce((req, res) => {
      res.status(500).json({ message: errorMessage });
    });

    const response = await request(app).get("/products");
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: errorMessage });
  });
});
