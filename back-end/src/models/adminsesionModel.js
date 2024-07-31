import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../db/connection.js'; // Importa la instancia de Sequelize
import Administrador from './administradorModel.js';

class AdminSesion extends Model {}

AdminSesion.init({
  idsesion: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  login: {
    type: DataTypes.DATE,
    // defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  logout: {
    type: DataTypes.DATE,
    allowNull: true
  },
  administradores_documento: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: Administrador,
        key: 'documento'
    },  
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  }
}, {
  sequelize,    
  modelName: 'AdminSesion',
  tableName: 'adminsesion',
  timestamps: false
});

export default AdminSesion;

// REOCORDAR tener en cuenta qué hacer si se borra algún registro de alguna tabla
// con las llaves foráneas:     onDelete: 'CASCADE'    preguntar a jorge