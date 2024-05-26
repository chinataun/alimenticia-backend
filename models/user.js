const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config');
// import sequelize from '../db/connection';

class User extends Model{}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: true
    },
    apellidos: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: true
    },
    apodo: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    cp: {
        type: DataTypes.INTEGER,
        unique: false,
        allowNull: true
    },
    imagen: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    supermercado: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    freezeTableName: true,
    sequelize,
    modelName: "users",
});



module.exports = User;
// `sequelize.define` also returns the model
console.log(User == sequelize.models.User); // true