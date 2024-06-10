import { Request, Response } from "express";
import OverallStat from "../models/OverallStat.ts";

export const getSales = async (req: Request, res: Response) => {
  try {
    const overallStats = await OverallStat.find();
    res.status(200).json(overallStats[0]);
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(404).json({ message: "Unknown error" });
    }
  }
};
