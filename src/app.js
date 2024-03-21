// Consigna

// Se aplicará un módulo de mocking y un manejador de errores
// a tu servidor actual

// Link al repositorio de github sin node_modules

// Sugerencias
// Céntrate solo en los errores más comunes  

// Aspectos a incluir
// Generar un módulo de Mocking para el servidor, 
// con el fin de que, al inicializarse pueda generar 
// y entregar 100 productos con el mismo formato que 
// entregaría una petición de Mongo. Ésto solo debe ocurrir
//  en un endpoint determinado (‘/mockingproducts’)

// Además, generar un customizador de errores y crear un 
// diccionario para tus errores más comunes al 
// crear un producto, agregarlo al carrito, etc.


import express from "express";
//import ProductManager from "./dao/fileSystem/productManager.js"; 
import ProductManager from "./dao/db/productManager.js"
import productsRouter from "./routes/products.routes.js";
import cartRouter from "./routes/cart.routers.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import viewRoutes from "./routes/views.routes.js";
import dbConnect from "./dao/db/config/dbConnect.js"
import session from "express-session";
import MongoStore from "connect-mongo";
import sessionRoutes from "./routes/session.routes.js";
import mongoose from "mongoose";
import passport from "passport";
import  initializePassport from "./config/passport.config.js";
import { mongoSecret, port, mongoUrl } from "./config/env.config.js"
import { ErrorHandler } from "./middlewars/error.js";

dbConnect();

//const productManager = new ProductManager("./");
const productManager = new ProductManager();
await productManager.init();
const PORT= port;
const app = express();

app.use(session({
  secret: mongoSecret,
  store: MongoStore.create({
    mongoUrl: mongoUrl,
  }),
  resave:true,
  saveUninitialized: true
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(mongoUrl)

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

const hbs = handlebars.create({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true
  }
});

app.engine("handlebars", hbs.engine);

app.set("views", "src/views");
app.set("view engine", "handlebars");

app.use("/chat", viewRoutes);
app.use('/', viewRoutes)
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/session", sessionRoutes);

app.use(ErrorHandler);


// app.get('/', async (req, res) => {
//     const productos = await productManager.getProducts();
//     res.render('index', { productos });
//   });


app.get('/realtimeproducts', async (req, res) => {
    const productos = await productManager.getProducts();
    res.render('realTimeProducts/realTimeProducts', { productos });
  });


const httpServer = app.listen(PORT, () => {
    console.log(`Servidor funcionando en puerto ${PORT} `)
});

const io = new Server(httpServer);

const messages = [];

io.on("connect", socket => {
  socket.on("message", data => {
    messages.push(data);
    io.emit("messageLogs", messages);
  });

  socket.on("newUser", user => {
    io.emit("newConnection", "Un nuevo usuario se conecto")
    socket.broadcast.emit("notification", user);
  })
})

io.on('connection', (socket) => {
  socket.on('addProduct', async (newProduct) => {
      newProduct.id = productManager.generateProductId();
      await productManager.addProduct(newProduct);
      const updatedProducts = await productManager.getProducts();
      io.emit('updateProducts', updatedProducts);
  });

  socket.on('deleteProduct', async (productId) => {
      await productManager.deleteProduct(productId);
      const updatedProducts = await productManager.getProducts();
      io.emit('updateProducts', updatedProducts);
    });
});

export { productManager }