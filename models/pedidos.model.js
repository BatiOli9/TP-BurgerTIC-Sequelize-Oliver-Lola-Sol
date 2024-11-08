import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db.js";

export class Pedido extends Model {}

Pedido.init(
   {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_usuario: {
        type: DataTypes.INTEGER, // si es fk lo aclaro aca?
        references: {
            model: usuarios, 
            key: 'id' 
        }
    },
    fecha: {
        type: DataTypes.DATE,
    },
    estado: {
        type: DataTypes.STRING,
    },
    descripcion: {
        type: DataTypes.STRING,
    },                                                
   },
   {
    sequelize,
        modelName: "pedidos",
        timestamps: false,
   }
);