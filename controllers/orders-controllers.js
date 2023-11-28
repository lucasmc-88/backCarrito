const Order = require('../models/order');
const Product = require('../models/product')
const HttpError = require('../models/http-error')



const createOrder = async (req, res, next) => {
  const { products } = req.body;
  let result;
  let newOrder = new Order({
   
    products,
  });

  try {
    await newOrder.save();

  } catch (err) {

    const error = new HttpError(
      'Error al crear el carrito'
    );
    return next(error);
  }
  return res.status(201).json({ newOrder });
}

const addProduct = async (req, res, next) => {
  const orderId = req.params.oid;
  const productsToAdd = req.body.products;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      const error = new HttpError("Carrito de compra no encontrado", 404);
      return next(error);
    }
    // Crear un mapa para realizar un seguimiento de la cantidad de cada producto


    // Recorrer los productos a agregar
    for (const productToAdd of productsToAdd) {
      const productId = productToAdd.productId;

      const existingProduct = order.products.find(product => product.productId.equals(productId));

      if (existingProduct) {
        existingProduct.quantity++;
      } else {

        order.products.push({ productId, quantity: 1 });
      }

    }
    await order.save();

    res.json({ order });
  } catch (err) {
    const error = new HttpError(
      'No se pudieron agregar los productos al carrito'
    );
    return next(error);
  }
};

const updateProductByOrder = async (req, res, next) => {
  const orderId = req.params.oid;
  const productId = req.params.pid;
  const newQuantity = req.body.quantity;
  console.log(newQuantity + '*****************************');
  let order;
  try {

    order = await Order.findById(orderId);
    if (!order) {
      const error = new HttpError("Carrito de compra no encontrado", 404);
      return next(error);
    }


    const productToUpdate = order.products.find((product) => product.productId.toString() === productId);


    if (!productToUpdate) {
      const error = new HttpError("Producto no encontrado en la orden", 404);
      return next(error);
    }
    productToUpdate.quantity = newQuantity;

    // order.calculateTotalPrice(order); 

    await order.save();

    res.status(200).json(order);
  } catch (err) {
    const error = new HttpError(
      'No se pudo actualizar la cantidad del producto'
    );
    return next(error);
  }
};
const deleteProductByOrder = async (req, res, next) => {
  const orderId = req.params.oid;
  const productId = req.params.pid;

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      const error = new HttpError("Carrito de compra no encontrado", 404);
      return next(error);
    }

    // Buscamos el producto en la orden por su ID de producto
    const product = order.products.find((product) => product.productId == productId);

    if (!product) {
      const error = new HttpError("Producto no encontrado", 404);
      return next(error);
    }

    // Actualizamos los productos
    if (product.quantity === 1) {
      const updatedProducts = order.products.filter((product) => product.productId != productId);
      order.products = updatedProducts;
    } else {
      product.quantity -= 1;

    }
    //order.calculateTotalPrice();
    await order.save();

    res.json(order);
  } catch (err) {
    const error = new HttpError(
      'No se pudo eliminar el producto del carrito'
    );
    return next(error);
  }
};

const deleteAllProductById = async (req, res, next) => {
  const orderId = req.params.oid;
  const productId = req.params.pid;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      const error = new HttpError("Carrito de compra no encontrado", 404);
      return next(error);
    }

    const updatedProducts = order.products.filter((product) => product.productId != productId);
    order.products = updatedProducts;
    //order.calculateTotalPrice();

    await order.save();

    res.json(order);
  } catch (err) {
    const error = new HttpError(
      'No se pudo eliminar el producto del carrito'
    );
    return next(error);
  }
}

const deleteOrder = async (req, res, next) => {
  const orderId = req.params.oid;
  console.log(orderId);

  try {
    const order = await Order.findOne({ _id: orderId });

    if (!order) {
      const error = new HttpError("Orden no encontrada", 404);
      return next(error);
    }

    await order.deleteOne({ _id: orderId });
    res.status(200).json({ message: "Orden eliminada con éxito" });
  } catch (err) {
    const error = new HttpError(
      'No se pudo obtener la orden de compra'
    );
    return next(error);
  }
}

const getOrderById = async (req, res, next) => {
  const orderId = req.params.oid;

  let order

  try {

    //order = await Order.findById(orderId).populate({ path: 'products.productId', select: 'price' });
   order = await Order.findById(orderId).populate('products.productId');
    const product = order.products[0].productId


    if (!order) {

      res.status(404).json({ message: "No se encontro ninguna orden de compra" });
    }
    order.calculateTotalPrice(order);
  }  catch (err) {
    console.error(err)
    res.status(404).json({ message: "Algo salio mal, no se pudo encontrar ninguna orden" });
    }
  res.json({ order });
}

const getOrder = async (req, res, next) => {
let orders;
  try {
   //orders = await Order.find().populate('products.productId.name products.productId.description products.productId.price');
  orders = await Order.find().populate('products.productId');
   //orders = await Order.find().populate({path: 'products.productId',select: ' price' });
  
console.log(orders + '*****');

    if (!orders) {
      res.status(404).json({ message: "No se encontro ninguna orden de compra" });
    };
  
   orders.forEach(order => {
      console.log(order.products[0].productId.price + ' dentro del for');
    
        order.calculateTotalPrice(order);
      
    });
    res.json(orders);
  } catch (err) {
    console.error(err)
    res.status(404).json({ message: "Algo salio mal, no se pudo encontrar ninguna orden" });
    }
};


exports.createOrder = createOrder;
exports.addProduct = addProduct;
exports.updateProductByOrder = updateProductByOrder;
exports.deleteProductByOrder = deleteProductByOrder;
exports.deleteAllProductById = deleteAllProductById;
exports.deleteOrder = deleteOrder;
exports.getOrderById = getOrderById;
exports.getOrder = getOrder;
