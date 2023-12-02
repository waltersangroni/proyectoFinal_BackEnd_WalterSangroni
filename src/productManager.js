
import fs from 'fs/promises';

    class ProductManager {
    constructor(filePath) {
      this.products = [];
      this.productIdCounter = 1; 
      this.path = filePath;
      this.fileName = 'products.json';
      
    }

    async init() {
      await this.loadProducts();
    }

    async addProduct(product) {
      product.id = this.productIdCounter++;
      this.products.push(product);
      await this.saveProducts();
      console.log('Producto agregado:', product);
    }
  
    async getProducts() {
      await this.loadProducts();
      return this.products;
    }

    async getProductById(productId) {
      await this.loadProducts();
    const searchProduct = this.products.find(product => product.id === productId);
    if (searchProduct) {
      return searchProduct;
    } else {
      console.error('Producto no encontrado:', productId);
    }
  }

  async updateProduct(productId, updatedProduct) {
    const index = this.findIndexById(productId);

    if (index !== -1) {
      this.products[index] = {
        ...this.products[index],
        ...updatedProduct,
        id: productId, 
      };
      await this.saveProducts();
      console.log('Producto actualizado:', this.products[index]);
    } else {
      console.error('Producto no encontrado:', productId);
    }
  }

  async deleteProduct(productId) {
    const index = this.findIndexById(productId);

    if (index !== -1) {
      const deletedProduct = this.products.splice(index, 1)[0];
      await this.saveProducts();
      console.log('Producto eliminado:', deletedProduct);
    } else {
      console.error('Producto no encontrado:', productId);
    }
  }

  findIndexById(productId) {
    return this.products.findIndex(product => product.id === productId);
  }

  async loadProducts() {
    try {
      const data = await fs.readFile(this.path + this.fileName, 'utf8');
      this.products = JSON.parse(data);
    } catch (error) {
      console.error('Error al cargar el archivo de productos:', error);
    }
  }

  async saveProducts() {
    const data = JSON.stringify(this.products, null, 2);
    try {
      await fs.writeFile(this.path + this.fileName, data, 'utf8');
    } catch (error) {
      console.log('No se pudo guardar el archivo de productos.');
    }
  }
}


  
  (async () => {
    let productManager = new ProductManager('./');
    await productManager.init(); 
    await productManager.addProduct({
    title: 'Cafetera Italiana',
    description: 'La cafetera italiana o cafetera moka produce un café de calidad, intenso y con cuerpo en pocos minutos. Es la forma casera de conseguir un café expreso a baja presión con un funcionamiento sencillo, fácil y rápido. ',
    price: 30000,
    thumbnail: 'imagen1.jpg',
    code: 'A1',
    stock: 20,
  });  
  await productManager.addProduct({
    title: 'Cafetera prensa Francesa',
    description: 'La prensa francesa es un tipo de cafetera de émbolo o de pistón con el que se puede obtener una excelente taza de café de forma fácil y rápida. El café preparado con prensa francesa tiene mucho cuerpo y es más denso, ya que retiene más aceites del café que otras cafeteras.',
    price: 22000,
    thumbnail: 'imagen2.jpg',
    code: 'A2',
    stock: 30,
  });
  await productManager.addProduct({
    title: 'Cafetera express',
    description: 'Una cafetera express, espresso o exprés se llama así por el sistema de funcionamiento, inventado en Italia a principios del siglo XX y que permitió el nacimiento del café espresso, el gran icono italiano.',
    price: 175000,
    thumbnail: 'imagen3.jpg',
    code: 'A3', 
    stock: 12,
  });
  await productManager.addProduct({
    title: 'Cafetera... ',
    description: 'Una cafetera express...',
    price: 155000,
    thumbnail: 'imagen3.jpg',
    code: 'A4', 
    stock: 12,
  });
  await productManager.addProduct({
    title: 'Cafetera... ',
    description: 'Una cafetera express...',
    price: 1750,
    thumbnail: 'imagen3.jpg',
    code: 'A5', 
    stock: 12,
  });
  await productManager.addProduct({
    title: 'Cafetera... ',
    description: 'Una cafetera express...',
    price: 175000,
    thumbnail: 'imagen3.jpg',
    code: 'A6', 
    stock: 12,
  });
  await productManager.addProduct({
    title: 'Cafetera... ',
    description: 'Una cafetera express...',
    price: 175000,
    thumbnail: 'imagen3.jpg',
    code: 'A7', 
    stock: 12,
  });
  await productManager.addProduct({
    title: 'Cafetera... ',
    description: 'Una cafetera express...',
    price: 175000,
    thumbnail: 'imagen3.jpg',
    code: 'A8', 
    stock: 12,
  });
  await productManager.addProduct({
    title: 'Cafetera... ',
    description: 'Una cafetera express...',
    price: 175000,
    thumbnail: 'imagen3.jpg',
    code: 'A9', 
    stock: 12,
  });
  await productManager.addProduct({
    title: 'Cafetera... ',
    description: 'Una cafetera express...',
    price: 175000,
    thumbnail: 'imagen3.jpg',
    code: 'A10', 
    stock: 12,
  });
  await productManager.addProduct({
    title: 'Cafetera... ',
    description: 'Una cafetera express...',
    price: 175000,
    thumbnail: 'imagen3.jpg',
    code: 'A11', 
    stock: 12,
  });
  await productManager.addProduct({
    title: 'Cafetera... ',
    description: 'Una cafetera express...',
    price: 175000,
    thumbnail: 'imagen3.jpg',
    code: 'A12', 
    stock: 12,
  })

  const productList = await productManager.getProducts();
  console.log('Lista de productos:', productList);
  

  const searchProduct = await productManager.getProductById(1);
  console.log('Producto encontrado:', searchProduct);
  
  await productManager.updateProduct(1, {
    price: 55000,
    stock: 15,
  });
  
  await productManager.deleteProduct(2);
})();

export default ProductManager