import { TOrder } from './order.interface';
import { Order } from './order.model';

// send order data into db
const createOrderIntoDB = async (orderData: TOrder) => {
  const result = await Order.create(orderData);

  return result;
};

// get all order and also handle query
const getAllOrdersFromDB = async (query: Record<string, any>) => {
  const result = await Order.find(query);
  const isOrderCount = result.length > 0 ? true : false;

  return { result, isOrderCount };
};

export const OrderService = {
  createOrderIntoDB,
  getAllOrdersFromDB,
};
