var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';
import clientRoutes from './routes/client.js';
import generalRoutes from './routes/general.js';
import managementRoutes from './routes/management.js';
import salesRoutes from './routes/sales.js';
/* CONFIGURATION */
dotenv.config();
const app = express();
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
app.get("/", (req, res) => {
    res.send("API WORKING");
});
app.use(cors({
    origin: ["http://localhost:5001",
        "https://mnrx-mern-admin-dashboard-client-app.onrender.com",
    ]
}));
app.use(express.urlencoded({ extended: false }));
/* DATABASE CONNECTION */
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectDB();
        const PORT = process.env.PORT || 9000;
        app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
        // Insert data if needed
        // Uncomment the lines below to insert data one time
        //await AffiliateStat.insertMany(dataAffiliateStat);
        //await OverallStat.insertMany(dataOverallStat);
        //await Product.insertMany(dataProduct);
        //await ProductStat.insertMany(dataProductStat);
        //await Transaction.insertMany(dataTransaction);
        //await User.insertMany(dataUser);
    }
    catch (error) {
        console.error(`${error instanceof Error ? error.message : 'An unknown error occurred'} did not connect`);
    }
});
startServer();
