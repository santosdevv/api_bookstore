import { json } from "sequelize"
import { autorModel, livroModel } from "../models/association.js"

export const cadastrarLivro = async (req, res) => {
    const {
        titulo,
        isbn,
        descricao,
        ano_publicacao,
        genero,
        quantidade_total,
        quantidade_disponivel,
        autores
    } = req.body

    if (!titulo) {
        res.status(400).json({ mensagem: "o campo titulo não pode ser nulo" })
        return
    }
    if (!isbn) {
        res.status(400).json({ mensagem: "o campo isbn não pode ser nulo" })
        return
    }
    if (!descricao) {
        res.status(400).json({ mensagem: "o campo descricao não pode ser nulo" })
        return
    }
    if (!ano_publicacao) {
        res.status(400).json({ mensagem: "o campo ano_publicacao não pode ser nulo" })
        return
    }
    if (!genero) {
        res.status(400).json({ mensagem: "o campo genero não pode ser nulo" })
        return
    }
    if (!quantidade_total) {
        res.status(400).json({ mensagem: "o campo quantidadeTotal não pode ser nulo" })
        return
    }
    if (!quantidade_disponivel) {
        res.status(400).json({ mensagem: "o campo quantidadeDisponivel não pode ser nulo" })
        return
    }

    if (!Array.isArray(autores) || autores.length === 0) {
        res.status(400).json({ mensagem: "o campo autores deve ser array e possuir ao menos um autor" })
        return
    }

    try {
        const autoresEncontrados = await autorModel.findAll({
            where: {
                id: autores
            }
        })

        if (autoresEncontrados.length !== autores.length) {
            res.status(400), json({ mensagem: "um ou mais IDs de autores são invalidos ou não existe" })
            return
        }

        const livro = await livroModel.create({
            titulo,
            isbn,
            descricao,
            ano_publicacao,
            genero,
            quantidade_total,
            quantidade_disponivel,
        })

        await livro.addAutores(autores)
        const livroComAutor = await livroModel.findByPk(livro.id, {
            attributes: {exclude: ["created_at", "updated_at"]},
            include: {
                model: autorModel,
                attributes: {exclude: ["created_at", "updated_at"]},
                through: {attributes: []}
            }
        })
        res.status(200).json({mensagem: "livro cadastrado", livroComAutor})
    } catch (error) {

    }
}

export const listarTodosLivros = async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    offset = (page -1) * limit

    try {
        const livro = await livroModel.findAndCountAll({
            include: {
                model: autorModel,
                through: {attributes: []}
            },
            limit,
            offset
        })
        const livrosFormatados = livro.rows.map((livro)=>{
            return{
            id: livro.id,
            titulo: livro.titulo,
            isbn: livro.isbn,
            descricao: livro.descricao,
            ano_publicacao: livro.ano_publicacao,
            genero: livro.genero,
            quantidade_total: livro.quantidade_total,
            quantidade_disponivel: livro.quantidade_disponivel,
            autores: livro.autores.map((autor)=>({
                id: autor.id,
                nome: autor.nome
            }))
            }
        })

        const totalDePaginas = Math.ceil(livro.count/limit)
        res.status(200).json({
            totalLivros: livro.count,
            totalPaginas: totalDePaginas,
            paginaAtual: page,
            livrosPorPagina: limit,
            livros: livrosFormatados
        })
        res.status(200).json(livrosFormatados)
    } catch (error) {
        
    }
}