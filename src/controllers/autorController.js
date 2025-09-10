import autorModel from "../models/autorModel.js";

export const cadastrarAutor = async (request, response) => {
  const { nome, biografia, data_nascimento, nacionalidade } = request.body;

  if (!nome) {
    response.status(400).json({
      erro: "Campo nome inválido",
      mensagem: "o campo nome não pode ser nulo",
    });
    return;
  }
  if (!biografia) {
    response.status(400).json({
      erro: "Campo biografia inválido",
      mensagem: "o campo biografia não pode ser nulo",
    });
    return;
  }
  if (!data_nascimento) {
    response.status(400).json({
      erro: "Campo data_nascimento inválido",
      mensagem: "o campo data_nascimento não pode ser nulo",
    });
    return;
  }
  if (!nacionalidade) {
    response.status(400).json({
      erro: "Campo nacionalidade inválido",
      mensagem: "o campo nacionalidade não pode ser nulo",
    });
    return;
  }

  //v: data | f: Invalid Date
  const validaData = new Date(data_nascimento);
  if (validaData == "Invalid Date") {
    response.status(400).json({
      erro: "Data Inválida",
      mensagem: "Formato inválido",
    });
    return;
  }

  const autor = {
    nome,
    biografia,
    data_nascimento,
    nacionalidade,
  };

  try {
    const novoAutor = await autorModel.create(autor);
    response
      .status(201)
      .json({ mensagem: "Autor criado com sucesso", novoAutor });
  } catch (error) {
    console.error(error);
    response.status(500).json({ mensagem: "Erro interno ao cadastrar autor" });
  }
};
//:3333/autores?limit=4&page=3
export const listarTodosAutores = async (request, response) => {
  const page = parseInt(request.query.page) || 1;
  const limit = parseInt(request.query.limit) || 10;
  const offset = (page - 1) * limit; // (4 - 1) * 3
  // tabela = |1|2|3|4|5|6|7|8|9|
  try {
    const autores = await autorModel.findAndCountAll({
      offset,
      limit,
    });
    const totalPaginas = Math.ceil(autores.count / limit);

    response.status(200).json({
      totalAutores: autores.count,
      totalPaginas,
      paginaAtual: page,
      autoresPorPagina: limit,
      autores: autores.rows,
    });
  } catch (error) {
    console.log(error);
    response.status(500).json({ mensagem: "Erro interno ao listar autores" });
  }
};

export const buscarAutorPorId = async (request, response) => {
  const id = request.params.id;

  if (!id) {
    response.status(400).json({ mensagem: "O Id é obrigatório" });
    return;
  }

  try {
    const autor = await autorModel.findByPk(id);

    if (!autor) {
      response.status(404).json({ mensagem: "Autor não encontrado" });
      return;
    }

    response.status(200).json(autor);
  } catch (error) {
    console.log(error);
    response.status(500).json({ mensagem: "Erro interno ao buscar autor" });
  }
};

export const atualizarAutor = async (request, response) => {
  const id = request.params.id;
  const { nome, biografia, data_nascimento, nacionalidade } = request.body;

  if (!id) {
    response.status(400).json({
      erro: "Parâmetro ID incorreto",
      mensagem: "O id não pode ser nulo",
    });
    return;
  }

  try {
    const autorSelecionado = await autorModel.findOne({
      where: { id },
    });

    if(!autorSelecionado){
      response.status(404).json({mensagem:"Autor não encontrado"})
      return
    }

    if(nome !== undefined){
      autorSelecionado.nome = nome
    }
    if(biografia !== undefined){
      autorSelecionado.biografia = biografia
    }
    if(data_nascimento !== undefined){
      autorSelecionado.data_nascimento = data_nascimento
    }
    if(nacionalidade !== undefined){
      autorSelecionado.nacionalidade = nacionalidade
    }

    await autorSelecionado.save()
    response.status(200).json({mensagem:"Autor atualizado com sucesso!"})
  } catch (error) {
    console.log(error)
    response.stataus(500).json({mensagem:"Erro interno ao atualizar autor"})
  }
};

export const deletarAutor = async (request, response) => {
  const id = request.params.id;

  if (!id) {
    response.status(400).json({
      erro: "Parâmetro ID incorreto",
      mensagem: "O id não pode ser nulo",
    });
    return;
  }

  try {
    // V = 1, F = 0
    const deletarAutor = await autorModel.destroy({
      where: {id}
    })

    if(deletarAutor === 0){
      response.status(404).json({mensagem:"Autor não encontrado"})
      return
    }

    response.status(204).send()

  } catch (error) {
    console.log(error)
    response.status(500).json({mensagem:"Erro interno ao excluir"})
  }
}