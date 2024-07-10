import { Sequelize } from 'sequelize';
import { config } from '../config/config.js';

const sequelize = new Sequelize(
  config.mysql.database,
  config.mysql.user,
  config.mysql.password,
  {
    host: config.mysql.host,
    dialect: 'mysql',
    logging: false // esto se puede habilitar para ver las consultas SQL generadas por Sequelize
  }
);

// Verificar la conexión a la base de datos
async function checkConnection() {
  try {
    await sequelize.authenticate();
    console.log('Conexión establecida correctamente con la base de datos.');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
}

checkConnection();

export default sequelize;

