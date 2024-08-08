import { DataTypes, Model } from "sequelize";
import sequelize from '../db/connection.js';
import Elemento from "./elementoModel.js";

class Baja extends Model {}

Baja.init ({
    idbaja: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    elementos_idelemento: {
        type: DataTypes.STRING(15),
        allowNull: false,
        references: {  
          model: Elemento,
          key: 'idelemento'
        },
        onUpdate: 'SET NULL',
        onDelete: 'SET NULL'
    }, 
    tipo: {
        type: DataTypes.ENUM('dano', 'traspaso'),
        allowNull: false
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false 
    },
    archivo: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    observaciones: {
        type: DataTypes.STRING(300),
        allowNull: true
    }
},  {
    sequelize,
    modelName: 'Baja',
    tableName: 'bajas',
    timestamps: false
});

export default Baja;