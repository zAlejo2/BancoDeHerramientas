import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../db/connection.js'; 
import Elemento from './elementoModel.js';
import Prestamo from './prestamoModel.js';

class ElementoHasPrestamo extends Model{}

ElementoHasPrestamo.init({
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
  prestamos_idprestamo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
          model: Prestamo,
          key: 'idprestamo'
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
  },
  estado: {
      type: DataTypes.ENUM('actual', 'finalizado'),
      allowNull: false
  }
}, {
  sequelize,
  modelName: 'ElementoHasPrestamo',
  tableName: 'elementos_has_prestamos',
  timestamps: false
});

export default ElementoHasPrestamo;
