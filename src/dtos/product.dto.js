class ProductDTO {
    constructor (product) {
        this.title = product.title,
        this.descripcion = product.descripcion,
        this.price = product.price,
        this.code = product.code,
        this.stock = product.stock,
        this.status = product.status,
        this.category = product.category,
        this.thumbail = product.thumbail
    }
}

export default ProductDTO;