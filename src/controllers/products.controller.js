import { productManager } from "../app.js";
import { faker } from "@faker-js/faker"

export const getProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, query = "", sort = "" } = req.query;
    console.log("Query parameters:", { limit, page, query, sort });
    const resultado = await productManager.loadProducts(
      limit,
      page,
      query,
      sort
    );
    console.log("Result:", resultado);
    if (resultado) {
      res.send(resultado);
    } else {
      res.status(400).json({ message: "Not found" });
    }
  } catch (err) {
    console.log({ err });
    res
      .status(400)
      .json({ message: "Error al obtener los productos" + err.message });
  }
};

const generateProduct = () => ({
  _id: faker.string.uuid(),
  id: faker.number.int().toString(),
  title: faker.commerce.productName(),
  code: faker.number.int({ min: 100000, max: 999999 }),
  status: faker.datatype.boolean(),
  stock: faker.number.int({ min: 0, max: 100 }),
  price: faker.number.int({ min: 100, max: 5000 }),
  thumbnails: [],
  category: ['Insumos', 'Electrodomésticos', 'Ropa', 'Alimentos', 'Tecnología'][Math.floor(Math.random() * 5)],
  __v: 0
});

export const getMockingProducts = async (req, res) => {
  try {
    const products = Array.from({ length: 100 }, () => generateProduct());

    res.send(products)
  } catch (err) {
    console.log({ err });
    res
      .status(400)
      .json({ message: "Error al obtener los productos" + err.message });
  }
};

export const getProductsId = async (req, res) => {
  const { id } = req.params;

  const product = await productManager.getProductById(id);

  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ error: "Producto no encontrado" });
  }
};

export const postProducts = async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails } =
      req.body;
    if (!title || !description || !code || !price || !stock || !category) {
      return res
        .status(400)
        .send({ error: "Todos los campos son obligatorios" });
    }
    const newProductId = productManager.generateProductId();

    const newProduct = {
      id: newProductId,
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails: thumbnails || [],
    };

    await productManager.addProduct(newProduct);

    res.status(201).send({
      message: "Producto agregado exitosamente.",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error al agregar el producto:", error);
    res
      .status(500)
      .send({ error: "Error del servidor al agregar el producto." });
  }
};

export const putProductsId = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProduct = await productManager.getProductById(id);
    if (!existingProduct) {
      return res.status(404).send({ error: "Producto no encontrado" });
    }

    const { title, description, code, price, stock, category, thumbnails } =
      req.body;

    existingProduct.title = title || existingProduct.title;
    existingProduct.description = description || existingProduct.description;
    existingProduct.code = code || existingProduct.code;
    existingProduct.price = price || existingProduct.price;
    existingProduct.stock = stock || existingProduct.stock;
    existingProduct.category = category || existingProduct.category;
    existingProduct.thumbnails = thumbnails || existingProduct.thumbnails;

    console.log(existingProduct);

    await productManager.updateProduct(existingProduct);

    res.send({ message: "Producto actualizado.", product: existingProduct });
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res
      .status(500)
      .send({ error: "Error del servidor al actualizar el producto" });
  }
};

export const deleteProductsId = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProduct = await productManager.getProductById(id);
    if (!existingProduct) {
      return res.status(404).send({ error: "Producto no encontrado" });
    }

    await productManager.deleteProduct(id);

    res.send({ message: "Producto eliminado" });
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res
      .status(500)
      .send({ error: "Error del servidor al eliminar el producto" });
  }
};
