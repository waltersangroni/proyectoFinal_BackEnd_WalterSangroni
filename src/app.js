// Objetivos generales

// Profesionalizar el servidor
// Objetivos específicos

// Aplicar una arquitectura profesional para nuestro servidor
// Aplicar prácticas como patrones de diseño, mailing, variables de entorno. etc.

// Se debe entregar

// Modificar nuestra capa de persistencia para aplicar los conceptos
// de Factory (opcional), DAO y DTO. 

// Se debe entregar

// El DAO seleccionado (por un parámetro en línea de comandos como lo hicimos anteriormente)
// será devuelto por una Factory para que la capa de negocio opere con él.
// (Factory puede ser opcional)
// Implementar el patrón Repository para trabajar con el DAO en la lógica de negocio. 
// Modificar la ruta /current Para evitar enviar información sensible,
// enviar un DTO del usuario sólo con la información necesaria.

// Se debe entregar

// Realizar un middleware que pueda trabajar en conjunto con la estrategia “current” 
// para hacer un sistema de autorización y delimitar el acceso a dichos endpoints:
// Sólo el administrador puede crear, actualizar y eliminar productos.
// Sólo el usuario puede enviar mensajes al chat.
// Sólo el usuario puede agregar productos a su carrito.

// Se debe entregar

// Crear un modelo Ticket el cual contará con todas las formalizaciones de la compra.
// Éste contará con los campos
// Id (autogenerado por mongo)
// code: String debe autogenerarse y ser único
// purchase_datetime: Deberá guardar la fecha y hora exacta en la cual se 
// formalizó la compra (básicamente es un created_at)
// amount: Number, total de la compra.
// purchaser: String, contendrá el correo del usuario asociado al carrito.

// Se debe entregar

// Implementar, en el router de carts, la ruta /:cid/purchase, la cual permitirá finalizar 
// el proceso de compra de dicho carrito.
// La compra debe corroborar el stock del producto al momento de finalizarse
// Si el producto tiene suficiente stock para la cantidad indicada en el producto del carrito, 
// entonces restarlo del stock del producto y continuar.
// Si el producto no tiene suficiente stock para la cantidad indicada en el producto del carrito, 
// entonces no agregar el producto al proceso de compra. 

// Se debe entregar

// Al final, utilizar el servicio de Tickets para poder generar un ticket con los datos
// de la compra.
// En caso de existir una compra no completada, devolver el arreglo con los ids 
// de los productos que no pudieron procesarse.
// Una vez finalizada la compra, el carrito asociado al usuario que compró deberá 
// contener sólo los productos que no pudieron comprarse. Es decir, se filtran los que sí se 
// compraron y se quedan aquellos que no tenían disponibilidad.


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