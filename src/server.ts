import express, { Application } from "express";
import { APP_PORT } from "./constants";
import AuthHandler from "./Handlers/AuthHandler";
import OrdersHandler from "./Handlers/OrdersHandler";
import ProductsHandler from "./Handlers/ProductsHandler";
import UserHandler from "./Handlers/UserHandler";

const server: Application = express();
server.use(express.urlencoded({ extended: true }));
server.use(express.json());

AuthHandler(server);
UserHandler(server);
ProductsHandler(server);
OrdersHandler(server);

server.get("/", (_req, res) => res.status(200).send({ msg: "Welcome to the store. please use REQUIREMENTS.md in the root directory for the full guide on using the endpoints." }));
server.listen(APP_PORT, () => console.log(`SERVER RUNNING ON http://localhost:${APP_PORT}/`));
