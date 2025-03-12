const mongoose = require('mongoose');

// 📌 Definir el esquema del pedido
const pedidoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    tipoComida: { type: String, required: true },
    pagado: { type: Boolean, default: false },
    entregado: { type: Boolean, default: false },
    precioComida: { type: Number, required: false },  
    dineroRecibido: { type: Number, required: false },  
/*     cambio: { 
        type: Number, 
        default: function() { return this.dineroRecibido - this.precioComida; } 
    }, */
    cambioEntregado: {type: Boolean, default: false}
});

// 📌 Crear el modelo y exportarlo
const Pedido = mongoose.model('Pedido', pedidoSchema);
module.exports = Pedido;
