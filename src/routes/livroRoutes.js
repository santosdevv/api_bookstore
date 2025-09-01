import { Router } from "express";
import { buscarLivro, cadastrarLivro, listarTodosLivros } from "../controllers/livroControllers.js";

const router = Router()

router.post("/", cadastrarLivro)
router.get("/", listarTodosLivros)
router.get("/:id", buscarLivro)

export default router