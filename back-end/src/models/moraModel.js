import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../db/connection.js';
import Elemento from './elementoModel.js';
import Usuario from './usuarioModel.js';

class Mora extends Model{} 

Mora.init({
    idmora: {
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
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') 
    },
    observaciones: {
        type: DataTypes.STRING(45),
        allowNull: true 
    },
    tiempoMora: {
        type: DataTypes.TIME,
        allowNull: false 
    },
    elementos_idelemento: {
        type: DataTypes.INTEGER,
        references: {  
          model: Elemento,
          key: 'idelemento',
          allowNull: false
        }, 
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    usuarios_documento: {
        type: DataTypes.INTEGER,
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
    modelName: 'Mora',
    tableName: 'moras',
    timestamps: false
})

export default Mora;