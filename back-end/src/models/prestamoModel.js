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
},  {
    sequelize,
    modelName: 'Prestamo',
    tableName: 'prestamos',
    timestamps: false 
});

export default Prestamo;