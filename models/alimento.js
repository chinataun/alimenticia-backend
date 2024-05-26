const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config');

class Alimento extends Model{}

Alimento.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    imagen: {
      type: DataTypes.STRING,
      allowNull: true
    },
    imagen_banner: {
      type: DataTypes.STRING,
      allowNull: true
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    calorias: {
      type: DataTypes.STRING,
      allowNull: true
    },  
    grasas: {
      type: DataTypes.STRING,
      allowNull: true
    },
    carbohidratos: {
      type: DataTypes.STRING,
      allowNull: true
    },
    proteinas: {
      type: DataTypes.STRING,
      allowNull: true
    },
}, {
    freezeTableName: true,
    sequelize,
    timestamps: false,
    modelName: "alimento",
});

module.exports = Alimento;