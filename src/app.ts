import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import productRoute from './app/modules/product/product.route';
import orderRoute from './app/modules/order/order.route';
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

export default app;
