import { Sequelize } from 'sequelize';
import config from '../config/config.js';

const sequelize = new Sequelize(

  config.mysql.database,
  config.mysql.user,
  config.mysql.password,

  {
    host: config.mysql.host,
    dialect: 'mysql',
    timezone: '-05:00', //para que la hora de los registros en la bd que se guarde sea la de Colombia
    logging: false // esto se puede habilitar para ver las consultas SQL generadas por Sequelize
  }
);

export default sequelize;

