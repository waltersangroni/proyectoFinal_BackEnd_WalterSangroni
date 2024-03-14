import { Router } from "express";
import {
  getProducts,
  getProductsId, postProducts, putProductsId, deleteProductsId 
} from "../controllers/products.controller.js";
import { checkAdmin, checkUser } from "../middlewars/role.js";

const productsRouter = Router();

productsRouter.get("/", checkUser, getProducts);
productsRouter.get("/:id", checkUser, getProductsId);
productsRouter.post("/", checkAdmin, postProducts);
productsRouter.put("/:id", checkAdmin, putProductsId);
productsRouter.delete("/:id", checkAdmin, deleteProductsId);

export default productsRouter;
