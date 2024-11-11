import { config } from "../db.js";
import { Pedido } from "../models/pedidos.model.js";
import { Plato } from "../models/platos.model.js"
import pkg from "pg";
const { Client } = pkg;

const getPlatosByPedido = async (id) => {
    await Plato.findAll({
        where: {

        }
    })
};

const getPedidos = async () => {
    const client = new Client(config);
    await client.connect();

    try {
        const { rows } = await client.query("SELECT * FROM pedidos");

        if (rows.length < 1) return [];

        const result = await Promise.all(
            rows.map(async (pedido) => {
                const platos = await getPlatosByPedido(pedido.id);
                return {
                    ...pedido,
                    platos,
                };
            })
        );

        await client.end();
        return result;
    } catch (error) {
        await client.end();
        throw error;
    }
};

const getPedidoById = async (id) => {
    await Pedido.findAll({
        where: {
            id: id,
        },
    });

};

const getPedidosByUser = async (idUsuario) => {
    const client = new Client(config);
    await client.connect();

    try {
        const { rows } = await client.query(
            "SELECT * FROM pedidos WHERE id_usuario = $1",
            [idUsuario]
        );

        if (rows.length < 1) return [];

        const result = await Promise.all(
            rows.map(async (pedido) => {
                const platos = await getPlatosByPedido(pedido.id);
                return {
                    ...pedido,
                    platos,
                };
            })
        );

        await client.end();
        return result;
    } catch (error) {
        await client.end();
        throw error;
    }
};

const createPedido = async (idUsuario, platos) => {
    const client = new Client(config);
    await client.connect();

    try {
        // ACÁ SE PODRÍA HACER EN ETAPAS
        // 1. Validar que los platos existan
        // 2. Crear el pedido
        // 3. Agregar los platos al pedido

        // Así, no hace falta introducir el concepto de transacciones o rollback

        const { rows } = await client.query(
            "INSERT INTO pedidos (id_usuario, fecha, estado) VALUES ($1, $2, 'pendiente') RETURNING id",
            [idUsuario, new Date()]
        );

        const idPedido = rows[0].id;

        for (let plato of platos) {
            const { rows } = await client.query(
                "SELECT * FROM platos WHERE id = $1",
                [plato.id]
            );

            if (rows.length < 1) {
                await client.query("DELETE FROM pedidos WHERE id = $1", [
                    idPedido,
                ]);
                await client.query(
                    "DELETE FROM pedidos_platos WHERE id_pedido = $1",
                    [idPedido]
                );
                throw new Error("Plato no encontrado");
            }

            await client.query(
                "INSERT INTO pedidos_platos (id_pedido, id_plato, cantidad) VALUES ($1, $2, $3)",
                [idPedido, plato.id, plato.cantidad]
            );
        }

        await client.end();
        return rows;
    } catch (error) {
        await client.end();
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

    const client = new Client(config);
    await client.connect();

    try {
        const { rows } = await client.query(
            "UPDATE pedidos SET estado = $1 WHERE id = $2",
            [estado, id]
        );

        await client.end();
        return rows;
    } catch (error) {
        await client.end();
        throw error;
    }
};

const deletePedido = async (id) => {
    const pedido = await Pedido.findByPk(id);

    if (!pedido) throw new Error("Pedido no encontrado");

    await pedido.destroy();
};

export default {
    getPedidos,
    getPedidoById,
    getPedidosByUser,
    createPedido,
    updatePedido,
    deletePedido,
};
