import { Router } from "express";
import {
  buscarLivro,
  cadastrarLivro,
  listarTodosLivros,
  cadastrarCapaLivro,
  buscarImagemCapa,
  deletarImagemCapa,
} from "../controllers/livroController.js";

import { imageUpload } from "../middleware/imageUpload.js";

const router = Router();

router.post("/", cadastrarLivro);
router.get("/", listarTodosLivros);
router.get("/:id", buscarLivro);

//ROTAS PARAS IMAGENS
router.post("/:id/imagem", imageUpload.single("imagem"), cadastrarCapaLivro);
router.get("/upload/:filename", buscarImagemCapa);
router.delete("/:id/imagem", deletarImagemCapa);

export default router;
