const { sequelize } = require('../config');
const Alimento = require('./alimento');
const CategoriaAlimento = require('./categoriaAlimento');
const CategoriaReceta = require('./categoriaReceta');
const Receta = require('./receta');
const Temporada = require('./temporada');
const User = require('./user');
const Almacenaje = require('./almacenaje');
const Beneficio = require('./beneficio');
const Seleccion = require('./seleccion');
const Compra = require('./compra');
const Rating = require('./rating');
const Producto = require('./producto');

async function testConnection() {
    try {
      await sequelize.authenticate();
      
      Receta.belongsToMany(User, {as: 'favoriteadas', through: 'recetas_favoritas', onDelete: 'CASCADE'});
      User.belongsToMany(Receta, {as: 'favoritas', through: 'recetas_favoritas', onDelete: 'CASCADE' });

      Receta.belongsTo(User, {as: 'autor', foreignKey: 'userId', onDelete: 'CASCADE'});
      User.hasMany(Receta, {as: 'creadas', onDelete: 'CASCADE' });

      Receta.belongsTo(CategoriaReceta, {
        as: 'categoriaReceta',
        foreignKey: 'categoriaId'
      });
      CategoriaReceta.hasOne(Alimento, {
        as: 'categoriaReceta',
        foreignKey: 'categoriaId'
        
      });


      Alimento.belongsTo(CategoriaAlimento, {
        as: 'categoria',
        foreignKey: 'categoriaId'
      });
      CategoriaAlimento.hasOne(Alimento, {
        as: 'alimento',
        foreignKey: 'categoriaId'
      });      

      Alimento.hasOne(Temporada, {
        as: 'temporada',
        foreignKey: 'alimentoId'
      });
      Temporada.belongsTo(Alimento, {
        as: 'alimento',
        foreignKey: 'alimentoId'
      });

      //Se añade alimentoId a la tabla de almacenaje
      Alimento.hasMany(Almacenaje, {
        as: 'almacenaje',
        foreignKey: 'alimentoId'
      });
      //Se añade alimentoId a la tabla de almacenaje
      Almacenaje.belongsTo(Alimento, {
        as: 'alimento'
      });

      //Se añade alimentoId a la tabla de beneficio
      Alimento.hasMany(Beneficio, {
        as: 'beneficio',
        foreignKey: 'alimentoId'
      });
      Beneficio.belongsTo(Alimento, {
        as: 'alimento'
      });

      Alimento.hasMany(Seleccion, {
        //cambiar cuando se quite selecciones
        as: 'seleccion',
        foreignKey: 'alimentoId'
      });
      Seleccion.belongsTo(Alimento, {
        as: 'alimento'
      });
      Compra.belongsTo(User, {
        as: 'comprador',
        foreignKey: 'userId'
      });
      User.hasMany(Compra, {
        as: 'compras',
        foreignKey: 'userId'
      });  

      Receta.belongsToMany(User, {as: 'votos', through: 'rating' });
      User.belongsToMany(Receta, {as: 'votadas', through: 'rating'});
            
      sequelize.sync()
      .then((result) =>{
      }).catch((error) =>{
      console.log(error)
      })


    } catch (error) {
      console.error("All bad", error)
    }
    
  }

module.exports = {
    User,
    Receta,
    Alimento,
    Almacenaje,
    CategoriaReceta,
    CategoriaAlimento,
    Temporada,
    Producto,
    Compra,
    Rating,
    Seleccion,
    Beneficio,
    testConnection,
};