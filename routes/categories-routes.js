const express = require('express');
const router = express.Router();
const { check } = require("express-validator");
const categoryController = require('../controllers/categories-controllers');


//Rutas para traer las categorias

router.get("/:cid",categoryController.getCategoriById);
router.get("/",categoryController.getCategory);

// Ruta para crear una nueva categoría


router.post('/', [
    check("name").not().isEmpty()
],
categoryController.createCategory);

//Rutas para modificar

router.patch(
    "/updatecategory/:cid",
    [check("name").not().isEmpty()],
    categoryController.updateCategory
);

router.delete("/:cid", categoryController.deleteCategory);

module.exports = router;



