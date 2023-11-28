const express = require('express');
const router = express.Router();
const { check } = require("express-validator");
const ProductController = require('../controllers/products-controllers');




router.get("/", ProductController.getProduct);

router.get('/category/:cid',ProductController.getProductsByCategoryId);

router.get("/:pid", ProductController.getProductById);

router.post(
    "/",
    [
        check("name").not().isEmpty(),
        check("description").not().isEmpty(),
        check("price").not().isEmpty(),
        check("stock").not().isEmpty(),
    ],
    ProductController.createProduct
);

router.patch("/:pid", [
    check("name").not().isEmpty(),
    check("description").not().isEmpty(),
    check("price").not().isEmpty(),
    check("stock").not().isEmpty(),
    ],
    ProductController.updateProduct
);

router.delete("/:pid", ProductController.deleteProduct);
module.exports = router;