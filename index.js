// Realizar una clase “ProductManager” que gestione un conjunto de productos.
// Debe crearse desde su constructor con el elemento products, el cual será un arreglo vacío.
// Cada producto que gestione debe contar con las propiedades:
// title (nombre del producto)
// description (descripción del producto)
// price (precio)
// thumbnail (ruta de imagen)
// code (código identificador)
// stock (número de piezas disponibles)
// Debe contar con un método “addProduct” el cual agregará un producto al arreglo de productos inicial.
// Validar que no se repita el campo “code” y que todos los campos sean obligatorios
// Al agregarlo, debe crearse con un id autoincrementable
// Debe contar con un método “getProducts” el cual debe devolver el arreglo con todos los productos creados hasta ese momento
// Debe contar con un método “getProductById” el cual debe buscar en el arreglo el producto que coincida con el id
// En caso de no coincidir ningún id, mostrar en consola un error “Not found”

class ProductManager {
    constructor() {
      this.products = [];
      this.productIdCounter = 1; // Contador para asignar IDs autoincrementables
    }
  
    addProduct(product) {
      // Validar que todos los campos sean obligatorios
      if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
        console.error('Todos los campos son obligatorios.');
        return;
      }
  
      // Validar que no se repita el campo "code"
      if (this.products.some(existingProduct => existingProduct.code === product.code)) {
        console.error('Ya existe un producto con el mismo código.');
        return;
      }
  
      // Agregar el producto con un ID autoincrementable
      const newProduct = {
        ...product,
        id: this.productIdCounter++,
      };
      this.products.push(newProduct);
      console.log('Producto agregado:', newProduct);
    }
  
    getProducts() {
      return this.products;
    }
  
    getProductById(productId) {
      const searchProduct = this.products.find(product => product.id === productId);
      if (searchProduct) {
        return searchProduct;
      } else {
        console.error('Not found', productId);
      }
    }
  }
  
  // Ejemplo de uso:
  const productManager = new ProductManager();
  
  // Agregar productos
  productManager.addProduct({
    title: 'Cafetera Italiana',
    description: 'La cafetera italiana o cafetera moka produce un café de calidad, intenso y con cuerpo en pocos minutos. Es la forma casera de conseguir un café expreso a baja presión con un funcionamiento sencillo, fácil y rápido. ',
    price: 30000,
    thumbnail: 'imagen1.jpg',
    code: 'A1',
    stock: 20,
  });  
  productManager.addProduct({
    title: 'Cafetera prensa Francesa',
    description: 'La prensa francesa es un tipo de cafetera de émbolo o de pistón con el que se puede obtener una excelente taza de café de forma fácil y rápida. El café preparado con prensa francesa tiene mucho cuerpo y es más denso, ya que retiene más aceites del café que otras cafeteras.',
    price: 22000,
    thumbnail: 'imagen2.jpg',
    code: 'A2',
    stock: 30,
  });
  
  // Obtener la lista de productos
  const productList = productManager.getProducts();
  console.log('Lista de productos:', productList);
  
  // Buscar un producto por ID
  const searchProduct = productManager.getProductById(1);
  console.log('Producto encontrado:', searchProduct);
  
  // Intentar agregar un producto con código repetido (para demostrar la validación)
  productManager.addProduct({
    title: 'Cafetera express',
    description: 'Una cafetera express, espresso o exprés se llama así por el sistema de funcionamiento, inventado en Italia a principios del siglo XX y que permitió el nacimiento del café espresso, el gran icono italiano.',
    price: 175000,
    thumbnail: 'imagen3.jpg',
    code: 'A1', // Este código ya existe
    stock: 12,
  });

