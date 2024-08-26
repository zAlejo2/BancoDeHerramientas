import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection.js';
import Cliente from './clienteModel.js';

class PrestamoCorriente extends Model {}

PrestamoCorriente.init({
    idprestamo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    clientes_documento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Cliente,
          key: 'documento',
          allowNull: false
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    estado: {
        type: DataTypes.ENUM('actual', 'finalizado'),
        allowNull: false
    }
},  {
    sequelize,
    modelName: 'PrestamoCorriente',
    tableName: 'prestamoscorrientes',
    timestamps: false 
});

export default PrestamoCorriente;