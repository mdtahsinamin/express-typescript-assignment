import { Request, Response } from 'express';
import productValidationSchema from './product.validate';
import { ProductService } from './product.service';
import { ApiResponse } from '../../utils/ApiResponse';
import ApiError from './../../utils/ApiError';

const createProduct = async (req: Request, res: Response) => {
  try {
    const productData = req.body.product;

    const zodParseData = productValidationSchema.parse(productData);

    const result = await ProductService.createProductIntoDB(zodParseData);

    return res
      .status(201)
      .json(new ApiResponse(200, result, 'Product created Successfully'));
  } catch (error) {
    throw new ApiError(500, 'Something went wrong while registering the user');
  }
};

export const ProductControllers = {
  createProduct,
};
