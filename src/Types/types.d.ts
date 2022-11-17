export declare type UserType = {
  id?: string | number;
  name?: string;
  email?: string;
  password?: string;
};

export declare type ProductType = {
  id?: string | number;
  name?: string;
  description?: string;
  price?: number;
  order_quantity?: number;
  total_price?: number;
};

export declare type OrderType = {
  id?: string | number;
  price?: number;
  user: UserType | undefined;
  products: ProductType[] | undefined;
};
