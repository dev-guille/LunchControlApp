const mongoose = require('mongoose');

// 📌 Definir el esquema del pedido
const pedidoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    tipoComida: { type: String, required: true },
    pagado: { type: Boolean, default: false },
    entregado: { type: Boolean, default: false },
    precioComida: { type: Number, required: false },  
    dineroRecibido: { type: Number, required: false },  
    cambio: { type: Number, default: 0 }, 
    cambioEntregado: {type: Boolean, default: false}
});

// Middleware para calcular el cambio antes de guardar
pedidoSchema.pre("save", function (next) {
    if (this.dineroRecibido !== undefined && this.precioComida !== undefined) {
        this.cambio = this.dineroRecibido - this.precioComida;
    }
    next();
});

// 📌 Crear el modelo y exportarlo
const Pedido = mongoose.model('Pedido', pedidoSchema);
module.exports = Pedido;
