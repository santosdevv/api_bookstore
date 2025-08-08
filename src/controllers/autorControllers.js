import autorModel from '../models/autorModel.js';

export const cadastrarAutor = (req, res) => {
    const { nome, biografia, data_nascimento, nacionalidade } = req.body;

    if (!nome){
        res.status(400).json({
            erro: 'Campo nome invalido',
            mensagem: 'O campo nome não pode ser nulo'
        });
        return
    }
    if (!biografia){
        res.status(400).json({
            erro: 'Campo biografia invalido',
            mensagem: 'O campo biografia não pode ser nulo'
        });
        return
    }
    if (!data_nascimento){
       res.status(400).json({
            erro: 'Campo data_nascimento invalido',
            mensagem: 'O campo data_nascimento não pode ser nulo'
       });
       return
    }
    if (!nacionalidade){
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
        res.status(201).json({mensagem: "autor criado com sucesso", novoAutor});
    } catch (error) {
        res.status(500).json({mensagem: 'Erro ao cadastrar autor'});
    }
}