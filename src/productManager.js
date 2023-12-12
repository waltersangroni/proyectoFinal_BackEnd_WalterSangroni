import fs from 'fs/promises';

    class ProductManager {
    constructor(filePath) {
      this.products = [];
      this.productIdCounter = 0; 
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

    async generateProductId() {
      return this.productIdCounter++;
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

  async updateProduct(updatedProduct) {
    const index = this.findIndexById(updatedProduct.id);

    console.log('Intentando actualizar producto con ID:', updatedProduct.id);
    console.log('Productos actuales:', this.products);

    if (index !== -1) {
      this.products[index] = {
        ...this.products[index],
        ...updatedProduct,
        
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

export default ProductManager