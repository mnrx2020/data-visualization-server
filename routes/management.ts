import express, { Request, Response } from "express";
import { getAdmins, getUserPerformance } from "../controllers/management";

const router = express.Router();

router.get("/admins", async (req: Request, res: Response) => {
  try {
    await getAdmins(req, res);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/performance/:id", async (req: Request, res: Response) => {
  try {
    await getUserPerformance(req, res);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
