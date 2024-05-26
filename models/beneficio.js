const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config');

class Beneficio extends Model {}

Beneficio.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    beneficio: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    modelName: 'beneficio',
  }
);

module.exports = Beneficio;