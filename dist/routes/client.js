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
import { getProducts, getCustomers, getTransactions, getGeography } from "../controllers/client.js";
const router = express.Router();
router.get("/products", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield getProducts(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}));
router.get("/customers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield getCustomers(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}));
router.get("/transactions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield getTransactions(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}));
router.get("/geography", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield getGeography(req, res);
    }
    catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}));
export default router;
