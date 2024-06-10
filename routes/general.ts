import express, { Request, Response } from "express";
import { getUser, getDashboardStats } from "../controllers/general.ts";

const router = express.Router();

router.get("/user/:id", async (req: Request, res: Response) => {
  try {
    await getUser(req, res);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/dashboard", async (req: Request, res: Response) => {
  try {
    await getDashboardStats(req, res);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
