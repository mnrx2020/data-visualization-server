import express, { Request, Response } from "express";
import { getProducts, getCustomers, getTransactions, getGeography } from "../controllers/client";

const router = express.Router();

router.get("/products", async (req: Request, res: Response) => {
  try {
    await getProducts(req, res);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/customers", async (req: Request, res: Response) => {
  try {
    await getCustomers(req, res);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/transactions", async (req: Request, res: Response) => {
  try {
    await getTransactions(req, res);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/geography", async (req: Request, res: Response) => {
  try {
    await getGeography(req, res);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
