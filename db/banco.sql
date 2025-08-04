CREATE DATABASE IF NOT EXISTS sge_app;

USE sge_app;

--
-- Tabela para Armazenar Usuários (para Autenticação)
--
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_usuario VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--
-- Tabela para Armazenar Informações dos Funcionários
--
CREATE TABLE funcionarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(100) NOT NULL,
    cargo VARCHAR(100),
    departamento VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    telefone VARCHAR(20),
    data_contratacao DATE,
    ativo BOOLEAN DEFAULT TRUE,
    -- Chave estrangeira para vincular a um usuário do sistema
    usuario_id INT UNIQUE, -- UNIQUE garante que um usuario_id só possa ser ligado a um funcionário
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

--
-- Tabela para Armazenar as Tarefas do Kanban
--
-- Essa tabela referencia tanto quem criou a tarefa (um usuário)
-- quanto o funcionário responsável pela tarefa.
--
CREATE TABLE tarefas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    status ENUM('A FAZER', 'EM ANDAMENTO', 'CONCLUIDO') NOT NULL DEFAULT 'A FAZER',
    prioridade ENUM('BAIXA', 'MEDIA', 'ALTA') DEFAULT 'MEDIA',
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_vencimento DATE,
    -- Referencia o usuário que criou a tarefa
    criado_por_usuario_id INT,
    FOREIGN KEY (criado_por_usuario_id) REFERENCES usuarios(id),
    -- Referencia o funcionário responsável pela tarefa
    responsavel_funcionario_id INT,
    FOREIGN KEY (responsavel_funcionario_id) REFERENCES funcionarios(id)
);

CREATE TABLE permissoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_role ENUM('ADMIN', 'USER', 'DESATIVADO', 'READONLY') DEFAULT 'USER',
    usuario_id INT UNIQUE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    data_atribuicao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

