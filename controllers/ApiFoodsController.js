const productosModel = require('../models/apiFoods');

async function getProductosApi(req, res) {
    const { nombre } = req.query;

    try {
        const products = await productosModel.obtenerProductosApi(nombre);
        res.json(products);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
}

module.exports = { getProductosApi };
