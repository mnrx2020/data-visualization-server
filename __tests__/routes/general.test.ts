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
  it("should fetch a user by ID", async () => {
    const response = await request(app).get("/user/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: "1", name: "Test User" });
  });

  it("should fetch dashboard stats", async () => {
    const response = await request(app).get("/dashboard");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ stats: "Dashboard Stats" });
  });

  it("should handle errors on getUser", async () => {
    const errorMessage = "Internal server error";
    (getUser as jest.Mock).mockImplementationOnce((req, res) => {
      res.status(500).json({ message: errorMessage });
    });

    const response = await request(app).get("/user/1");
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: errorMessage });
  });

  it("should handle errors on getDashboardStats", async () => {
    const errorMessage = "Internal server error";
    (getDashboardStats as jest.Mock).mockImplementationOnce((req, res) => {
      res.status(500).json({ message: errorMessage });
    });

    const response = await request(app).get("/dashboard");
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: errorMessage });
  });
});
