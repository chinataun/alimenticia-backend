const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config');

class Producto extends Model{}

Producto.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_producto: {
        type: DataTypes.STRING,
        allowNull: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    imagen: {
        type: DataTypes.STRING,
        allowNull: true
    },
    precioNormal: {
      type: DataTypes.STRING,
      allowNull: true
    },  
    precioOferta: {
      type: DataTypes.STRING,
      allowNull: true
    },
    categoriaSuper1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    categoriaSuper2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    categoriaSuper3: {
      type: DataTypes.STRING,
      allowNull: true
    },
    marca: {
      type: DataTypes.STRING,
      allowNull: true
    },    
    supermercado: {
      type: DataTypes.STRING,
      allowNull: false
    },
}, {
    freezeTableName: true,
    sequelize,
    modelName: "producto",
});

module.exports = Producto;

// const { Sequelize, DataTypes, Model } = require('sequelize');
// const { sequelize } = require('../config');

// class Producto extends Model{}

// Producto.init({
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     nombre: {
//         type: DataTypes.STRING,
//         allowNull: false
//       },
//     precioNormal: {
//       type: DataTypes.NUMBER,
//       allowNull: false
//     },   
//     precioOferta: {
//       type: DataTypes.NUMBER,
//       allowNull: false
//     },   
//     marca: {
//       type: DataTypes.STRING,
//       allowNull: false
//     },
//     imagen: {
//         type: DataTypes.STRING,
//         allowNull: true
//     },
//     tieneOferta: {
//         type: DataTypes.NUMBER,
//         allowNull: true
//     },
//     fecha_registro: {
//       type: DataTypes.STRING,
//       allowNull: true
//     },
//     termino: {
//       type: DataTypes.STRING,
//       allowNull: true
//     },  
//     busqueda_id: {
//       type: DataTypes.STRING,
//       allowNull: true
//     },
//     lista_compra_id: {
//       type: DataTypes.STRING,
//       allowNull: true
//     },
// }, {
//     freezeTableName: true,
//     sequelize,
//     timestamps: false,
//     modelName: "productos_supermercado",
// });

// module.exports = Producto;