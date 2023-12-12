import { Router } from "express";
import { productManager } from "../app.js"; 

const productsRouter = Router();

    productsRouter.get("/", async (req, res) => {
        const {limit} = req.query;
        const products = await productManager.getProducts();
        if(!limit) {
           return res.send(products);
        }
        
       const limitProducts = products.slice(0, limit);
       res.send(limitProducts);
    });
    
    productsRouter.get("/:id", async (req, res) => {
        const { id } = req.params;
        const productId = parseInt(id); 
      
        const product = await productManager.getProductById(productId);
      
        if (product) {
          res.send(product);
        } else {
          res.status(404).send({ error: "Producto no encontrado" });
        }
      });

      productsRouter.post("/", async (req, res) => {
        try {
            const {
                title,
                description,
                code,
                price,
                stock,
                category,
                thumbnails
            } = req.body;
            if (!title || !description || !code || !price || !stock || !category) {
                return res.status(400).send({ error: "Todos los campos son obligatorios" })
            }
            const newProductId = await productManager.generateProductId();

            const newProduct = {
                id: newProductId,
                title,
                description,
                code,
                price,
                status: true,
                stock,
                category,
                thumbnails: thumbnails || []
            }

            await productManager.addProduct(newProduct);

            res.status(201).send({ message: "Producto agregado exitosamente.", product: newProduct})
        } catch (error) {
            console.error("Error al agregar el producto:", error);
            res.status(500).send({ error:"Error del servidor al agregar el producto." })
        }
      });

      productsRouter.put("/:id", async (req, res) => {
        try {
          const {id} = req.params;
          const productId = parseInt(id);

          const existingProduct = await productManager.getProductById(productId);
          if (!existingProduct) {
            return res.status(404).send({ error: "Producto no encontrado"});
          }

          const {
            title, 
            description,
            code,
            price,
            stock,
            category,
            thumbnails
          } = req.body;

            existingProduct.title = title || existingProduct.title;
            existingProduct.description = description || existingProduct.description;
            existingProduct.code = code || existingProduct.code;
            existingProduct.price = price || existingProduct.price;
            existingProduct.stock = stock || existingProduct.stock;
            existingProduct.category = category || existingProduct.category;
            existingProduct.thumbnails = thumbnails || existingProduct.thumbnails;

            await productManager.updateProduct(existingProduct);

            res.send({ message: "Producto actualizado.", product: existingProduct});
        } catch (error) {
          console.error("Error al actualizar el producto:", error);
          res.status(500).send({ error: "Error del servidor al actualizar el producto"});
        }
      })

      productsRouter.delete("/:id", async (req, res) => {
        try {
          const {id} = req.params;
          const productId = parseInt(id);

          const existingProduct = await productManager.getProductById(productId);
          if (!existingProduct) {
            return res.status(404).send({ error: "Producto no encontrado"})
          }

          await productManager.deleteProduct(productId);

          res.send({ message: "Producto eliminado"});
        }
        catch (error) {
          console.error("Error al eliminar el producto:", error);
          res.status(500).send({error: "Error del servidor al eliminar el producto"})
        }
      })


export default productsRouter;