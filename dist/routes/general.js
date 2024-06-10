var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import { getUser, getDashboardStats } from "../controllers/general.js";
const router = express.Router();
router.get("/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield getUser(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}));
router.get("/dashboard", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield getDashboardStats(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}));
export default router;
