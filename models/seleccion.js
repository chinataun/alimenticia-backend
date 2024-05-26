const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config');

class Seleccion extends Model{}

Seleccion.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    seleccion: {
      type: DataTypes.STRING,
      allowNull: false
    }
}, {
    freezeTableName: true,
    sequelize,
    timestamps: false,
    modelName: "seleccion",
});


module.exports = Seleccion;