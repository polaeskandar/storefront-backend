export declare type UserType = {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
};

export declare type ProductType = {
  id?: string;
  name?: string;
  description?: string;
  price_per_unit?: number;
  order_quantity?: string;
  total_price?: number;
};

export declare type OrderType = {
  id?: string;
  price?: number;
  user: UserType | undefined;
  products: ProductType[] | undefined;
};
