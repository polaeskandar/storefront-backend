import { Application } from "express";
import verifyToken from "../Middlewares/VerifyToken";
import { getAllUsers, createUser, updateUser, deleteUser, getUser } from "../Controllers/UserController";

const UserHandler = (server: Application) => {
  server.get("/users", verifyToken, getAllUsers);
  server.get("/user/:id", verifyToken, getUser);
  server.post("/user/create", verifyToken, createUser);
  server.put("/user/:id/update", verifyToken, updateUser);
  server.delete("/user/:id/delete", verifyToken, deleteUser);
};

export default UserHandler;
