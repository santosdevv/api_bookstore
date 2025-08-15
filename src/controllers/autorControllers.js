import autorModel from '../models/autorModel.js';

export const cadastrarAutor = async (req, res) => {
    const { nome, biografia, data_nascimento, nacionalidade } = req.body;

    if (!nome) {
        res.status(400).json({
            erro: 'Campo nome invalido',
            mensagem: 'O campo nome não pode ser nulo'
        });
        return
    }
    if (!biografia) {
        res.status(400).json({
            erro: 'Campo biografia invalido',
            mensagem: 'O campo biografia não pode ser nulo'
        });
        return
    }
    if (!data_nascimento) {
        res.status(400).json({
            erro: 'Campo data_nascimento invalido',
            mensagem: 'O campo data_nascimento não pode ser nulo'
        });
        return
    }
    if (!nacionalidade) {
        res.status(400).json({
            erro: 'Campo nacionalidade invalido',
            mensagem: 'O campo nacionalidade não pode ser nulo'
        });
        return
    }

    const validaData = new Date(data_nascimento);
    if (validaData == 'Invalid Date') {
        res.status(400).json({
            erro: 'Campo data_nascimento invalido',
            mensagem: 'Formato de data inválido'
        });
        return
    }

    const autor = {
        nome,
        biografia,
        data_nascimento,
        nacionalidade
    }

    try {
        const novoAutor = autorModel.create(autor);
        res.status(201).json({ mensagem: "autor criado com sucesso", novoAutor });
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao cadastrar autor' });
    }
}

export const listarTodosAutores = async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = (page - 1) * limit

    try {
        const autores = await autorModel.findAndCountAll({ offset, limit })
        const totalPaginas = Math.ceil(autores.count / limit)
        res.status(200).json({ totalAutores: autores.count, totalPaginas, paginalAtual: page, autoresPorPagina: limit, autores: autores.rows });
    } catch (error) {
        console.log(error)
        res.status(500).json({ mensagem: 'Erro ao listar autores' });

    }
    res.send('Listar todos os autores');
}

export const buscarAutorPorId = async (req, res) => {
    const { id } = req.params

    if (!id) {
        res.status(400).json({ mensagem: "ID tem que ser valido" })
    }

    try {
        const autor = await autorModel.findByPk(id)
        if (!autor) {
            res.status(400).json({ mensagem: "autor não encontrado" })
            return
        }
        res.status(200).json(autor)
    } catch (error) {
        res.status(500).json({ mensagem: 'Erro ao listar autor' })
    }
}

export const atualizarAutor = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, biografia, dataNascimento, nacionalidade } = req.body;

        const autor = await autorModel.findByPk(id);

        if (!autor) {
            return res.status(404).json({ mensagem: "Autor não encontrado!" });
        }

        await autor.update({ nome, biografia, dataNascimento, nacionalidade });

        res.status(200).json(autor);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao atualizar o autor', error: error.message });
    }
}