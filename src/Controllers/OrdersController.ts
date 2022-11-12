import { Request, Response } from "express";
import Order from "../Models/Order";
import { OrderType } from "../Types/types";

const orderModel: Order = new Order();

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
    res.status(500).send("Something went wrong! please try again...");
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
    res.status(500).send("Something went wrong! please try again...");
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
  const quantity: string | undefined = body.quantity;
  const user_id: string | undefined = body.user_id;
  const product_id: string | undefined = body.product_id;

  if (typeof quantity === "undefined" || typeof user_id === "undefined" || typeof product_id === "undefined") {
    res.status(400).send("Please provide full credentials.");
    return;
  }

  try {
    const order: OrderType | undefined = await orderModel.create({ quantity, user_id, product_id });
    res.status(201).send(order);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong! please try again...");
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
  const id: string | undefined = req.params.id;
  const quantity: string | undefined = body.quantity;
  const user_id: string | undefined = body.user_id;
  const product_id: string | undefined = body.product_id;

  if (typeof id === "undefined" || typeof quantity === "undefined" || typeof user_id === "undefined" || typeof product_id === "undefined") {
    res.status(400).send("Please provide full credentials.");
    return;
  }

  try {
    const order: OrderType | undefined = await orderModel.update({ id, quantity, user_id, product_id });
    res.status(201).send(order);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong! please try again...");
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
    res.status(500).send("Something went wrong! please try again...");
  }
};
