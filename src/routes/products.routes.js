import { Router } from "express";
import {
  getProducts,
  getProductsId, postProducts, putProductsId, deleteProductsId 
} from "../controllers/products.controller.js";

const productsRouter = Router();

productsRouter.get("/", getProducts);
productsRouter.get("/:id", getProductsId);
productsRouter.post("/", postProducts);
productsRouter.put("/:id", putProductsId);
productsRouter.delete("/:id", deleteProductsId);

export default productsRouter;
