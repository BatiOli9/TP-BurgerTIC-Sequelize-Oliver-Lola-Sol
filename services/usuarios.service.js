import { Usuario } from "../models/usuarios.model.js"

const getUsuarioByEmail = async (email) => {
    await Usuario.findOne({
        where: {
            email: email,
        },
    });
};


const getUsuarioById = async (id) => {
    await Usuario.findAll({
        where: {
            id: id,
        },
    });
};

const createUsuario = async (usuario) => {
    Usuario.create({
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        password: usuario.password,
        admin:false
    });
};

export default { getUsuarioByEmail, getUsuarioById, createUsuario };
