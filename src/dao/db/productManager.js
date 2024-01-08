import productModel from "./models/product.model.js"

class ProductManager {
    constructor() {
        this.products = [];
    }

    async init() {
        await this.loadProducts();
    }

    async addProduct(product) {
        try {
            const newProduct = new productModel(product);
            await newProduct.save();

            await this.loadProducts();
        } catch (error) {
            console.error("Error al agregar producto:", error);
        }
    }
    
    generateProductId() {
        return 0;
    }

    async getProducts() {
        return this.products
    }
  
    async getProductById(productId) {
        return this.products.find(product => product.id === productId);
    }
  
    async updateProduct(updatedProduct) {
        try {
            await productModel.findByIdAndUpdate(updatedProduct.id, updatedProduct);

            await this.loadProducts();
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            throw error;
        }
    }
  
    async deleteProduct(productId) {
        try {
            await productModel.findByIdAndDelete(productId);

            await this.loadProducts();
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            throw error;
        }
    }
  
    async loadProducts() {
        try {
            const productsFromDB = await productModel.find().lean();
            productsFromDB.forEach((producto) => {
                producto.id = producto._id.toString();
                delete producto._id;
            });
            this.products = productsFromDB;
        } catch (error) {
            console.error("Error cargando productos desde la base de datos:", error);
        }
    }
}

export default ProductManager;