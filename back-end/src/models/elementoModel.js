import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection.js';

class Elemento extends Model {}

Elemento.init({
  idelemento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  disponibles: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  ubicacion: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  tipo: {
    type: DataTypes.ENUM('prestamo', 'consumo'),
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('disponible', 'agotado'),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Elemento',
  tableName: 'elementos',
  timestamps: false
});

export default Elemento;
