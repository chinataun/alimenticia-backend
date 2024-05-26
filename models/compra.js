const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config');

class Compra extends Model{}

Compra.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    carrito: {  // Array de objetos 
      type: DataTypes.JSON,
      allowNull: true
    },
}, {
    freezeTableName: true,
    sequelize,
    modelName: "compra",
});

module.exports = Compra;