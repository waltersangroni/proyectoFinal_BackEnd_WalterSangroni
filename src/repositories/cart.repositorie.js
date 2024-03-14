export default class CartRepository {
    constructor(dao){
        this.dao = dao;
    }

    getCartById = async (id) => {
        const result = await this.dao.getCartById(id);
        return result;
    }

    addCart = async (cart) => {
        const result = await this.dao.addCart(cart);
        return result;
    }

    getProductsCartById = async (cId) => {
        const result = await this.dao.getProductsCartById(cId);
        return result;
    }

    getCarts = async () => {
        const result = await this.dao.getCarts();
        return result;
    }

    generateCartId = async () => {
        const result = await this.dao.generateCartId();
        return result;
    }

    loadCarts = async () => {
        const result = await this.dao.loadCarts();
        return result;
    }

    updateCart = async (cId) => {
        const result = await this.dao.updateCart(cId);
        return result;
    }

    deleteProductInCart = async (cId, pId) => {
        const result = await this.dao.deleteProductInCart(cId, pId);
        return result;
    }

    updateProductInCart = async (cId, pId, quantity) => {
        const result = await this.dao.updateProductInCart(cId, pId, quantity);
        return result;
    }

    deleteAllProductsInCart = async (id) => {
        const result = await this.dao.deleteAllProductsInCart(id);
        return result;
    }

    addProductsToCart = async (cId, pId, quantity) => {
        const result = await this.dao.addProductsToCart(cId, pId, quantity);
        return result;
    }

    purchaseCart = async (cId) => {
        try {
          // Obtén el carrito actual
          const cart = await this.dao.getCartById(cId);
      
          if (!cart || cart.products.length === 0) {
            // No hay carrito o el carrito está vacío, no se puede realizar la compra
            return { success: false, error: "El carrito está vacío." };
          }
               
          // Finalmente, elimina el carrito después de realizar la compra
          await this.dao.deleteCartId(cId);
      
          return { success: true, receipt: "Genera aquí tu recibo o información adicional si es necesario." };
        } catch (error) {
          console.error("Error al realizar la compra:", error);
          return { success: false, error: "Error del servidor al realizar la compra." };
        }
      };
}