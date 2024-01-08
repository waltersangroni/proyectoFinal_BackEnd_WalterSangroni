import cartModel from "./models/cart.model.js"

class CartManager {
    constructor() {
        this.carts = [];
    }

    async init() {
        await this.loadCarts();
    }

    async addCart(cart) {
        try {
            const newCart = new cartModel(cart);
            await newCart.save();

            await this.loadCarts();
        } catch (error) {
            console.error("Error al agregar producto:", error);
        }
    }

    async getCarts(){
        return this.carts;
    }

    async getCartById(cartId) {
        return this.carts.find(cart => cart.id === cartId);
    }

    async generateCartId() {
        return 0;
    }

    async loadCarts() {
        try {
            const cartsFromDB = await cartModel.find().lean();
            cartsFromDB.forEach((cart) => {
                cart.id = cart._id.toString();
                delete cart._id;
            });
            this.carts = cartsFromDB;
        } catch (error) {
            console.error("Error cargando productos desde la base de datos:", error);
        }
    }
    
    async updateCart(updatedCart) {
        try {
            await cartModel.findByIdAndUpdate(updatedCart.id, updatedCart);

            await this.loadCarts();
        } catch (error) {
            console.error("Error al actualizar producto:", error);
            throw error;
        }
    }
}

export default CartManager;