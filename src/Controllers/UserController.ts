import { Request, Response } from "express";
import User from "../Models/User";
import { UserType } from "../Types/types";

const userModel: User = new User();

/**
 *
 * Get all the users registered in the database.
 *
 * @param _req - The request object.
 * @param res - The response object.
 * @returns A promise of void.
 * @author Pola Eskandar.
 * @version v1.0.0
 * @since v1.0.0
 */
export const getAllUsers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const users: UserType[] | undefined = await userModel.all();
    res.status(200).send(users);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) res.status(500).send(error.message);
  }
};

/**
 *
 * Get a user with specified id from the database.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A promise of void.
 * @author Pola Eskandar.
 * @version v1.0.0
 * @since v1.0.0
 */
export const getUser = async (req: Request, res: Response): Promise<void> => {
  const id: string | undefined = req.params.id;

  if (typeof id === "undefined") {
    res.status(400).send("Please provide a user identifier.");
    return;
  }

  try {
    const user: UserType | undefined = await userModel.find(id);
    res.status(200).send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("User not found! please try again...");
  }
};

/**
 *
 * Creates a new user in the database.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A promise of void.
 * @author Pola Eskandar.
 * @version v1.0.0
 * @since v1.0.0
 */
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const body = req.body;
  const name: string | undefined = body.name;
  const email: string | undefined = body.email;
  const password: string | undefined = body.password;

  if (
    typeof name === "undefined" ||
    typeof email === "undefined" ||
    typeof password === "undefined"
  ) {
    res
      .status(400)
      .send("Please provide full credentials of name, email, and password.");
    return;
  }

  try {
    const user: UserType | undefined = await userModel.create({
      name,
      email,
      password,
    });
    res.status(201).send(user);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) res.status(500).send(error.message);
  }
};

/**
 *
 * Updates an existing user in the database.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A promise of void.
 * @author Pola Eskandar.
 * @version v1.0.0
 * @since v1.0.0
 */
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const body = req.body;
  const id: string | undefined = req.params.id;
  const name: string | undefined = body.name;
  const email: string | undefined = body.email;
  const password: string | undefined = body.password;

  if (
    typeof name === "undefined" ||
    typeof email === "undefined" ||
    typeof password === "undefined"
  ) {
    res.status(400).send("Please provide full credentials.");
    return;
  }

  try {
    const user: UserType | undefined = await userModel.update({
      id,
      name,
      email,
      password,
    });
    res.status(201).send(user);
  } catch (error) {
    console.error(error);
    // if (error instanceof Error) res.status(500).send(error.message);
  }
};

/**
 *
 * Deletes an existing user in the database.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns A promise of void.
 * @author Pola Eskandar.
 * @version v1.0.0
 * @since v1.0.0
 */
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id: string | undefined = req.params.id;
    await userModel.delete(id);
    res.status(200).send("User deleted successfully!");
  } catch (error) {
    console.error(error);
    res.status(404).send("User not found!");
  }
};
