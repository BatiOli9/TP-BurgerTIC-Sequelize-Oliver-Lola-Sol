import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db.js";
import { Usuario } from "./usuarios.model.js";

export class Pedido extends Model {}

Pedido.init(
   {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    id_usuario: {
        type: DataTypes.INTEGER, // Assuming id_usuario is a string
            references: {
                model: Usuario, // Reference to the Usuario model
                key: 'id', // Key in the Usuario model
            },
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