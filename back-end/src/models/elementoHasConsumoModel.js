import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js'; 

const ElementoHasConsumo = sequelize.define('ElementoHasConsumo', {
  elementos_idelemento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  consumos_idconsumo: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  }
}, {
  tableName: 'elementos_has_consumos',
  timestamps: false
});

// Definición de las relaciones
ElementoHasConsumo.associate = (models) => {
  ElementoHasConsumo.belongsTo(models.Elemento, {
    foreignKey: 'elementos_idelemento',
    onDelete: 'CASCADE',
  });
  ElementoHasConsumo.belongsTo(models.Consumo, {
    foreignKey: 'consumos_idconsumo',
    onDelete: 'CASCADE',
  });
};

export default ElementoHasConsumo;
