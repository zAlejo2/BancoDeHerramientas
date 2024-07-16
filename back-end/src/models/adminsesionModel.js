import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection.js'; // Importa la instancia de Sequelize
import Administrador from './administradorModel.js';

class AdminSesion extends Model {}

AdminSesion.init({
  idsesion: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  login: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
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
    onDelete: 'CASCADE'
  }
}, {
  sequelize,    
  modelName: 'AdminSesion',
  tableName: 'adminsesion',
  timestamps: false
});

export default AdminSesion;