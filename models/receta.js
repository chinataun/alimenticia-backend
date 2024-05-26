const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config');
// import sequelize from '../db/connection';
const User = require('./user');
class Receta extends Model{}

Receta.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    supermercado: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: true
    },
    imagen: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: true
    },
    comensales: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tiempo: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: true
    },
    dificultad: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ingredientes: {  // Array de objetos 
        type: DataTypes.JSON,
        allowNull: true
    },
    pasos: {  // Array de objetos
        type: DataTypes.JSON,
        allowNull: true
    },
    precio: {
        type: DataTypes.STRING,
        allowNull: true
    },
    rating: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
}, {
    freezeTableName: true,
    sequelize,
    modelName: "recetas",
});

module.exports = Receta;