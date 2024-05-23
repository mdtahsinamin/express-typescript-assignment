"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const variantValidationSchema = zod_1.z.object({
    type: zod_1.z.string().trim().min(1, { message: 'Type must not be empty' }),
    value: zod_1.z.string().trim().min(1, { message: 'Type must not be empty' }),
});
const inventoryValidationSchema = zod_1.z.object({
    quantity: zod_1.z
        .number()
        .int()
        .nonnegative({ message: 'Quantity must be a non-negative integer' }),
    inStock: zod_1.z.boolean({ message: 'InStock must be a boolean value' }),
});
const productValidationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: 'Name must not be empty' }),
    description: zod_1.z.string().min(1, { message: 'Description must not be empty' }),
    price: zod_1.z
        .number()
        .nonnegative({ message: 'Price must be a non-negative number' }),
    category: zod_1.z.string().min(1, { message: 'Category must not be empty' }),
    tags: zod_1.z.array(zod_1.z.string().min(1, { message: 'Tag must not be empty' })),
    variants: zod_1.z.array(variantValidationSchema),
    inventory: inventoryValidationSchema,
});
exports.default = productValidationSchema;
