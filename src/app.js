// Desarrollar un servidor basado en express donde podamos hacer consultas a nuestro archivo de productos.

// Se instalarán las dependencias a partir del comando npm install
// Se echará a andar el servidor
// Se revisará que el archivo YA CUENTE CON AL MENOS DIEZ PRODUCTOS CREADOS al momento de su entrega, es importante para que los tutores no tengan que crear los productos por sí mismos, y así agilizar el proceso de tu evaluación.
// Se corroborará que el servidor esté corriendo en el puerto 8080.
// Se mandará a llamar desde el navegador a la url http://localhost:8080/products sin query, eso debe devolver todos los 10 productos.
// Se mandará a llamar desde el navegador a la url http://localhost:8080/products?limit=5 , eso debe devolver sólo los primeros 5 de los 10 productos.
// Se mandará a llamar desde el navegador a la url http://localhost:8080/products/2, eso debe devolver sólo el producto con id=2.
// Se mandará a llamar desde el navegador a la url http://localhost:8080/products/34123123, al no existir el id del producto, debe devolver un objeto con un error indicando que el producto no existe.



import express from "express";
import  ProductManager from "./productManager.js"; 

const productManager = new ProductManager("./");
const PORT= 8080;
const app = express();
app.use(express.urlencoded({extended: true}));

app.get("/products", async (req, res) => {
    const {limit} = req.query;
    const products = await productManager.getProducts();
    if(!limit) {
       return res.send(products);
    }
    
   const limitProducts = products.slice(0, limit);
   res.send(limitProducts);
});

app.get("/products/:id", async (req, res) => {
    const { id } = req.params;
    const productId = parseInt(id); 
  
    const product = await productManager.getProductById(productId);
  
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ error: "Producto no encontrado" });
    }
  });

app.listen(PORT, () => {
    console.log(`Servidor funcionando en puerto ${PORT} `)
});