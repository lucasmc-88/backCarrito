
const Product = require('../models/product');
const Category = require('../models/category');
const HttpError = require('../models/http-error')


const getProduct = async (req, res, next) => {
    let products;
    try {

        products = await Product.find().populate('categoryId');
        console.log(products + '***');
    } catch (err) {
        const error = new HttpError(
            'Error al listar los productos'
        );
        return next(error)
    }


    if (!products.length) {
        const error = new HttpError("No se encontraron productos", 404);
        return next(error);
    }

    res.json({ products });
};

const getProductsByCategoryId = async (req, res, next) => {
    const categoryId = req.params.cid

    let products
    try {
        products = await Product.find({ categoryId });
       // products = await Product.findById(categoryId).populate('categoryId');
        console.log(products);
    } catch (err) {
        const error = new HttpError(
            'Error al listar los productos por categoría'
        );
        return next(error);
    }
    res.json(products);
}
const getProductById = async (req, res, next) => {
    const productId = req.params.pid;
    let product;
    try {
        product = await Product.findById(productId).populate('categoryId');
        if (!product) {
            const error = new HttpError("No se pudo encontrar el producto para el ID proporcionado", 404);
            return next(error);
        };
    } catch (err) {
        const error = new HttpError(
            'Error al obtener el producto'
        );
        return next(error)
    }

    res.json({ product: product.toObject({ getters: true }) });
};

const createProduct = async (req, res, next) => {
    try {
        const productsToAdd = req.body;

        // Valida que req.body sea un array de productos
        if (!Array.isArray(productsToAdd)) {
            const error = new HttpError("La solicitud debe ser un arreglo de productos", 400);
            return next(error);
        }

        // Utiliza el método `insertMany` para crear varios productos a la coleccion
        const createdProducts = await Product.insertMany(productsToAdd);

        res.status(201).json({ createdProducts });
    } catch (err) { 
        const error = new HttpError(
            'Error al crear los productos'
        );
        return next(error)
    }
};

const updateProduct = async (req, res, next) => {
    const { name, description, price, categoryId, stock } = req.body;
    const productId = req.body.id;

    const product = await Product.findOne({ id: productId });
    if (!product) {
        const error = new HttpError("Producto no encontrados", 404);
        return next(error);
    }

    product.name = name;
    product.description = description;
    product.price = price;
    product.categoryId = categoryId;
    product.stock = stock;

    try {
        await product.save();
    } catch (err) {
        const error = new HttpError(
            'Algo salió mal, no se pudo actualizar el producto'
        );
        return next(error)
    }

    res.status(200).json({ product: product.toObject({ getters: true }) });

};

const deleteProduct = async (req, res, next) => {
    const  productId = req.params.pid;
console.log(productId + '*****');
    const product = await Product.findById( {_id: productId});

    if (!product) {
        const error = new HttpError("Producto no encontrados", 404);
        return next(error);
    }

    await Product.deleteOne({_id: productId});

    res.status(200).json({ message: "Producto eliminado con exito" });
}

exports.getProduct = getProduct;
exports.getProductsByCategoryId = getProductsByCategoryId;
exports.getProductById = getProductById;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
