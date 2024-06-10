import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db';
import clientRoutes from './routes/client';
import generalRoutes from './routes/general';
import managementRoutes from './routes/management';
import salesRoutes from './routes/sales';

// Data imports
import User from './models/User';
import Product from './models/Product';
import ProductStat from './models/ProductStat';
import Transaction from './models/Transaction';
import OverallStat from './models/OverallStat';
import AffiliateStat from './models/AffiliateStat';
import { dataUser, dataProduct, dataProductStat, dataTransaction, dataOverallStat, dataAffiliateStat } from './data';

/* CONFIGURATION */
dotenv.config();
const app: Application = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/* ROUTES */
app.use('/client', clientRoutes);
app.use('/general', generalRoutes);
app.use('/management', managementRoutes);
app.use('/sales', salesRoutes);

/* DATABASE CONNECTION */
const startServer = async () => {
  try {
    await connectDB();
    const PORT: number | string = process.env.PORT || 9000;
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    // Insert data if needed
    // Uncomment the lines below to insert data one time
     //await AffiliateStat.insertMany(dataAffiliateStat);
     //await OverallStat.insertMany(dataOverallStat);
     //await Product.insertMany(dataProduct);
     //await ProductStat.insertMany(dataProductStat);
     //await Transaction.insertMany(dataTransaction);
     //await User.insertMany(dataUser);

  } catch (error) {
    console.error(`${error instanceof Error ? error.message : 'An unknown error occurred'} did not connect`);
  }
};

startServer();
