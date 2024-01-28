import { Router } from "express";
import { productManager } from "../app.js"; 
import { checkAuth, checkExistingUser } from "../middlewars/auth.js";


const viewRoutes = Router();

viewRoutes.get('/',checkAuth, (req, res) => {
  const {user} = req.session;
  res.render('index', { first_name: user.first_name, last_name: user.last_name });
});

viewRoutes.get('/login',checkExistingUser, (req, res) => {
  res.render('login');
});

viewRoutes.get("/faillogin", (req, res) => {
  res.render("faillogin");
})

viewRoutes.get("/failregister", (req, res) => {
  res.render("failregister");
})

viewRoutes.get('/register',checkExistingUser, (req, res) => {
  res.render('register');
})

viewRoutes.get("/restore-password",checkExistingUser, (req, res) => {
  res.render("restore-password");
})


viewRoutes.get("/chat", (req, res) => {
    res.render("chat");
})

viewRoutes.get('/products', async (req, res) => {
    const {page} = req.query;
    const { user } = req.session;
    const products = await productManager.loadProducts(10, page);
    res.render('products', { products, user });
  });

export default viewRoutes;