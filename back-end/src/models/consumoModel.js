import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection.js';
import Usuario from './usuarioModel.js';

class Consumo extends Model {}

Consumo.init({
    idconsumo: {
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
    modelName: 'Consumo',
    tableName: 'consumos',
    timestamps: false 
});

export default Consumo;