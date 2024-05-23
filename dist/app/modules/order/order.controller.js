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
exports.OrderControllers = void 0;
const order_validate_1 = __importDefault(require("./order.validate"));
const order_service_1 = require("./order.service");
const ApiResponse_1 = require("../../utils/ApiResponse");
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const product_service_1 = require("../product/product.service");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderData = req.body.order;
        const zodParseData = order_validate_1.default.parse(orderData); // zod validation
        // find by product id
        const product = yield product_service_1.ProductService.getSingleProductFromDB(orderData.productId);
        // product exists or not
        if (!product) {
            throw new ApiError_1.default(400, 'Product not exists');
        }
        // Check if ordered quantity exceeds available quantity in inventory
        if (orderData.quantity > product.inventory.quantity) {
            throw new ApiError_1.default(400, 'Insufficient quantity available in inventory');
        }
        // Update inventory quantity and inStock status
        if ((product.inventory.quantity -= orderData.quantity) >= 0) {
            product.inventory.quantity -= orderData.quantity;
        }
        if (product.inventory.quantity < 0) {
            product.inventory.inStock = false;
        }
        // save the product data
        yield product.save();
        const result = yield order_service_1.OrderService.createOrderIntoDB(zodParseData);
        return res
            .status(201)
            .json(new ApiResponse_1.ApiResponse(200, result, 'Order created successfully!'));
    }
    catch (error) {
        throw new ApiError_1.default(500, 'Something went wrong while create a new order');
    }
});
// get all order and handle query
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.query.email;
        let query = {};
        let isQuery = false;
        if (email) {
            query = { email };
            isQuery = true;
        }
        const { result, isOrderCount } = yield order_service_1.OrderService.getAllOrdersFromDB(query);
        if (!isOrderCount) {
            const err = new ApiError_1.default(400, 'Order not found');
            const statusCode = err.statusCode;
            const message = err.message;
            const success = err.success;
            return res.status(statusCode).json({
                success,
                message,
            });
        }
        if (isQuery) {
            return res
                .status(200)
                .json(new ApiResponse_1.ApiResponse(200, result, 'Orders fetched successfully for user email!'));
        }
        else {
            return res
                .status(200)
                .json(new ApiResponse_1.ApiResponse(200, result, 'Orders fetched successfully!'));
        }
    }
    catch (error) {
        const err = new ApiError_1.default(400, 'Order not found');
        const statusCode = err.statusCode;
        const message = err.message;
        const success = err.success;
        return res.status(statusCode).json({
            success,
            message,
        });
    }
});
exports.OrderControllers = {
    createOrder,
    getAllOrders,
};
//# sourceMappingURL=order.controller.js.map