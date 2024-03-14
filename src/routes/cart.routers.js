import { Router } from "express";
import { getCartId, deleteCartId, putCartIdProductsId, putCartId, deleteCartIdProductsId, postCart, getCart, purchaseCart, postCartIdProductsId,} from "../controllers/cart.controller.js"
import { checkUser } from "../middlewars/role.js";

const cartRouter = Router();

cartRouter.get("/:cId", getCartId)
cartRouter.delete('/:cId', deleteCartId);
cartRouter.put('/:cId/products/:pId', checkUser, putCartIdProductsId);
cartRouter.put('/:cId', putCartId);
cartRouter.delete('/:cId/products/:pId', checkUser, deleteCartIdProductsId);
cartRouter.post("/", postCart);
cartRouter.get("/:id", getCart);
cartRouter.post("/:cId/products/:pId", checkUser, postCartIdProductsId)
 cartRouter.post("/:cid/purchase", purchaseCart);



export default cartRouter;