import { config } from "../db.js";
import { Pedido } from "../models/pedidos.model.js";
import { Plato } from "../models/platos.model.js"
import { PlatoxPedido } from "../models/platosxpedidos.model.js";
import pkg from "pg";
const { Client } = pkg;

const getPlatosByPedido = async (id) => {
    try {
        const platosxPedido = await PlatoxPedido.findAll({
            where: {
                id_pedido: id,
            },
        });

        if (platosxPedido.length < 1) throw new Error("Pedido no encontrado");

        const result = await Promise.all(
            platosxPedido.map(async (platoPedido) => {
                const plato = await Plato.findByPk(platoPedido.id_plato);

                if (!plato) throw new Error("Plato no encontrado");

                return {
                    ...plato.toJSON(),
                    cantidad: platoPedido.cantidad,
                };
            })
        );

        return result;
    } catch (error) {
        throw error;
    }
};

const getPedidos = async () => {
    await Pedido.findAll();
};

const getPedidoById = async (id) => {
    await Pedido.findAll({
        where: {
            id: id,
        },
    });

};

const getPedidosByUser = async (idUsuario) => {
    await Pedido.findAll({
        where: {
            id_usuario: idUsuario,
        },
    });
};

const createPedido = async (idUsuario, platos) => {
    const client = new Client(config);
    await client.connect();

    try {
        for (let plato of platos) {
            const platoExistente = await Plato.findOne({
                where: { id: plato.id },
            });

            if (!platoExistente) {
                throw new Error(`Plato con id ${plato.id} no encontrado`);
            }
        }

        const nuevoPedido = await Pedido.create({
            id_usuario: idUsuario,
            fecha: new Date(),
            estado: 'pendiente',
        });

        const idPedido = nuevoPedido.id;

        for (let plato of platos) {
            await PedidoPlato.create({
                id_pedido: idPedido,
                id_plato: plato.id,
                cantidad: plato.cantidad,
            });
        }

        return nuevoPedido;
    } catch (error) {
        // Manejo de errores
        console.error("Error al crear el pedido:", error.message);
        throw error;
    }
};

const updatePedido = async (id, estado) => {
    if (
        estado !== "aceptado" &&
        estado !== "en camino" &&
        estado !== "entregado"
    )
        throw new Error("Estado inválido");

    try {
        const pedido = await Pedido.findByPk(id);

        if (!pedido) throw new Error("Pedido no encontrado");

        pedido.estado = estado;
        await pedido.save();

        return pedido;
    } catch (error) {
        throw error;
    }
};

const deletePedido = async (id) => {
    try {
        const pedido = await Pedido.findByPk(id);

        if (!pedido) throw new Error("Pedido no encontrado");

        await pedido.destroy();
        return { message: "Pedido eliminado con éxito" };
    } catch (error) {
        throw new Error(error.message);
    }
};

export default {
    getPedidos,
    getPedidoById,
    getPedidosByUser,
    createPedido,
    updatePedido,
    deletePedido,
    getPlatosByPedido
};
