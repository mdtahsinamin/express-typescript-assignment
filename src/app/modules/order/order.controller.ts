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

    // find by product id
    const product = await ProductService.getSingleProductFromDB(
      orderData.productId,
    );

    // product exists or not
    if (!product) {
      throw new ApiError(400, 'Product not exists');
    }

    // Check if ordered quantity exceeds available quantity in inventory
    if (orderData.quantity > product.inventory.quantity) {
      throw new ApiError(400, 'Insufficient quantity available in inventory');
    }

    // Update inventory quantity and inStock status
    if ((product.inventory.quantity -= orderData.quantity) >= 0) {
      product.inventory.quantity -= orderData.quantity;
    }

    if (product.inventory.quantity < 0) {
      product.inventory.inStock = false;
    }

    // save the product data
    await product.save();

    const result = await OrderService.createOrderIntoDB(zodParseData);

    return res
      .status(201)
      .json(new ApiResponse(200, result, 'Order created successfully!'));
  } catch (error) {
    throw new ApiError(500, 'Something went wrong while create a new order');
  }
};

// get all order and handle query
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
