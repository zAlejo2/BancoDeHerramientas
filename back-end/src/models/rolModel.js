import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection.js';

class Rol extends Model {}

// Definición del modelo
Rol.init({
  idrol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING(45),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Role',
  tableName: 'roles',
  timestamps: false
});

export default Rol;

// Ahora `Role` es un modelo Sequelize que se puede utilizar para interactuar con la tabla `roles`
