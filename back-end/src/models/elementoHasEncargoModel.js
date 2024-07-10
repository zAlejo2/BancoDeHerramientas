import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const ElementoHasEncargo = sequelize.define('ElementoHasEncargo', {
  elementos_idelemento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  encargos_idencargo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  }
}, {
  tableName: 'elementos_has_encargos',
  timestamps: false
});

// Definición de las relaciones
ElementoHasEncargo.associate = (models) => {
  ElementoHasEncargo.belongsTo(models.Elemento, {
    foreignKey: 'elementos_idelemento',
    onDelete: 'CASCADE',
  });
  ElementoHasEncargo.belongsTo(models.Encargo, {
    foreignKey: 'encargos_idencargo',
    onDelete: 'CASCADE',
  });
};

export default ElementoHasEncargo;
