"use strict";
const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('10446497_alimenticia', 'alimenticia', 'j7T3&ik90', {
//   host: 'PMYSQL175.dns-servicio.com',
//   port: 3306,
//   dialect: 'mysql',   
// });


// sequelize.authenticate().then(() => {
//   console.log('Connection has been established successfully.');
// }).catch((error) => {
//   console.error('Unableasda to connect to the database: ', error);
// });

const { NODE_ENV } = process.env

let sequelize;
if (NODE_ENV === 'development') {
  sequelize = new Sequelize('alimenticia', 'root', 'secret', {
    host: 'localhost',
    port: 3307,
    dialect: 'mysql',   
  });
} else {
  sequelize = new Sequelize('heroku_89dafaa0be8bd74', 'b14e3d42c4a909', 'c1c1984d', {
    host: 'eu-cluster-west-01.k8s.cleardb.net',
    dialect: 'mysql',   
  });
}


module.exports = {
  sequelize,
};
