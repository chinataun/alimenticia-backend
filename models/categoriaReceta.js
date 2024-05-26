const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config');

class CategoriaReceta extends Model{}

CategoriaReceta.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    }
}, {
    freezeTableName: true,
    sequelize,
    timestamps: false,
    modelName: "categoria_receta",
});


module.exports = CategoriaReceta;