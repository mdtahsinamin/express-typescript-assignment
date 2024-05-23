import { Request, Response } from 'express';
import orderValidationSchema from './order.validate';
import { OrderService } from './order.service';
import { ApiResponse } from '../../utils/ApiResponse';
import ApiError from '../../utils/ApiError';
import { ProductService } from '../product/product.service';
import { TOrder } from './order.interface';

const createOrder = async (req: Request, res: Response) => {
  try {
    const orderData: TOrder = req.body.order;

    const zodParseData = orderValidationSchema.parse(orderData); // zod validation

    const product = await ProductService.getSingleProductFromDB(
      orderData.productId,
    );

    if (!product) {
      throw new ApiError(400, 'Product not exists');
    }
    if (orderData.quantity > product.inventory.quantity) {
      throw new ApiError(400, 'Insufficient stock');
    }

    const result = await OrderService.createOrderIntoDB(zodParseData);

    return res
      .status(201)
      .json(new ApiResponse(200, result, 'Order created successfully!'));
  } catch (error) {
    throw new ApiError(500, 'Something went wrong while create a new order');
  }
};

const getAllOrders = async (req: Request, res: Response) => {
  try {
    const email = req.query.email;

    let query = {};
    let isQuery = false;

    if (email) {
      query = { email };
      isQuery = true;
    }

    const result = await OrderService.getAllOrdersFromDB(query);

    if (isQuery) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            result,
            'Orders fetched successfully for user email!',
          ),
        );
    } else {
      return res
        .status(200)
        .json(new ApiResponse(200, result, 'Orders fetched successfully!'));
    }
  } catch (error) {
    throw new ApiError(404, 'Something went wrong while fetched the orders');
  }
};

export const OrderControllers = {
  createOrder,
  getAllOrders,
};
