// controllers/alimentosController.js
const Beneficio = require('../models/beneficio');
const { Alimento, Temporada, CategoriaAlimento, Almacenaje, Producto } = require('../models/index');
const Seleccion = require('../models/seleccion');

const { port,db, sequelize } = require('../config');
const { Op, QueryTypes } = require('sequelize');
const getAlimentos = async (req, res) => {
  // const mes = req.params.mes;

  try {
    const alimentos = await Alimento.findAll({
      include: [{
        model: Temporada,
        as: 'temporada'
      }, {
        model: CategoriaAlimento,
        as: 'categoria'
      }]
    });
    res.json(alimentos);
  } catch (error) { 
    res.status(500).json({ message: 'Error en el servidor' });
  }

};


const getAlimento = async (req, res) => {
  const nombre = req.params.nombre;

  try {
    const alimento = await Alimento.findOne(
      { 
        where: { nombre: nombre },
        include: [
          {
            model: Temporada,
            as: 'temporada'
          }, 
          {
            model: CategoriaAlimento,
            as: 'categoria'
          }, {
            model: Beneficio,
            as: 'beneficio'
          }, {
            model: Almacenaje,
            as: 'almacenaje'
          }, {
            model: Seleccion,
            as: 'seleccion'
          }
        ]
      }
    );
    // const alimentos = await Alimento.findAll({
    //   include: [{
    //     model: Temporada,
    //     as: 'temporadas'
    //   }, {
    //     model: Categoria,
    //     as: 'categoria'
    //   }]
    // });
    res.json(alimento);
  } catch (error) { 

    console.log(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }

};

const getBusquedaAlimento = async (req, res) => {
  const nombre = req.params.nombre;

  try  {
    //findAll donde el termino pueda esta encluido en el nombre o en la SubCategoriaNuestra
    const lowerCaseTerm = nombre.toLowerCase();
    const supermercados = ['dia', 'ahorramas', 'eroski', 'alcampo']
    const results = {};

    for ( const supermercado of supermercados) {
      const productos = await Producto.findAll({
        where: {
          supermercado: supermercado,
          [Op.and]: [
            // sequelize.where(
            //   sequelize.fn('LOWER', sequelize.col('nombre')),
            //   { [Op.like]: '%' + lowerCaseTerm + '%' }
            // ),
            sequelize.literal(`FIND_IN_SET('${lowerCaseTerm}', REPLACE(LOWER(nombre), ' ', ','))`),

          ]
        }
      });
      results[supermercado] = productos;
    }


    res.json(results);
  
      // console.log('Resultados', rows);
      // return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error al obtener la búsqueda desde la base de datos:', error);
      return null;
    }

};


module.exports = {
  getAlimento,
  getAlimentos,
  getBusquedaAlimento
};
  