// Aspectos a incluir

// Agregar el modelo de persistencia de Mongo y mongoose a tu proyecto.
// Crear una base de datos llamada “ecommerce” dentro de tu Atlas, 
// crear sus colecciones “carts”, “messages”, “products” y sus respectivos schemas.
// Separar los Managers de fileSystem de los managers de MongoDb en una sola carpeta “dao”.
//  Dentro de dao, agregar también una carpeta “models” donde vivirán los esquemas de MongoDB.
//   La estructura deberá ser igual a la vista en esta clase

// Contener todos los Managers (FileSystem y DB) en una carpeta llamada “Dao”
// Aspectos a incluir

// Reajustar los servicios con el fin de que puedan funcionar con Mongoose en lugar de 
// FileSystem
// NO ELIMINAR FileSystem de tu proyecto.
// Implementar una vista nueva en handlebars llamada chat.handlebars, 
// la cual permita implementar un chat como el visto en clase.
//  Los mensajes deberán guardarse en una colección “messages” en mongo
//   (no es necesario implementarlo en FileSystem). 
//   El formato es:  {user:correoDelUsuario, message: mensaje del usuario}
// Corroborar la integridad del proyecto para que todo funcione
// como lo ha hecho hasta ahora.


import express from "express";
//import ProductManager from "./dao/fileSystem/productManager.js"; 
//import CartManager from "./dao/fileSystem/cartManager.js";
import ProductManager from "./dao/db/productManager.js"
import CartManager from "./dao/db/cartManager.js"
import productsRouter from "./routes/products.routes.js";
import cartRouter from "./routes/cart.routers.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import viewsRouters from "./routes/views.routes.js";
import dbConnect from "./dao/db/config/dbConnect.js"

dbConnect();

//const productManager = new ProductManager("./");
//const cartManager = new CartManager("./");
const productManager = new ProductManager();
await productManager.init();
const cartManager = new CartManager();
await cartManager.init();
const PORT= 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.engine("handlebars", handlebars.engine());

app.set("views", "src/views");
app.set("view engine", "handlebars");

app.use("/chat", viewsRouters);

app.get('/', async (req, res) => {
    const productos = await productManager.getProducts();
    res.render('home', { productos });
  });


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

export { productManager, cartManager }