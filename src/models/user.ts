import { DataTypes } from 'sequelize';
import sequelize from '../db/connection';

export const User = sequelize.define('user', {
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
    imagen: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, )