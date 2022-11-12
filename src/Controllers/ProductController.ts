import { Request, Response } from "express";
import Product from "../Models/Product";
import { ProductType } from "../Types/types";

const productModel: Product = new Product();

/**
 *
 * Get all the products in the database.
 *
 * @param _req - The request object.
 * @param res - The response object.
 * @returns A promise of void.
 * @author Pola Eskandar.
 * @version v1.0.0
 * @since v1.0.0
 */
export const getAllProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products: ProductType[] | undefined = await productModel.all();
    res.status(200).send(products);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong! please try again...");
  }
};

/**
 *
 * Gets a specific product with id in the database.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A promise of void.
 * @author Pola Eskandar.
 * @version v1.0.0
 * @since v1.0.0
 */
export const getProduct = async (req: Request, res: Response): Promise<void> => {
  const id: string | undefined = req.params.id;

  if (typeof id === "undefined") {
    res.status(400).send("Please provide a product id.");
    return;
  }

  try {
    const product: ProductType | undefined = await productModel.find(id);
    res.status(200).send(product);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong! please try again...");
  }
};

/**
 *
 * Creates a new product in the database.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A promise of void.
 * @author Pola Eskandar.
 * @version v1.0.0
 * @since v1.0.0
 */
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  const body = req.body;
  const name: string | undefined = body.name;
  const description: string | undefined = body.description;
  const available_quantity: string | undefined = body.available_quantity;

  if (typeof name === "undefined" || typeof description === "undefined" || typeof available_quantity === "undefined") {
    res.status(400).send("Please provide full credentials.");
    return;
  }

  try {
    const product: ProductType | undefined = await productModel.create({ name, description, available_quantity });
    res.status(201).send(product);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong! please try again...");
  }
};

/**
 *
 * Updates an existing product in the database.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A promise of void.
 * @author Pola Eskandar.
 * @version v1.0.0
 * @since v1.0.0
 */
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const body = req.body;
  const id: string | undefined = req.params.id;
  const name: string | undefined = body.name;
  const description: string | undefined = body.description;
  const available_quantity: string | undefined = body.available_quantity;

  if (typeof name === "undefined" || typeof description === "undefined" || typeof available_quantity === "undefined") {
    res.status(400).send("Please provide full credentials.");
    return;
  }

  try {
    const product: ProductType | undefined = await productModel.update({ id, name, description, available_quantity });
    res.status(201).send(product);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong! please try again...");
  }
};

/**
 *
 * Deletes an existing product in the database.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A promise of void.
 * @author Pola Eskandar.
 * @version v1.0.0
 * @since v1.0.0
 */
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  const id: string | undefined = req.params.id;

  try {
    await productModel.delete(id);
    res.status(200).send("Product deleted successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong! please try again...");
  }
};
