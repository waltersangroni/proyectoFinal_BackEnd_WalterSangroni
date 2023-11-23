// SEGUNDO DESAFIO ENTREGABLE 

// Realizar una clase de nombre “ProductManager”, el cual permitirá trabajar con múltiples productos. Éste debe poder agregar, consultar, modificar y eliminar un producto y manejarlo en persistencia de archivos (basado en entregable 1).
// Aspectos a incluir

// La clase debe contar con una variable this.path, el cual se inicializará desde el constructor y debe recibir la ruta a trabajar desde el momento de generar su instancia.

// Debe guardar objetos con el siguiente formato:
// id (se debe incrementar automáticamente, no enviarse desde el cuerpo)
// title (nombre del producto)
// description (descripción del producto)
// price (precio)
// thumbnail (ruta de imagen)
// code (código identificador)
// stock (número de piezas disponibles)

// Debe tener un método addProduct el cual debe recibir un objeto con el formato previamente especificado, asignarle un id autoincrementable y guardarlo en el arreglo (recuerda siempre guardarlo como un array en el archivo).
// Debe tener un método getProducts, el cual debe leer el archivo de productos y devolver todos los productos en formato de arreglo.
// Debe tener un método getProductById, el cual debe recibir un id, y tras leer el archivo, debe buscar el producto con el id especificado y devolverlo en formato objeto

// Debe tener un método updateProduct, el cual debe recibir el id del producto a actualizar, así también como el campo a actualizar (puede ser el objeto completo, como en una DB), y debe actualizar el producto que tenga ese id en el archivo. NO DEBE BORRARSE SU ID 
// Debe tener un método deleteProduct, el cual debe recibir un id y debe eliminar el producto que tenga ese id en el archivo.


const fs = require('fs').promises;

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

