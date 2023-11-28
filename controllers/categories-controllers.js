const Category = require('../models/category');




const getCategoriById = async (req, res, next) => {
    const categoryId = req.params.cid;
    let category;
    try {
        category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ error: 'No se pudo encontrar una categoría para el ID proporcionado' });
        };
    } catch (error) {
        return res.status(500).json({ error: 'Error al obtener la categoria' });
    }

    res.json({ category: category.toObject({ getters: true }) });
};

const getCategory = async (req, res, next) => {
    let category;
    try {

        category = await Category.find()
    } catch (err) {
        const error = new HttpError(
            'Error al listar las categorias'
        );
        return next(error)
    }


    if (!category.length) {
        const error = new HttpError("No se encontraron categorias", 404);
        return next(error);
    }

    res.json({ category });
};

const createCategory = async (req, res, next) => {
    try {
        const categoriesToAdd = req.body; 

        // Valida que req.body sea un arreglo de categorías
        if (!Array.isArray(categoriesToAdd)) {
            return res.status(400).json({ error: 'El cuerpo de la solicitud debe ser un arreglo de categorías' });
        }

        // Utiliza el método `insertMany` para insertar varias categorías en la base de datos
        const createdCategories = await Category.insertMany(categoriesToAdd);

        res.status(201).json({ createdCategories });
    } catch (error) {
        console.log(error); 
        res.status(400).json({ error: 'Error al crear las categorías' });
    }
};

const updateCategory = async (req, res, next) => {
    const { name } = req.body;
    const categoryId = req.params.cid;

    const category = await Category.findOne({ _id: categoryId });
    console.log(category);
    if (!category) {
        return res.status(404).json({ message: "Categoría no encontrada." });
    }


    category.name = name;

    try {
        await category.save();
    } catch (err) {
        const error = 'Algo salió mal, no se pudo actualizar la categoria';
        return next(error);
    }

    // Devuelve la categoría actualizada.
    res.status(200).json({ category: category.toObject({ getters: true }) });

};

const deleteCategory = async (req, res, next) => {
    const categoryId  = req.params.cid;

    const category = await Category.findOne({ _id: categoryId });
    console.log(category + '****');
    if (!category) {

        return res.status(404).json({ message: "Categoría no encontrada." });
    }

    await Category.deleteOne({ _id: categoryId });

    res.status(200).json({ message: "Categoría eliminada con éxito." });
};


exports.getCategoriById = getCategoriById;
exports.getCategory = getCategory;
exports.createCategory = createCategory;
exports.updateCategory = updateCategory;
exports.deleteCategory = deleteCategory;
