import { Application } from "express";
import { signin, signup } from "../Controllers/AuthController";

const AuthHandler = (server: Application) => {
  server.post("/user/signin", signin);
  server.post("/user/signup", signup);
};

export default AuthHandler;
