import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const ElementoHasPrestamo = sequelize.define('ElementoHasPrestamo', {
  elementos_idelemento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  prestamos_idprestamo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  }
}, {
  tableName: 'elementos_has_prestamos',
  timestamps: false
});

// Definición de las relaciones
ElementoHasPrestamo.associate = (models) => {
  ElementoHasPrestamo.belongsTo(models.Elemento, {
    foreignKey: 'elementos_idelemento',
    onDelete: 'CASCADE',
  });
  ElementoHasPrestamo.belongsTo(models.Prestamo, {
    foreignKey: 'prestamos_idprestamo',
    onDelete: 'CASCADE',
  });
};

export default ElementoHasPrestamo;
