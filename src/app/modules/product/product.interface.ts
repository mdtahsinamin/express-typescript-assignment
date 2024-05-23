export interface TProduct {
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  variants: TVariant[];
  inventory: TInventory;
}

export interface TVariant {
  type: string;
  value: string;
}

export interface TInventory {
  quantity: number;
  inStock: boolean;
}
