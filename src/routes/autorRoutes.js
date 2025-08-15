import { Router } from "express"
import { atualizarAutor, buscarAutorPorId, cadastrarAutor, listarTodosAutores } from "../controllers/autorControllers.js"

const router = Router()

router.post('/', cadastrarAutor)
router.get('/', listarTodosAutores)
router.get('/:id', buscarAutorPorId)
router.put('/:id', atualizarAutor)

export default router