import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import path from 'path';

import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import investmentRoutes from './routes/investmentRoutes.js';
import commissionRoutes from './routes/commissionRoutes.js';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

dotenv.config();
const port = process.env.PORT || 5000;
const app = express();

// Body parser middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/uploads/receipts', express.static(path.join('uploads', 'receipts')));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  
    next();
});

app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/commissions', commissionRoutes);

app.use(notFound);
app.use(errorHandler);

app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, (err) => {
            console.log(err);
        });
    }
  
    if (res.headerSent) {
        return next(error);
    }
  
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occured!' });
});

mongoose
    .connect(
        process.env.MONGO_URI
    )
    .then(() => {
        app.listen(port, () => console.log(`Server running on port ${port}...`));
    })
    .catch((err) => {
        console.log(err);
    });