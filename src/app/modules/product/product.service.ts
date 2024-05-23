import { TProduct } from './product.interface';
import { Product } from './product.model';

// save data into db
const createProductIntoDB = async (productData: TProduct) => {
  const result = await Product.create(productData);

  return result;
};

// fetched all data and handle query  from db
const getAllProductsFromDB = async (query: Record<string, any>) => {
  const result = await Product.find(query);
  return result;
};
// fetched single data by id  from db
const getSingleProductFromDB = async (id: string) => {
  const result = await Product.findOne({ _id: id });

  return result;
};

const updateSingleProductInDB = async (id: string, updatedData: TProduct) => {
  const result = await Product.findByIdAndUpdate(
    {
      _id: id,
    },
    updatedData,
    { new: true },
  );

  return result;
};

const deleteSingleProductFromDB = async (id: string) => {
  const result = await Product.deleteOne({ _id: id });

  return result;
};

export const ProductService = {
  createProductIntoDB,
  getAllProductsFromDB,
  getSingleProductFromDB,
  updateSingleProductInDB,
  deleteSingleProductFromDB,
};
