import { Application } from "express";
import verifyToken from "../Middlewares/VerifyToken";
import { createProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from "../Controllers/ProductController";

const ProductsHandler = (server: Application) => {
  server.get("/products", verifyToken, getAllProducts);
  server.get("/product/:id", verifyToken, getProduct);
  server.post("/product/create", verifyToken, createProduct);
  server.put("/product/:id/update", verifyToken, updateProduct);
  server.delete("/product/:id/delete", verifyToken, deleteProduct);
};

export default ProductsHandler;
