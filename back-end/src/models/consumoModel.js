import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/connection.js';
import Usuario from './usuarioModel.js';

class Consumo extends Model {}

Consumo.init({
    idconsumo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true 
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
    modelName: 'Consumo',
    tableName: 'consumos',
    timestamps: false 
});

export default Consumo;