import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../db/connection.js'; 
import Elemento from './elementoModel.js';
import Consumo from './consumoModel.js';

class ElementoHasConsumo extends Model{} 

ElementoHasConsumo.init({
  elementos_idelemento: {
      type: DataTypes.STRING(15),
      primaryKey: true,
      references: {
          model: Elemento,
          key: 'idelemento'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
  },
  consumos_idconsumo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
          model: Consumo,
          key: 'idconsumo'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
  },
  cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
  },
  fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
  },
  observaciones: {
      type: DataTypes.STRING(45),
      allowNull: true
  }
}, {
    sequelize,
    modelName: 'ElementoHasConsumo',
    tableName: 'elementos_has_consumos',
    timestamps: false
});

export default ElementoHasConsumo;
