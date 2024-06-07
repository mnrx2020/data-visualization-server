import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import clientRoutes from "./routes/client";
import generalRoutes from "./routes/general";
import managementRoutes from "./routes/management";
import salesRoutes from "./routes/sales";

// Data imports
import User from "./models/User";
import Product from "./models/Product";
import ProductStat from "./models/ProductStat";
import Transaction from "./models/Transaction";
import OverallStat from "./models/OverallStat";
import AffiliateStat from "./models/AffiliateStat";
import { dataUser, dataProduct, dataProductStat, dataTransaction, dataOverallStat, dataAffiliateStat } from "./data";

/* CONFIGURATION */
dotenv.config();
const app: Application = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */
app.use("/client", clientRoutes);
app.use("/general", generalRoutes);
app.use("/management", managementRoutes);
app.use("/sales", salesRoutes);

/* MONGOOSE SETUP */
const PORT: number | string = process.env.PORT || 9000;

mongoose
  .connect(process.env.MONGO_URI || "", {
   
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
    /* ONLY ADD DATA ONE TIME */
     //AffiliateStat.insertMany(dataAffiliateStat)
     //OverallStat.insertMany(dataOverallStat)
     //Product.insertMany(dataProduct)
     //ProductStat.insertMany(dataProductStat)
     //Transaction.insertMany(dataTransaction)
     //User.insertMany(dataUser)
  })
  .catch((error: Error) => console.error(`${error.message} did not connect`));
