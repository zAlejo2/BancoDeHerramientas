import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection.js';
import Usuario from './usuarioModel.js';

class Encargo extends Model {}

Encargo.init({
    idencargo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    correo: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    numero: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    usuarios_documento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Usuario,
          key: 'documento',
          allowNull: false
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }
}, {
    sequelize,
    modelName: 'Encargo',
    tableName: 'encargos',
    timestamps: false
});

export default Encargo; 