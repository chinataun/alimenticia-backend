const axios = require('axios');

async function obtenerProductosApi(nombre) {
    const language = 'es';
    const pageSize = 10; // Cambiado a 50 productos por página
    const country = 'en:spain'; // Filtrar solo productos de España

    try {
        const response = await axios.get(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(nombre)}&page=1&page_size=${pageSize}&json=true&lc=${language}&countries=${country}`);
        return response.data.products.map(product => ({
            title: product.product_name_es,
            imageUrl: product.image_front_small_url,
            nutritionalInfo: product.nutriments, // Agregar información nutricional
            ecoScore: product.ecoscore_grade, // Agregar ecoScore
            nutriScore: product.nutrition_grades, // Agregar nutriScore
            novaGroup: product.nova_group // Agregar novaGroup
        }));
    } catch (error) {
        console.error('Error al obtener productos:', error);
        throw new Error('Error al obtener productos');
    }
}

module.exports = { obtenerProductosApi };
