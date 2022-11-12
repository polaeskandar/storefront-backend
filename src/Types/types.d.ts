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
  available_quantity?: string;
};

export declare type OrderType = {
  id?: string;
  quantity?: string;
  user: UserType;
  product: ProductType;
};

export declare type SimplifiedOrderType = {
  id?: string;
  quantity?: string;
  user_id: string;
  product_id: string;
};
