import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { errorHandler } from './middleware/errors.middleware.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
import cors from 'cors';
app.use(cors());
import cabinsRoutes from './routes/cabinsRoutes.js';
import ordersRoutes from './routes/ordersRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));
app.use("/cabins",cabinsRoutes);
app.use("/users",usersRoutes);
app.use("/orders",ordersRoutes);
app.use(errorHandler);
export default app;


