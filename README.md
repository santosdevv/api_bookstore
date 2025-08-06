### Visão Geral do Projeto

API RESTful para sistema de biblioteca com funcionalidades de gerenciamento de livros, autores, usuários, empréstimos e interações sociais.

[] Sprint 1 - Módulo Autor
[] Objetivo: Implementar CRUD completo para gerenciamento de autores
[] Funcionalidades
[] Cadastro de autores
[] Listagem de autores (com paginação)
[] Busca por autor específico
[] Atualização de dados do autor
[] Remoção de autor
[] Rotas da API

GET    /api/autores           - Listar todos os autores
GET    /api/autores/:id       - Buscar autor por ID
POST   /api/autores           - Criar novo autor
PUT    /api/autores/:id       - Atualizar autor
DELETE /api/autores/:id       - Deletar autor