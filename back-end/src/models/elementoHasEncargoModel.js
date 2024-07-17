import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../db/connection.js';
import Elemento from './elementoModel.js';
import Encargo from './encargoModel.js';

class ElementoHasEncargo extends Model{}

ElementoHasEncargo.init({
  elementos_idelemento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
        model: Elemento,
        key: 'idelemento'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
  },
  encargos_idencargo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
          model: Encargo,
          key: 'idencargo'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
  },
  cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
  },
  observaciones: {
      type: DataTypes.STRING(45),
      allowNull: true
  },
  fechaPedido: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  fechaReclamo: {
      type: DataTypes.DATE,
      allowNull: false
  },
  estado: {
      type: DataTypes.ENUM('pendiente', 'reclamado', 'finalizado', 'cancelado'),
      allowNull: false
  }
}, {
  sequelize,
  modelName: 'ElementoHasEncargo',
  tableName: 'elementos_has_encargos',
  timestamps: false
});

export default ElementoHasEncargo;
