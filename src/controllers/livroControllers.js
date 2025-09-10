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
            autores
        })
        
        
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
        console.log(error);
        
        res.status(500).json({mensagem: "Erro ao cadastrar livro"})
    }
}

export const listarTodosLivros = async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = (page -1) * limit

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
        console.log(error);
        
        res.status(500).json({mensagem: "Erro ao listar os livros"})
    }
}

export const buscarLivro = async (req, res) => {
    const {id} = req.params

    if (!id) {
        res.status(400).json({mensagem: "ID obrigatorio"})
        return
    }

    try {
        const livro = await livroModel.findByPk(id, {
            attributes: {exclude: ["crated_at", "updated_at"]},
            include: {
                model: autorModel,
                through: {attributes: []},
                attributes: {exclude:["crated_at", "updated_at"]}
            }
        })
        if (!livro) {
            res.status(404).json({mensagem: "livro não encontrado"})
            return
        }
        res.status(200).json(livro)
    } catch (error) {
        res.status(500).json({mensagem: "Erro ao buscar livro"})
    }
}

export const deletarLivro = async (req, res) => {
    const {id} = req.params

    try {
        const livro = await livroModel.findByPk(id)
        if (!livro) {
            res.status(400).json({mensagem: "livro não encontrado"})
            return
        }

        await livro.destroy()
        res.status(204).send()
    } catch (error) {
        res.status(500).json({mensagem: "Erro ao deletar livro"})
    }
}


export const cadastrarCapaLivro = async (req, res) => {
    const {id} = req.params
    const {filename, path} = req.file

    if (!id) {
        res.status(400).json({mensagem: "o ID é obrigatorio"})
        return
    }

    try {
        const livro = await livroModel.findByPk(id)

        if (!livro) {
            res.status(400).json({mensagem: "livro não existe"})
            return
        }
        livro.imagem_capa = filename
        livro.imagem_url = path
        
        await livro.save()
        res.status(200).json({mensagem: "capa cadastrada", livro})
    } catch (error) {
        console.log(error);
        res.status(500).json({mensagem: "erro interno ao cadastrar capa"})
    }
}