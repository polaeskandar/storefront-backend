import { Application } from "express";
import { signin, signup } from "../Controllers/AuthController";

const AuthHandler = (server: Application) => {
  server.post("/user/signup", signup);
  server.post("/user/signin", signin);
};

export default AuthHandler;
