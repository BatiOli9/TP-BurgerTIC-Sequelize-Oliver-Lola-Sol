import { Usuario } from "../models/usuarios.model.js"

const getUsuarioByEmail = async (email) => {
    const usuario = await Usuario.findOne({
        where: {
            email: email
        }
    });
    return usuario;
};


const getUsuarioById = async (id) => {
    await Usuario.findAll({
        where: {
            id: id,
        },
    });
};

const createUsuario = async (usuario) => {
    try {
        await Usuario.create({
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            password: usuario.password,
            admin: false
        });
    } catch (error) {
        throw new Error("Error al crear el usuario: " + error.message);
    }
};

export default { getUsuarioByEmail, getUsuarioById, createUsuario };
