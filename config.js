"use strict";

const mysql = require('mysql2');

const { Sequelize } = require('sequelize');


/*
console.log(process.env.MYSQLDB_HOST)
console.log(process.env.MYSQLDB_USER)
console.log(process.env.MYSQLDB_PASSWORD)
console.log(process.env.MYSQLDB_DATABASE)
console.log(process.env.MYSQLDB_DOCKER_PORT)
*/
// Configuración del acceso a la BD
const db = mysql.createConnection({
  host: 'localhost',  // Ordenador que ejecuta el SGBD
  user: 'root',       // Usuario que accede a la BD
  password: "secret",       // Contraseña con la que se accede a la BD
  database: 'alimenticia',
  port: 3307,  // Nombre de la base de datos
  Promise: global.Promise // Habilita el uso de Promesas
});
db.connect((err) => {
  if (err) {
    console.log(process.env.MYSQLDB_DOCKER_PORT)
    console.error("Error al conectar a la base de datos:", err);
  } else {
    console.log("Conexión exitosa a la base de datos.");
  }
});


const sequelize = new Sequelize('alimenticia', 'root', 'secret', {
  host: 'localhost',
  port: 3307,
  dialect: 'mysql',   
});



// sequelize.authenticate().then(() => {
//   console.log('Connection has been established successfully.');
// }).catch((error) => {
//   console.error('Unableasda to connect to the database: ', error);
// });

module.exports = {
  sequelize,
  db,   // Exporta la conexión a la base de datos
  port: 3000  // Puerto en el que escucha el servidor
};
