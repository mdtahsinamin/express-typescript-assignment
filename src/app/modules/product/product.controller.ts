import { Request, Response } from 'express';
import productValidationSchema from './product.validate';
import { ProductService } from './product.service';
import { ApiResponse } from '../../utils/ApiResponse';
import ApiError from './../../utils/ApiError';

// create a new product
const createProduct = async (req: Request, res: Response) => {
  try {
    const productData = req.body.product;

    const zodParseData = productValidationSchema.parse(productData); // validation using zod

    const result = await ProductService.createProductIntoDB(zodParseData);

    return res
      .status(201)
      .json(new ApiResponse(200, result, 'Product created Successfully'));
  } catch (error) {
    const err = new ApiError(
      500,
      'Something went wrong while create a new product',
    );
    const statusCode = err.statusCode;
    const message = err.message;
    const success = err.success;
    return res.status(statusCode).json({
      success,
      message,
    });
  }
};

// get all products

const getAllProducts = async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.searchTerm;

    let query = {};
    let isQuery = false;

    if (searchTerm) {
      query = {
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { category: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
        ],
      };
      isQuery = true;
    }

    console.log(query);

    const result = await ProductService.getAllProductsFromDB(query);

    if (isQuery) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            result,
            `Products matching search term ${searchTerm} fetched successfully!`,
          ),
        );
    } else {
      return res
        .status(200)
        .json(new ApiResponse(200, result, 'Products fetched successfully!'));
    }
  } catch (error) {
    const err = new ApiError(
      500,
      'Something went wrong while fetched the products',
    );
    const statusCode = err.statusCode;
    const message = err.message;
    const success = err.success;
    return res.status(statusCode).json({
      success,
      message,
    });
  }
};

// single product by id
const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;

    // check product exists or not
    const isExists = await ProductService.getSingleProductFromDB(productId);

    if (!isExists) {
      const err = new ApiError(400, "Product don't exists!");
      const statusCode = err.statusCode;
      const message = err.message;
      const success = err.success;
      return res.status(statusCode).json({
        success,
        message,
      });
    }

    const result = await ProductService.getSingleProductFromDB(productId);

    return res
      .status(200)
      .json(new ApiResponse(200, result, 'Product fetched successfully!'));
  } catch (error) {
    const err = new ApiError(
      404,
      'Something went wrong while fetched the product by ID',
    );

    const statusCode = err.statusCode;
    const message = err.message;
    const success = err.success;
    return res.status(statusCode).json({
      success,
      message,
    });
  }
};

// update product by id

const updateProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;
    const updatedProductData = req.body.product;

    // check product exists or not
    const isExists = await ProductService.getSingleProductFromDB(productId);

    if (!isExists) {
      const err = new ApiError(400, "Product don't exists!");
      const statusCode = err.statusCode;
      const message = err.message;
      const success = err.success;
      return res.status(statusCode).json({
        success,
        message,
      });
    }

    const zodParseData = productValidationSchema.parse(updatedProductData); // zod validation on update data

    const result = await ProductService.updateSingleProductInDB(
      productId,
      zodParseData,
    );
    return res
      .status(200)
      .json(new ApiResponse(200, result, 'Product updated successfully!'));
  } catch (error) {
    const err = new ApiError(
      404,
      'Something went wrong while fetched the product by ID',
    );

    const statusCode = err.statusCode;
    const message = err.message;
    const success = err.success;
    return res.status(statusCode).json({
      success,
      message,
    });
  }
};

// delete product by id

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;

    // check product exists or not
    const isExists = await ProductService.getSingleProductFromDB(productId);

    if (!isExists) {
      const err = new ApiError(400, "Product don't exists!");
      const statusCode = err.statusCode;
      const message = err.message;
      const success = err.success;
      return res.status(statusCode).json({
        success,
        message,
      });
    }

    await ProductService.deleteSingleProductFromDB(productId);
    return res
      .status(200)
      .json(new ApiResponse(200, null, 'Product deleted successfully!'));
  } catch (error) {
    const err = new ApiError(
      404,
      'Something went wrong while fetched the product by ID',
    );

    const statusCode = err.statusCode;
    const message = err.message;
    const success = err.success;
    return res.status(statusCode).json({
      success,
      message,
    });
  }
};

export const ProductControllers = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
