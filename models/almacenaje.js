const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config');

class Almacenaje extends Model {}

Almacenaje.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    metodo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    duracion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    modelName: 'almacenaje',
  }
);

module.exports = Almacenaje;