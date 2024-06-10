var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
export const getAdmins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admins = yield User.find({ role: "admin" }).select("-password");
        res.status(200).json(admins);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ message: error.message });
        }
        else {
            res.status(404).json({ message: "Unknown error" });
        }
    }
});
export const getUserPerformance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userWithStats = yield User.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) } },
            {
                $lookup: {
                    from: "affiliatestats",
                    localField: "_id",
                    foreignField: "userId",
                    as: "affiliateStats",
                },
            },
            { $unwind: "$affiliateStats" },
        ]);
        const saleTransactions = yield Promise.all(userWithStats[0].affiliateStats.affiliateSales.map((id) => {
            return Transaction.findById(id);
        }));
        const filteredSaleTransactions = saleTransactions.filter((transaction) => transaction !== null);
        res
            .status(200)
            .json({ user: userWithStats[0], sales: filteredSaleTransactions });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ message: error.message });
        }
        else {
            res.status(404).json({ message: "Unknown error" });
        }
    }
});
