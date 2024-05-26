import { Sequelize } from "sequelize";


const sequelize = new Sequelize('alimenticia', 'root', 'secret', {
    host: 'localhost',
    port: 3307,
    dialect: 'mysql',   
});

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
 }).catch((error) => {
    console.error('Unableasda to connect to the database: ', error);
 });

export default sequelize;