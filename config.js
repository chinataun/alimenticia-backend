"use strict";


const { Sequelize } = require('sequelize');


/*
console.log(process.env.MYSQLDB_HOST)
console.log(process.env.MYSQLDB_USER)
console.log(process.env.MYSQLDB_PASSWORD)
console.log(process.env.MYSQLDB_DATABASE)
console.log(process.env.MYSQLDB_DOCKER_PORT)
*/
// Configuración del acceso a la BD
// const db = mysql.createConnection({
//   host: 'localhost',  // Ordenador que ejecuta el SGBD
//   user: 'root',       // Usuario que accede a la BD
//   password: "secret",       // Contraseña con la que se accede a la BD
//   database: 'alimenticia',
//   port: 3307,  // Nombre de la base de datos
//   Promise: global.Promise // Habilita el uso de Promesas
// });
// db.connect((err) => {
//   if (err) {
//     console.log(process.env.MYSQLDB_DOCKER_PORT)
//     console.error("Error al conectar a la base de datos:", err);
//   } else {
//     console.log("Conexión exitosa a la base de datos.");
//   }
// });

// mysql://b14e3d42c4a909:c1c1984d@eu-cluster-west-01.k8s.cleardb.net/heroku_89dafaa0be8bd74?reconnect=true
const sequelize = new Sequelize('heroku_89dafaa0be8bd74', 'b14e3d42c4a909', 'c1c1984d', {
  host: 'eu-cluster-west-01.k8s.cleardb.net',
  dialect: 'mysql',   
});
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

module.exports = {
  sequelize,
};
