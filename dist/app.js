"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const product_route_1 = __importDefault(require("./app/modules/product/product.route"));
const order_route_1 = __importDefault(require("./app/modules/order/order.route"));
const ApiError_1 = __importDefault(require("./app/utils/ApiError"));
const app = (0, express_1.default)();
// parser
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Application routes
app.use('/api/products', product_route_1.default);
app.use('/api/orders', order_route_1.default);
app.get('/', (req, res) => {
    res.send('Hello World!');
});
// not found route handle
app.all('*', (req, res, next) => {
    const err = new ApiError_1.default(404, 'Route not found');
    const success = err.success;
    const message = err.message;
    res.status(err.statusCode).json({
        success,
        message,
    });
});
exports.default = app;
