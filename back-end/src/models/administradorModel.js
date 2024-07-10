import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection.js'; // Importa la instancia de Sequelize

class Administrador extends Model {}

// Expresión regular para validar la contraseña
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

// Definición del modelo
Administrador.init({
  documento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  contrasena: {
    type: DataTypes.STRING(45),
    allowNull: false,
    validate: {
      // Validaciones personalizadas
      is: {
        args: passwordRegex,
        msg: 'Mínimo 6 caracteres, mínimo un número, una letra y un caracter especial '
      }
    }
  }
}, {
  sequelize,         // Instancia de Sequelize
  modelName: 'Administrador',
  tableName: 'administrador',
  timestamps: false  // La tabla no tiene campos de timestamps
});

export default Administrador;

