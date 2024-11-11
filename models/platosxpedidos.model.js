import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db.js";

export class PlatoxPedido extends Model {}

PlatoxPedido.init(
   {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_pedido: {
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