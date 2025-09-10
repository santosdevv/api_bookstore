import { Router } from "express";
import {
  atualizarAutor,
  buscarAutorPorId,
  cadastrarAutor,
  deletarAutor,
  listarTodosAutores,
} from "../controllers/autorController.js";

const router = Router();

router.post("/", cadastrarAutor);
router.get("/", listarTodosAutores);
router.get("/:id", buscarAutorPorId);
router.put("/:id", atualizarAutor);
router.delete("/:id", deletarAutor);

export default router;
