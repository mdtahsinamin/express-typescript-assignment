import { z } from 'zod';

const variantValidationSchema = z.object({
  type: z.string().trim().min(1, { message: 'Type must not be empty' }),
  value: z.string().trim().min(1, { message: 'Type must not be empty' }),
});

const inventoryValidationSchema = z.object({
  quantity: z
    .number()
    .int()
    .nonnegative({ message: 'Quantity must be a non-negative integer' }),
  inStock: z.boolean({ message: 'InStock must be a boolean value' }),
});

const productValidationSchema = z.object({
  name: z.string().min(1, { message: 'Name must not be empty' }),
  description: z.string().min(1, { message: 'Description must not be empty' }),
  price: z
    .number()
    .nonnegative({ message: 'Price must be a non-negative number' }),
  category: z.string().min(1, { message: 'Category must not be empty' }),
  tags: z.array(z.string().min(1, { message: 'Tag must not be empty' })),
  variants: z.array(variantValidationSchema),
  inventory: inventoryValidationSchema,
});

export default productValidationSchema;
