import { autorModel, livroModel } from "../models/association.js";

import path from "node:path";
import { fileURLToPath } from "node:url";
import {existsSync, unlinkSync} from "node:fs"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const cadastrarLivro = async (request, response) => {
  const {
    titulo,
    isbn,
    descricao,
    ano_publicacao,
    genero,
    quantidade_total,
    quantidade_disponivel,
    autores,
  } = request.body;

  if (!titulo) {
    response.status(400).json({ mensagem: "O campo titulo não ser nulo" });
    return;
  }

  if (!isbn) {
    response.status(400).json({ mensagem: "O campo isbn não ser nulo" });
    return;
  }
  if (!descricao) {
    response.status(400).json({ mensagem: "O campo descricao não ser nulo" });
    return;
  }
  if (!ano_publicacao) {
    response
      .status(400)
      .json({ mensagem: "O campo ano_publicacao não ser nulo" });
    return;
  }
  if (!genero) {
    response.status(400).json({ mensagem: "O campo genero não ser nulo" });
    return;
  }
  if (!quantidade_total) {
    response
      .status(400)
      .json({ mensagem: "O campo quantidade_total não ser nulo" });
    return;
  }
  if (!quantidade_disponivel) {
    response
      .status(400)
      .json({ mensagem: "O campo quantidade_disponivel não ser nulo" });
    return;
  }

  if (!Array.isArray(autores) || autores.length === 0) {
    response.status(400).json({
      mensagem: "O campo autores dever ser array e possui pelo menos um autor",
    });
    return;
  }

  try {
    const autoresEncontrados = await autorModel.findAll({
      where: {
        id: autores,
      },
    });
    console.log("Retorno do banco: ", autoresEncontrados.length);
    console.log("Quantida do request: ", autores.length);

    if (autoresEncontrados.length !== autores.length) {
      response.status(404).json({
        mensagem: "Um ou mais IDs de autores são inválidos ou não existe",
      });
      return;
    }

    const livro = await livroModel.create({
      titulo,
      isbn,
      descricao,
      ano_publicacao,
      genero,
      quantidade_total,
      quantidade_disponivel,
    });
    await livro.addAutores(autores);

    const livroComAutor = await livroModel.findByPk(livro.id, {
      attributes: { exclude: ["created_at", "updated_at"] },
      include: {
        model: autorModel,
        attributes: { exclude: ["created_at", "updated_at"] },
        through: { attributes: [] },
      },
    });

    response.status(200).json({ mensagem: "Livro cadastrado", livroComAutor });
  } catch (error) {
    console.log(error);
    response.status(500).json("Erro interno ao cadastrar livro");
  }
};

export const listarTodosLivros = async (request, response) => {
  const page = parseInt(request.query.page) || 1;
  const limit = parseInt(request.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const livro = await livroModel.findAndCountAll({
      include: {
        model: autorModel,
        through: { attributes: [] },
      },
      limit,
      offset,
    });

    const livrosFormatados = livro.rows.map((livro) => {
      return {
        id: livro.id,
        titulo: livro.titulo,
        isbn: livro.isbn,
        descricao: livro.descricao,
        ano_publicacao: livro.ano_publicacao,
        genero: livro.genero,
        quantidade_total: livro.quantidade_total,
        quantidade_disponivel: livro.quantidade_disponivel,
        imagem_capa: livro.imagem_capa,
        imagem_url: livro.imagem_url,
        autores: livro.autores.map((autor) => ({
          id: autor.id,
          nome: autor.nome,
        })),
      };
    });

    // X = 51 / 5 = 11
    const totalDePaginas = Math.ceil(livro.count / limit);
    response.status(200).json({
      totalLivros: livro.count,
      totalPaginas: totalDePaginas,
      paginaAtual: page,
      livrosPorPagina: limit,
      livros: livrosFormatados,
    });
  } catch (error) {}
};

export const buscarLivro = async (request, response) => {
  const { id } = request.params;

  if (!id) {
    response.status(400).json({ mensagem: "Id obrigatório" });
    return;
  }

  try {
    const livro = await livroModel.findByPk(id, {
      attributes: { exclude: ["created_at", "updated_at"] },
      include: {
        model: autorModel,
        through: { attributes: [] },
        attributes: { exclude: ["created_at", "updated_at"] },
      },
    });

    if (!livro) {
      response.status(404).json({ mensagem: "Livro não encontrado" });
      return;
    }

    response.status(200).json(livro);
  } catch (error) {}
};

//GET    /api/livros?autor=:id  - Filtrar livros por autor
//PUT    /api/livros/:id        - Atualizar livro
//=DELETE /api/livros/:id        - Deletar livro

export const cadastrarCapaLivro = async (request, response) => {
  const { id } = request.params;
  const { filename, path } = request.file;

  if (!id) {
    response.status(400).json({ mensagem: "O id é obrigatório" });
    return;
  }

  try {
    const livro = await livroModel.findByPk(id);

    if (!livro) {
      response.status(404).json({ mensagem: "Livro não existe" });
      return;
    }

    livro.imagem_capa = filename;
    livro.imagem_url = path;

    await livro.save();

    response.status(200).json({ mensagem: "Capa atualizada", livro });
  } catch (error) {
    console.log(error);
    response.status(500).json({ mensagem: "Erro ao cadastrar a capa" });
  }
};

export const buscarImagemCapa = async (request, response) => {
  const { filename } = request.params;

  if (!filename) {
    response.status(400).json({ mensagem: "filename é obrigatório" });
    return;
  }

  try {
    const livro = await livroModel.findOne({
      where: {
        imagem_capa: filename,
      },
    });

    if (!livro) {
      response.status(404).json({ mensagem: "Capa de livro não encontrada" });
      return;
    }

    const caminhoDaImagem = path.join(
      __dirname,
      "../../public/livro/",
      filename
    );

    console.log(caminhoDaImagem);

    response.status(200).sendFile(caminhoDaImagem);
  } catch (error) {
    console.log(error);
    response
      .status(500)
      .json({ mensagem: "Erro interno ao buscar capa de livro" });
  }
};

export const deletarImagemCapa = async (request, response) => {
  const { id } = request.params;

  if(!id){
    response.status(400).json({mensagem:"ID é obrigatório"})
    return
  }

  try {
    const livro = await livroModel.findByPk(id)

    if(!livro){
      response.status(404).json({mensagem:"Livro não encontrado"})
      return
    }

    const encontrarArquivo = path.join(__dirname, '../../public/livro', livro.imagem_capa)

    //Apaguei o arquivo do PC/pasta public
    if(existsSync(encontrarArquivo)){
      unlinkSync(encontrarArquivo)
    }

    //modificar o nome do arquivo no banco de dados
    livro.imagem_capa = 'fileName.png'
    livro.imagem_url = 'caminhoDaImagem'

    await livro.save()

    response.status(200).json({mensagem:"a capa foi removida"})

  } catch (error) {
    
  }

};
