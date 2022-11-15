import { Request, Response } from "express";
import Order from "../Models/Order";
import Product from "../Models/Product";
import User from "../Models/User";
import { OrderType, ProductType, UserType } from "../Types/types";

const orderModel: Order = new Order();
const userModel: User = new User();
const productModel: Product = new Product();

/**
 *
 * Get all the orders in the database.
 *
 * @param _req - The request object.
 * @param res - The response object.
 * @returns A promise of void.
 * @author Pola Eskandar.
 * @version v1.0.0
 * @since v1.0.0
 */
export const getAllOrders = async (_req: Request, res: Response): Promise<void> => {
  try {
    const orders: OrderType[] | undefined = await orderModel.all();
    res.status(200).send(orders);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) res.status(500).send(error.message);
  }
};

/**
 *
 * Gets a specific order with id in the database.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A promise of void.
 * @author Pola Eskandar.
 * @version v1.0.0
 * @since v1.0.0
 */
export const getOrder = async (req: Request, res: Response): Promise<void> => {
  const id: string | undefined = req.params.id;

  if (typeof id === "undefined") {
    res.status(400).send("Please provide an order id.");
    return;
  }

  try {
    const order: OrderType | undefined = await orderModel.find(id);
    res.status(200).send(order);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) res.status(500).send(error.message);
  }
};

/**
 *
 * Creates a new order in the database.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A promise of void.
 * @author Pola Eskandar.
 * @version v1.0.0
 * @since v1.0.0
 */
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  const body = req.body;
  const user_id: string | undefined = body.user_id;
  const products_ids: string[] | undefined = body.products_ids;
  const products_quantities: string[] | undefined = body.products_quantities;

  if (typeof user_id === "undefined") {
    res.status(400).send("Please provide full credentials.");
    return;
  }

  try {
    const user: UserType | undefined = await userModel.find(user_id);

    if (typeof user === "undefined") {
      res.status(400).send("User is not found!");
      return;
    }

    const products: ProductType[] = [];

    for (let i = 0; i < products_ids!.length; i++) {
      const product: ProductType | undefined = await productModel.find(products_ids![i]);
      product!.order_quantity = products_quantities![i];
      products.push(product!);
    }

    const order: OrderType | undefined = await orderModel.create({ user, products });
    res.status(201).send(order);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) res.status(500).send(error.message);
  }
};

/**
 *
 * Updates an existing order in the database.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A promise of void.
 * @author Pola Eskandar.
 * @version v1.0.0
 * @since v1.0.0
 */
export const updateOrder = async (req: Request, res: Response): Promise<void> => {
  const body = req.body;
  const user_id: string | undefined = body.user_id;
  const order_id: string | undefined = body.order_id;
  const products_ids: string[] | undefined = body.products_ids;
  const products_quantities: string[] | undefined = body.products_quantities;

  if (typeof user_id === "undefined") {
    res.status(400).send("Please provide full credentials.");
    return;
  }

  try {
    const user: UserType | undefined = await userModel.find(user_id);

    if (typeof user === "undefined") {
      res.status(400).send("User is not found!");
      return;
    }

    const order: OrderType | undefined = await orderModel.find(order_id);

    if (typeof order === "undefined") {
      res.status(400).send("Order is not found!");
      return;
    }

    const products: ProductType[] = [];

    for (let i = 0; i < products_ids!.length; i++) {
      const product: ProductType | undefined = await productModel.find(products_ids![i]);
      product!.order_quantity = products_quantities![i];
      products.push(product!);
    }

    const orderUpdated: OrderType | undefined = await orderModel.update({ id: order_id, user, products });
    res.status(201).send(orderUpdated);
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) res.status(500).send(error.message);
  }
};

/**
 *
 * Deletes an existing order in the database.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A promise of void.
 * @author Pola Eskandar.
 * @version v1.0.0
 * @since v1.0.0
 */
export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  const id: string | undefined = req.params.id;

  try {
    await orderModel.delete(id);
    res.status(200).send("Order deleted successfully!");
  } catch (error) {
    console.error(error);
    if (error instanceof Error) res.status(500).send(error.message);
  }
};
