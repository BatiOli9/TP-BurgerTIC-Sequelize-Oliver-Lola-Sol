import { Pedido } from "../models/pedidos.model.js";
import { Plato } from "../models/platos.model.js"
import { PlatoxPedido } from "../models/platosxpedidos.model.js";

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
    const result = await Pedido.findAll();
    return result;
};

const getPedidoById = async (id) => {
    const result = await Pedido.findOne({
        where: {
            id: id,
        },
    });
    return result;
};

const getPedidosByUser = async (idUsuario) => {
    const result = await Pedido.findAll({
        where: {
            id_usuario: idUsuario,
        },
    });
    return result;
};

const createPedido = async (idUsuario, platos) => {
    try {
        const nuevoPedido = await Pedido.create({
            id_usuario: idUsuario,
            fecha: new Date(),
            estado: 'pendiente',
        });

        const idPedido = nuevoPedido.id;

        for (let plato of platos) {
            const platoExistente = await Plato.findOne({
                where: { nombre: plato.nombre },
            });

            if (!platoExistente) {
                throw new Error(`Plato con nombre ${plato.nombre} no encontrado`);
            }

            await PlatoxPedido.create({
                id_pedido: idPedido,
                id_plato: platoExistente.id,
                cantidad: plato.cantidad,
            });
        }

        return nuevoPedido;
    } catch (error) {
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
