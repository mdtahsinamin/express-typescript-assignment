import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import productRoute from './app/modules/product/product.route';
import orderRoute from './app/modules/order/order.route';
import ApiError from './app/utils/ApiError';
const app: Application = express();

// parser
app.use(express.json());
app.use(cors());

// Application routes
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  throw new ApiError(404, 'Route not found');
});

export default app;
