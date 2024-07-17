import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../db/connection.js';
import Elemento from './elementoModel.js';
import Usuario from './usuarioModel.js';

class Dano extends Model{} 

Dano.init({
    iddano: {
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
    elementos_idelemento: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {  
          model: Elemento,
          key: 'idelemento'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    modelName: 'Dano',
    tableName: 'danos',
    timestamps: false
})

export default Dano;