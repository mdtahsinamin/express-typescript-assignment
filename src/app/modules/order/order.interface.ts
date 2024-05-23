export interface TOrder {
  email: string;
  productId: string;
  price: number;
  quantity: number;
}

export interface TResult<TOrder> {
  success: boolean;
  message: string;
  data: TOrder[] | null;
}
