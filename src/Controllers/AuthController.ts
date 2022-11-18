import bcrypt from "bcrypt";
import jsonwebtoken, { Secret } from "jsonwebtoken";
import { Request, Response } from "express";
import User from "../Models/User";
import { UserType } from "../Types/types";
import { APP_SECRET } from "../constants";

const userModel: User = new User();

/**
 *
 * Signs a user in.
 *
 * @param req
 * @param res
 * @returns A promise of void.
 * @author Pola Eskandar.
 * @version v1.0.0
 * @since v1.0.0
 */
export const signin = async (req: Request, res: Response): Promise<void> => {
  const body = req.body;
  const email: string | undefined = body.email;
  const password: string | Buffer = body.password!;

  try {
    const user: UserType | undefined = await userModel.findWithEmail(email);
    const comparePassword = await bcrypt.compare(password, user!.password!);

    if (!comparePassword) {
      res.status(403).send("Passwords don't match.");
      return;
    }

    const token = jsonwebtoken.sign(user!, APP_SECRET as Secret);

    res
      .status(200)
      .send({ user: { name: user!.name, email: user!.email }, token });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) res.status(500).send(error.message);
  }
};

/**
 *
 * Signs a new user up.
 *
 * @param req
 * @param res
 * @returns A promise of void.
 * @author Pola Eskandar.
 * @version v1.0.0
 * @since v1.0.0
 */
export const signup = async (req: Request, res: Response): Promise<void> => {
  const body = req.body;
  const name: string | undefined = body.name;
  const email: string | undefined = body.email;
  const password: string | undefined = body.password;

  try {
    const user: UserType | undefined = await userModel.create({
      name,
      email,
      password,
    });
    const token = jsonwebtoken.sign(user!, APP_SECRET as Secret);
    res.status(201).send({ user, token });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) res.status(500).send(error.message);
  }
};
