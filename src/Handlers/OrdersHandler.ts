import { Application } from "express";
import { createOrder, deleteOrder, getAllOrders, getOrder, updateOrder } from "../Controllers/OrdersController";
import verifyToken from "../Middlewares/VerifyToken";

const OrdersHandler = (server: Application) => {
  server.get("/orders", verifyToken, getAllOrders);
  server.get("/order/:id", verifyToken, getOrder);
  server.post("/order/create", verifyToken, createOrder);
  server.put("/order/:id/update", verifyToken, updateOrder);
  server.delete("/order/:id/delete", verifyToken, deleteOrder);
};

export default OrdersHandler;
