import { Router } from "express";
import { productManager } from "../app.js"; 


const viewRoutes = Router();

viewRoutes.get("/", (req, res) => {
    res.render("chat");
})

viewRoutes.get('/products', async (req, res) => {
    const {page} = req.query;
    const products = await productManager.loadProducts(10, page);
    res.render('products', products);
  });

export default viewRoutes;