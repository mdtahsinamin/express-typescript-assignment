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
    throw new ApiError(500, 'Something went wrong while create a new product');
  }
};

// get all products

const getAllProducts = async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.searchTerm;

    let query = {};
    let isQuery = false;

    if (searchTerm) {
      query = { name: { $regex: searchTerm, $options: 'i' } };
      isQuery = true;
    }

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
    throw new ApiError(404, 'Something went wrong while fetched the products');
  }
};

// single product by id
const getSingleProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;

    // check product exists or not
    const isExists = await ProductService.getSingleProductFromDB(productId);

    if (!isExists) {
      throw new ApiError(400, "Product don't exists!");
    }

    const result = await ProductService.getSingleProductFromDB(productId);

    return res
      .status(200)
      .json(new ApiResponse(200, result, 'Product fetched successfully!'));
  } catch (error) {
    throw new ApiError(
      404,
      'Something went wrong while fetched the product by ID',
    );
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
      throw new ApiError(400, "Product don't exists !");
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
    throw new ApiError(400, 'Something went wrong while update the product');
  }
};

// delete product by id

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.productId;

    // check product exists or not
    const isExists = await ProductService.getSingleProductFromDB(productId);

    if (!isExists) {
      throw new ApiError(400, "Product don't exists !");
    }

    const result = await ProductService.deleteSingleProductFromDB(productId);
    return res
      .status(200)
      .json(new ApiResponse(200, null, 'Product deleted successfully!'));
  } catch (error) {
    throw new ApiError(400, 'Something went wrong while delete the product');
  }
};

export const ProductControllers = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
