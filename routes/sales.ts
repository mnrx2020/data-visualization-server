import express, { Request, Response } from "express";
import { getSales } from "../controllers/sales.ts";

const router = express.Router();

router.get("/sales", async (req: Request, res: Response) => {
  try {
    await getSales(req, res);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
