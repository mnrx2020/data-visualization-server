import { Request, Response } from "express";
import Product from "../models/Product.ts";
import ProductStat from "../models/ProductStat.ts";
import User from "../models/User.ts";
import Transaction from "../models/Transaction.ts";
import getCountryIso3 from "country-iso-2-to-3";

interface SortOptions {
  field: string;
  sort: "asc" | "desc";
}

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();

    const productsWithStats = await Promise.all(
      products.map(async (product) => {
        const stat = await ProductStat.find({
          productId: product._id,
        });
        return {
          ...product.toObject(), // Convert Mongoose document to plain object
          stat,
        };
      })
    );
    res.status(200).json(productsWithStats);
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(404).json({ message: "Unknown error" });
    }
  }
};

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await User.find({ role: "user" }).select("-password");
    res.status(200).json(customers);
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(404).json({ message: "Unknown error" });
    }
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const { page = 1, pageSize = 20, sort = null, search = "" } = req.query as {
      page?: number;
      pageSize?: number;
      sort?: string;
      search?: string;
    };

    const generateSort = () => {
      if (!sort) return {};
      const sortParsed: SortOptions = JSON.parse(sort);
      return { [sortParsed.field]: sortParsed.sort === "asc" ? 1 : -1 } as { [key: string]: 1 | -1 };
    };
    const sortFormatted = generateSort();

    const transactions = await Transaction.find({
      $or: [
        { cost: { $regex: new RegExp(search, "i") } },
        { userId: { $regex: new RegExp(search, "i") } },
      ],
    })
      .sort(sortFormatted)
      .skip(page * pageSize)
      .limit(pageSize);

    const total = await Transaction.countDocuments({
      $or: [
        { cost: { $regex: new RegExp(search, "i") } },
        { userId: { $regex: new RegExp(search, "i") } },
      ],
    });

    res.status(200).json({ transactions, total });
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(404).json({ message: "Unknown error" });
    }
  }
};

export const getGeography = async (req: Request, res: Response) => {
  try {
    const users = await User.find();

    const mappedLocations = users.reduce((acc: { [key: string]: number }, user) => {
      const countryISO3 = user.country ? getCountryIso3(user.country) : null;
      if (countryISO3) {
        if (!acc[countryISO3]) {
          acc[countryISO3] = 0;
        }
        acc[countryISO3]++;
      }
      return acc;
    }, {});

    const formattedLocations = Object.entries(mappedLocations).map(
      ([country, count]) => {
        return { id: country, value: count };
      }
    );

    res.status(200).json(formattedLocations);
  } catch (error) {
    if (error instanceof Error) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(404).json({ message: "Unknown error" });
    }
  }
};
