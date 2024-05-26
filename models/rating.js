const { Sequelize, DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config');

class Rating extends Model{}

Rating.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    rating: {  // Array de objetos 
      type: DataTypes.INTEGER,
      allowNull: false
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: true
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
    },
}, {
    freezeTableName: true,
    sequelize,
    modelName: "rating",
});

module.exports = Rating;