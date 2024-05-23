import { TProduct } from './product.interface';
import Product from './product.model';

const createProductIntoDB = async (productData: TProduct) => {
  const result = await Product.create(productData);

  return result;
};

const getAllProductsFromDB = async () => {
  const result = await Product.find({});
  return result;
};

const getSingleProductFromDB = async (id: string) => {
  const result = await Product.findOne({ _id: id });

  return result;
};

const updateSingleProductInDB = async (id: string, updatedData: TProduct) => {
  const result = await Product.updateOne(
    {
      _id: id,
    },
    updatedData,
  );

  return result;
};

export const ProductService = {
  createProductIntoDB,
  getAllProductsFromDB,
  getSingleProductFromDB,
};
