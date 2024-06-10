var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import getCountryIso3 from "country-iso-2-to-3";
export const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product.find();
        const productsWithStats = yield Promise.all(products.map((product) => __awaiter(void 0, void 0, void 0, function* () {
            const stat = yield ProductStat.find({
                productId: product._id,
            });
            return Object.assign(Object.assign({}, product.toObject()), { // Convert Mongoose document to plain object
                stat });
        })));
        res.status(200).json(productsWithStats);
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
export const getCustomers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customers = yield User.find({ role: "user" }).select("-password");
        res.status(200).json(customers);
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
export const getTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;
        const generateSort = () => {
            if (!sort)
                return {};
            const sortParsed = JSON.parse(sort);
            return { [sortParsed.field]: sortParsed.sort === "asc" ? 1 : -1 };
        };
        const sortFormatted = generateSort();
        const transactions = yield Transaction.find({
            $or: [
                { cost: { $regex: new RegExp(search, "i") } },
                { userId: { $regex: new RegExp(search, "i") } },
            ],
        })
            .sort(sortFormatted)
            .skip(page * pageSize)
            .limit(pageSize);
        const total = yield Transaction.countDocuments({
            $or: [
                { cost: { $regex: new RegExp(search, "i") } },
                { userId: { $regex: new RegExp(search, "i") } },
            ],
        });
        res.status(200).json({ transactions, total });
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
export const getGeography = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User.find();
        const mappedLocations = users.reduce((acc, user) => {
            const countryISO3 = user.country ? getCountryIso3(user.country) : null;
            if (countryISO3) {
                if (!acc[countryISO3]) {
                    acc[countryISO3] = 0;
                }
                acc[countryISO3]++;
            }
            return acc;
        }, {});
        const formattedLocations = Object.entries(mappedLocations).map(([country, count]) => {
            return { id: country, value: count };
        });
        res.status(200).json(formattedLocations);
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
