import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection.js';
import Rol from './rolModel.js';

class Usuario extends Model {}

// Expresión regular para validar la contraseña
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

Usuario.init ({
    documento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false 
    },
    nombreCompleto: {
        type: DataTypes.STRING(45),
        allowNull: false 
    },
    correo: {
        type: DataTypes.STRING(45),
        allowNull: false 
    },
    contrasena: {
        type: DataTypes.STRING(45),
        allowNull: true,
        validate: {
        // Validaciones personalizadas
        is: {
            args: passwordRegex,
            msg: 'Mínimo 6 caracteres, mínimo un número, una letra y un caracter especial '
        }
        }
    },
    fechaInicio: {
        type: DataTypes.DATE,
        allowNull: false 
    },
    fechaFin: {
        type: DataTypes.DATE,
        allowNull: false 
    },
    observaciones: {
        type: DataTypes.STRING(45),
        allowNull: true 
    },
    roles_idrol: {
        type: DataTypes.INTEGER,
        references: {
          model: Rol,
          key: 'idrol',
          allowNull: false
        } 
    }
},  {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    timestamps: false
});

export default Usuario;