import { productManager, cartManager } from "../app.js";
import { Router } from "express";

const cartRouter = Router();

cartRouter.post("/", async (req, res) => {
    try {
        const newCartId = await cartManager.generateCartId();

        const newCart = {
            id: newCartId,
            products: []
        };

        await cartManager.addCart(newCart);

        res.status(201).send({ message: "Carrito creado con exito.", cart: newCart});
    } catch (error) {
        console.error("Error al crear el carrito:", error);
        res.status(500).send({ error: "Error del servidor al crear el carrito."});
    }
});

cartRouter.get("/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const cartId = parseInt(id);

        const existingCart = await cartManager.getCartById(cartId);
        if (!existingCart) {
            return res.status(404).send({ error: "Carrito no encontrado"});
        }

        const cartProducts = existingCart.products;

        res.send({ message: "Productos del carrito obtenidos.", products: cartProducts});
    } catch (error) {
        console.error("Error al obtener los productos del carrito.", error);
        res.status(500).send({error: "Error del servidor al obtener los productos del carrito."});
    }
})

cartRouter.post("/:cid/products/:pid", async (req, res) => {
    try {
        const {cid, pid} = req.params;
        const cartId = parseInt(cid);
        const productId = parseInt(pid);

        const existingCart = await cartManager.getCartById(cartId);
        if (!existingCart) {
            return res.status(404).send({ error: "Carrito no encontrado"});
        }

        const existingProduct = await productManager.getProductById(productId);
        if (!existingProduct) {
            return res.status(404).send({ error: "Producto no encontrado."});
        }

        const cartProductIndex = existingCart.products.findIndex(cartProduct => cartProduct.product === productId);

        if( cartProductIndex !== -1) {
            existingCart.products[cartProductIndex].quantity++;
        } else {
            const cartProduct = {
                product: productId,
                quantity: 1
        };
            existingCart.products.push(cartProduct);   
        
        };

        await cartManager.updateCart(existingCart);

        res.status(201).send({ message: "Producto agregado al carrito.", cart: existingCart});
    } catch (error) {
        console.error("Error al agregar el producto al carrito.", error);
        res.status(500).send({ error: "Error del servidor al agregar el producto al carrito."});
    }
})

export default cartRouter;