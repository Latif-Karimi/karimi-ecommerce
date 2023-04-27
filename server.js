import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoute from './routes/authRoute.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cors from "cors"
import productRoutes from "./routes/productRoute.js"
import bodyParser from'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

//configure env
dotenv.config();

//database confiq
connectDB();


//esmodeule fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//rest object
const app = express();

//middelwares
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors())
app.use(express.json());
app.use(express.static(path.join(__dirname, './client/build')))




//routes
app.use('/api/auth', authRoute);
app.use('/api/category', categoryRoutes);
app.use("/api/product",productRoutes )
// //rest API
app.use('*',function(req,res){
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});
//port
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is Running on Port ${PORT}`);
});
