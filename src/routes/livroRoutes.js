import { Router } from "express";
import { buscarLivro, cadastrarLivro, listarTodosLivros } from "../controllers/livroControllers.js";
import { deletarAutor } from "../controllers/autorControllers.js";

const router = Router()

router.post("/", cadastrarLivro)
router.get("/", listarTodosLivros)
router.get("/:id", buscarLivro)
router.delete("/:id", deletarAutor)

export default router