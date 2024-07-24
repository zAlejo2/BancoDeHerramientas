import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection.js'; // Importa la instancia de Sequelize
import Area from './areaModel.js';

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
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  tipo: {
    type: DataTypes.ENUM('admin', 'contratista', 'practicante'),
    allowNull: false
  },
  areas_idarea: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Area,
      key: 'idarea',
      allowNull: false
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
}
}, {
  sequelize,         // Instancia de Sequelize
  modelName: 'Administrador',
  tableName: 'administradores',
  timestamps: false
});

export default Administrador;

