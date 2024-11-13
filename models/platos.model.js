import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db.js";

export class Plato extends Model {}

Plato.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        tipo: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [["principal", "combo", "postre"]],
            }
        },
        nombre: {
            type: DataTypes.STRING,
        },
        precio: {
            type: DataTypes.FLOAT,
        },
        descripcion: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        modelName: "platos",
        timestamps: false,
    }
);
