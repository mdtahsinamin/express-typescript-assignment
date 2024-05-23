"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductControllers = void 0;
const product_validate_1 = __importDefault(require("./product.validate"));
const product_service_1 = require("./product.service");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = __importDefault(require("./../../utils/ApiError"));
// create a new product
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productData = req.body.product;
        const zodParseData = product_validate_1.default.parse(productData); // validation using zod
        const result = yield product_service_1.ProductService.createProductIntoDB(zodParseData);
        return res
            .status(201)
            .json(new ApiResponse_1.ApiResponse(200, result, 'Product created Successfully'));
    }
    catch (error) {
        throw new ApiError_1.default(500, 'Something went wrong while create a new product');
    }
});
// get all products
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchTerm = req.query.searchTerm;
        let query = {};
        let isQuery = false;
        if (searchTerm) {
            query = { name: { $regex: searchTerm, $options: 'i' } };
            isQuery = true;
        }
        const result = yield product_service_1.ProductService.getAllProductsFromDB(query);
        if (isQuery) {
            return res
                .status(200)
                .json(new ApiResponse_1.ApiResponse(200, result, `Products matching search term ${searchTerm} fetched successfully!`));
        }
        else {
            return res
                .status(200)
                .json(new ApiResponse_1.ApiResponse(200, result, 'Products fetched successfully!'));
        }
    }
    catch (error) {
        throw new ApiError_1.default(404, 'Something went wrong while fetched the products');
    }
});
// single product by id
const getSingleProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.productId;
        // check product exists or not
        const isExists = yield product_service_1.ProductService.getSingleProductFromDB(productId);
        if (!isExists) {
            throw new ApiError_1.default(400, "Product don't exists!");
        }
        const result = yield product_service_1.ProductService.getSingleProductFromDB(productId);
        return res
            .status(200)
            .json(new ApiResponse_1.ApiResponse(200, result, 'Product fetched successfully!'));
    }
    catch (error) {
        throw new ApiError_1.default(404, 'Something went wrong while fetched the product by ID');
    }
});
// update product by id
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.productId;
        const updatedProductData = req.body.product;
        // check product exists or not
        const isExists = yield product_service_1.ProductService.getSingleProductFromDB(productId);
        if (!isExists) {
            throw new ApiError_1.default(400, "Product don't exists !");
        }
        const zodParseData = product_validate_1.default.parse(updatedProductData); // zod validation on update data
        const result = yield product_service_1.ProductService.updateSingleProductInDB(productId, zodParseData);
        return res
            .status(200)
            .json(new ApiResponse_1.ApiResponse(200, result, 'Product updated successfully!'));
    }
    catch (error) {
        throw new ApiError_1.default(400, 'Something went wrong while update the product');
    }
});
// delete product by id
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productId = req.params.productId;
        // check product exists or not
        const isExists = yield product_service_1.ProductService.getSingleProductFromDB(productId);
        if (!isExists) {
            throw new ApiError_1.default(400, "Product don't exists !");
        }
        const result = yield product_service_1.ProductService.deleteSingleProductFromDB(productId);
        return res
            .status(200)
            .json(new ApiResponse_1.ApiResponse(200, null, 'Product deleted successfully!'));
    }
    catch (error) {
        throw new ApiError_1.default(400, 'Something went wrong while delete the product');
    }
});
exports.ProductControllers = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
};
