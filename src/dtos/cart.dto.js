class CartDTO {
    constructor (cart) {
        this.product = cart.product,
        this.quantity = cart.quantity
    }
}

export default CartDTO;