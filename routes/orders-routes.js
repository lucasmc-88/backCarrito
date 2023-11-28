const express = require('express');
const router = express.Router();
const { check } = require("express-validator");
const orderController = require('../controllers/orders-controllers');


router.post('/createOrder', orderController.createOrder);

router.patch("/:oid", [
    check("productId").not().isEmpty(),
], orderController.addProduct);

router.patch("/:oid/update-product/:pid", [
    check("quantity").not().isEmpty(),
],orderController.updateProductByOrder);


router.delete("/:oid/delete-product/:pid", orderController.deleteProductByOrder);
router.delete("/:oid/deleteproductbyid/:pid", orderController.deleteAllProductById);

router.delete("/:oid", orderController.deleteOrder);

router.get("/:oid", orderController.getOrderById);

router.get("/", orderController.getOrder);

module.exports = router;