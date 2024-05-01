import Ticket from "../dao/db/ticketManager.js";
import CartManager from "../dao/db/cartManager.js";
import ProductManager from "../dao/db/productManager.js";
import CustomErrors from "../services/errors/CustomErrors.js"
import ErrorEnum from "../services/errors/error.enum.js";

const ticketService = new Ticket();
const cartService = new CartManager();
const productService = new ProductManager();

export const purchaseCart = async (req, res) => {
  const { cId } = req.params;

  if(!cId) {
    CustomErrors.createError({
      name: "Falta el id del carrito",
      cause: "El id es null",
      message: "Error al obtener el parametro del id del carrito",
      code: ErrorEnum.INVALID_TYPE_ERROR,
    });
  }

  const cart = await cartService.getCartById(cId);
  const productsNotPurchased = cart.products.filter(product => {
      return product.product.stock < product.quantity;
  });
  const productsPurchased = cart.products.filter(product => {
      return product.product.stock >= product.quantity;
  });
  if (productsNotPurchased.length > 0) {
      cart.products = productsNotPurchased;
      await cartService.updateCart(cId, cart);
  }
  const totalprice = productsPurchased.reduce((acc, product) => {
      return acc + (product.product.price * product.quantity);
  }, 0);
  for (const product of productsPurchased) {
      const remainingStock = product.product.stock - product.quantity;
      const newStock = {
          stock: remainingStock
      }
      await productService.updateProduct(product.product._id, newStock);
  }
  const newTicket = {
    code: Math.floor(Math.random() * 9000000) + 1000000,
    purchase_datatime: new Date(),
    amount: totalprice,
    purchaser: req.user.email
}
await ticketService.createTicket(newTicket);
return res.send({message: "Ticket create"});
};



export const getCartId = async (req, res) => {
  try {
    const { cId } = req.params;
    if(!cId) {
      CustomErrors.createError({
        name: "Falta el id del carrito",
        cause: "El id es null",
        message: "Error al obtener el parametro del id del carrito",
        code: ErrorEnum.INVALID_TYPE_ERROR,
      });
    }
    const resultado = await cartService.getProductsCartById(cId);
    if (resultado.message === "OK") {
      return res.status(200).json(resultado);
    }
    res.status(400).json(resultado);
  } catch (err) {
    res.status(400).json({ message: "El carrito no existe" });
  }
};

export const deleteCartId = async (req, res) => {
  try {
    const { cId } = req.params;
    const deleted = await cartService.deleteAllProductsInCart(cId);

    if (deleted) {
      return res.status(200).json({ message: "Products deleted" });
    } else {
      return res.status(404).json({
        message: "Could not delete products",
        error: "Cart not found or no products to delete",
      });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

export const deleteCartIdProductsId = async (req, res) => {
  const { cId, pId } = req.params;

  try {
    const result = await cartService.deleteProductInCart(cId, pId);
    if (result) {
      res.send({ message: "Product deleted" });
    } else {
      res.status(400).json({ message: "Producto no eliminado" });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "could not delete product" });
  }
};

export const putCartId = async (req, res) => {
  const { cId } = req.params;
  const cart = req.body;
  try {
    const result = await cartService.updateCart(cId, cart);
    if (result.modifiedCount > 0) {
      res.send({ message: "Cart updated" });
    } else {
      res.status(400).send({ message: "Could not update cart" });
    }
  } catch (error) {
    console.error(error);
    res.status(400).send({ message: "Could not update cart" });
  }
};

export const putCartIdProductsId = async (req, res) => {
  const { cId, pId } = req.params;
  const { quantity } = req.body;
  const result = await cartService.updateProductInCart(cId, pId, quantity);
  if (result) {
    res.send({ message: "Product updated" });
  } else {
    res.status(400).send({ message: "could not update product" });
  }
};

export const postCart = async (req, res) => {
  try {
    const newCartId = await cartService.generateCartId();

    const newCart = {
      id: newCartId,
      products: [],
    };

    await cartService.addCart(newCart);

    res
      .status(201)
      .send({ message: "Carrito creado con exito.", cart: newCart });
  } catch (error) {
    console.error("Error al crear el carrito:", error);
    res.status(500).send({ error: "Error del servidor al crear el carrito." });
  }
};

export const getCart = async (req, res) => {
  try {
    const { id } = req.params;

    const existingCart = await cartService.getCartById(id);
    if (!existingCart) {
      return res.status(404).send({ error: "Carrito no encontrado" });
    }

    const cartProducts = existingCart.products;

    res.send({
      message: "Productos del carrito obtenidos.",
      products: cartProducts,
    });
  } catch (error) {
    console.error("Error al obtener los productos del carrito.", error);
    res
      .status(500)
      .send({
        error: "Error del servidor al obtener los productos del carrito.",
      });
  }
};

export const postCartIdProductsId = async (req, res) => {
  try {
    const { cId, pId } = req.params;
    const newQuantity = req.body.quantity;
    const carts = new CartManager();
    console.log({ cId, pId, newQuantity });
    const result = await carts.addProductsToCart(cId, pId, newQuantity);

    if (result) {
      return res.status(200).json({ message: "Product added" });
    }
    res.status(400).json({ message: "could not add product" });
  } catch (err) {
    console.error("Error:", err);
    res.status(400).send({ err });
  }
};

export const addProductToCart = async (req, res) => {
  const { cId, pId } = req.params;
  const cart = await cartService.getCartById(cId);
  const existingProduct = cart.products.find(product => product.product._id.toString() === pId);
  if (req.user.rol === "premium") {
      const existingProduct = cart.products.find(product => product.product._id.toString() === pId);
      if (existingProduct?.product.owner === req.user.email) {
          return res.status(403).send({message: "Unauthorized"});
      }
  }
  if (existingProduct) {
      existingProduct.quantity++;
  } else {
      cart.products.push({ product: pId });
  }
  await cart.save();
  if (!cart) {
      req.logger.error("Cart not found");
      return res.status(404).send({message: "error: cart not found"});
  }
  req.logger.info("Cart updated");
  return res.send({message: "Cart updated"});
};

export const updateCart = async (req, res) => {
  const { cId } = req.params;
  const cartUpdated = req.body;
  const result = await cartService.updateCart(cId, cartUpdated);
  if (!result) {
      req.logger.error("Cart not found");
      return res.status(404).send({message: "error: cart not found"});
  }
  req.logger.info("Cart updated");
  return res.send({message: "Cart updated"});
};

export const updateProductInCart = async (req, res) => {
  const { cId, pId } = req.params;
  const { quantity } = req.body;
  const cart = await cartService.getCartById(cId);
  if (!cart) {
      req.logger.error("Cart not found");
      return res.status(404).send({ message: "Error: Cart not found" });
  }
  const productIndex = cart.products.findIndex(product => product.product.equals(pId));
  if (productIndex !== -1) {
      cart.products[productIndex].quantity = quantity;
      await cart.save();
      req.logger.info("Product updated");
      res.send({ message: "Product updated" });
  } else {
      req.logger.error("Product not found");
      res.status(404).send({ message: "Error: Product not found" });
  }
};

export const deleteProductInCart = async (req, res) => {
  const { cId, pId } = req.params;
  const cart = await cartService.getCartById(cId);
  if (!cart) {
      req.logger.error("Cart not found");
      return res.status(404).send({message: "Error: Cart not found"});
  }
  const existingProduct = cart.products.find(product => product.product._id.toString() === pId);
  if (existingProduct) {
      cart.products = cart.products.filter(product => product.product._id.toString() !== pId);
      await cart.save();
      req.logger.info("Product deleted");
      res.send({message: "product deleted"});
  } else {
      req.logger.error("Product not found");
      res.status(404).send({message: "Error: Product not found"});
  }
};
