import Router from "express";
import PedidosController from "../controllers/pedidos.controller.js";
import { verifyAdmin, verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", verifyAdmin, PedidosController.getPedidos);
router.get("/usuario", verifyToken, PedidosController.getPedidosByUser);
router.get("/:id", verifyAdmin, PedidosController.getPedidoById);
router.post("/", verifyToken, PedidosController.createPedido);
router.put("/:id/aceptar", verifyAdmin, verifyToken, PedidosController.aceptarPedido);
router.put("/:id/comenzar", verifyAdmin, verifyToken, PedidosController.comenzarPedido);
router.put("/:id/entregar", verifyAdmin, verifyToken, PedidosController.entregarPedido);
router.delete("/:id", verifyAdmin, verifyToken, PedidosController.deletePedido);

export default router;