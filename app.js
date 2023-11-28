
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const categoriesRoutes = require('./routes/categories-routes');
const productsRoutes = require('./routes/products-routes')
const orderRoutes = require('./routes/orders-routes');


const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });




app.use('/api/categories', categoriesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', orderRoutes);

mongoose
    .connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.v4ofevg.mongodb.net/${process.env.DB_NAME}`
    )
    .then(() => {
        app.listen(5000);
    })
    .catch((err) => {
        console.log('probando conexion');
    });
