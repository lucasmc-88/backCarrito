const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const orderSchema = new Schema({
    products: [{
        productId:{type: mongoose.Types.ObjectId, required: false, ref: 'Product'},
        quantity: { type: Number, required: false, validate: { validator: (v) => v > 0, message: 'La cantidad debe ser mayor a 0.' }},
    }],
    
    totalprice: { type: Number, required: false, validate: { validator: (v) => v >= 0, message: 'El precio total debe ser mayor o igual a 0.' } },
});

orderSchema.methods.calculateTotalPrice = function(order) {
  console.log(order.products[0].productId.price + ' dentro del primero');
  order.totalprice = order.products.reduce((sum, { quantity, productId }) => sum + quantity * productId.price, 0);
  console.log(order.products[0].productId.price + ' dentro del for');
};




module.exports = mongoose.model('Order', orderSchema);

