import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection.js';
import Usuario from './usuarioModel.js';

class Prestamo extends Model {}

Prestamo.init({
    idprestamo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false 
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false 
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false 
    },
    observaciones: {
        type: DataTypes.STRING(45),
        allowNull: true 
    },
    estado: {
        type: DataTypes.ENUM('actual', 'finalizado'),
        allowNull: false 
    },
    usuarios_documento: {
        type: DataTypes.INTEGER,
        references: {
          model: Usuario,
          key: 'documento',
          allowNull: false
        } 
    }
},  {
    sequelize,
    modelName: 'Prestamo',
    tableName: 'prestamos',
    timestamps: false 
});

export default Prestamo;