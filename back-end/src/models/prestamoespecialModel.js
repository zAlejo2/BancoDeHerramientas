import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection.js';
import Cliente from './clienteModel.js';

class PrestamoEspecial extends Model {}

PrestamoEspecial.init({
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
    fecha_inicio: {
        type: DataTypes.DATE,
        allowNull: false
    },
    fecha_fin: {
        type: DataTypes.DATE,
        allowNull: false
    },
    documento: {
        type: DataTypes.STRING(100),
        allowNull: true
    }
},  {
    sequelize,
    modelName: 'PrestamoEspecial',
    tableName: 'prestamosespeciales',
    timestamps: false 
});

export default PrestamoEspecial;