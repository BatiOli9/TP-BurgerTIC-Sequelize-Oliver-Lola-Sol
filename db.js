import "dotenv/config";

export const config = {
    user: "burgertic_owner",
    host: "ep-green-dew-a5oizun4.us-east-2.aws.neon.tech",
    database: "burgertic",
    password: "cW6eZq5PIgun",
    port: 5432,
    ssl: true,
};

import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
    process.env.DB_URL
);

try {

    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
} catch (error) {
    console.error("Unable to connect to the database:", error);
}
