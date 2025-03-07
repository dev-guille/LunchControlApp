require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Pedido = require('./models/Pedido');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// 📌 Conectar a MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Conectado a MongoDB'))
    .catch(err => console.error('❌ Error de conexión:', err));

app.use(express.json());
app.use(cors());
app.use(express.static('public')); // Servir archivos estáticos

// 📊 Obtener todos los pedidos
app.get('/pedidos', async (req, res) => {
    const pedidos = await Pedido.find();
    res.json(pedidos);
});

// ➕ Crear un nuevo pedido
app.post('/pedidos', async (req, res) => {
    const { nombre, tipoComida } = req.body;
    if (!nombre || !tipoComida) return res.status(400).json({ error: 'Faltan datos' });

    const nuevoPedido = new Pedido({ nombre, tipoComida });
    await nuevoPedido.save();
    res.status(201).json(nuevoPedido);
});

// ✅ Marcar como pagado o entregado
app.put('/pedidos/:id', async (req, res) => {
    const { id } = req.params;
    const { pagado, entregado, cambio } = req.body;

    const pedidoActualizado = await Pedido.findByIdAndUpdate(id, { pagado, entregado, cambio }, { new: true });
    if (!pedidoActualizado) return res.status(404).json({ error: 'Pedido no encontrado' });

    res.json(pedidoActualizado);
});

// ❌ Eliminar un pedido
app.delete('/pedidos/:id', async (req, res) => {
    const { id } = req.params;
    await Pedido.findByIdAndDelete(id);
    res.json({ message: 'Pedido eliminado' });
});

// 🔥 Limpiar todos los pedidos
app.delete('/pedidos', async (req, res) => {
    await Pedido.deleteMany({});
    res.json({ message: 'Todos los pedidos eliminados' });
});

// 🚀 Iniciar el servidor
app.listen(PORT, () => console.log(`Servidor corriendo en https://lunchcontrolapp.onrender.com/:${PORT}`));
