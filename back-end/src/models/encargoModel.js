import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection.js';

class Encargo extends Model {}

// Definición del modelo

Encargo.init({
    idencargo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    }, 
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false 
    },
    observaciones: {
        type: DataTypes.STRING(45),
        allowNull: true
    }, 
    fechaPedido: {
        type: DataTypes.DATE,
        allowNull: false 
    },
    fechaReclamo: {
        type: DataTypes.DATE,
        allowNull: false 
    },
    correo: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    numero: {
        type: DataTypes.STRING(45),
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Encargo',
    tableName: 'encargos',
    timestamps: false
});

export default Encargo; 