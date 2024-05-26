const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config');

class Temporada extends Model{}

Temporada.init({
  temporada: {
    type: DataTypes.STRING,
    allowNull: false
  },
  entrando: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
    freezeTableName: true,
    sequelize,
    timestamps: false,
    modelName: "temporada",
});


module.exports = Temporada;