import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";

import { APP_SECRET } from "../constants";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token: string = req.headers.authorization!;

  if (!token) {
    res.status(403).send("Unauthorized.");
    return;
  }

  try {
    jwt.verify(token.split(" ")[1], APP_SECRET as Secret);
    next();
  } catch (err) {
    res.status(400).send(err);
  }
};

export default verifyToken;
