import { Router } from "express";
import { getCartId, deleteCartId, putCartIdProductsId, putCartId, deleteCartIdProductsId, postCart, getCart, postCartIdProductsId } from "../controllers/cart.controller.js"

const cartRouter = Router();

cartRouter.get("/:cId", getCartId)
cartRouter.delete('/:cId', deleteCartId);
cartRouter.put('/:cId/products/:pId', putCartIdProductsId);
cartRouter.put('/:cId', putCartId);
cartRouter.delete('/:cId/products/:pId', deleteCartIdProductsId);
cartRouter.post("/", postCart);
cartRouter.get("/:id", getCart)
cartRouter.post("/:cId/products/:pId", postCartIdProductsId)

export default cartRouter;