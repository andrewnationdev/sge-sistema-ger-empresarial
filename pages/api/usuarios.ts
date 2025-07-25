import pool from '../../db/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT id, nome_usuario, email, data_registro FROM usuarios');
      res.status(200).json(rows);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
  }
  // Lida com requisições POST para registrar um novo usuário.
  else if (req.method === 'POST') {
    try {
      const { nome_usuario, email, senha } = req.body;

      // Validação básica dos dados.
      if (!nome_usuario || !email || !senha) {
        return res.status(400).json({ message: 'Nome de usuário, email e senha são obrigatórios.' });
      }

      // Gera um 'salt' (valor aleatório) e faz o hash da senha.
      // O 'salt' é adicionado à senha antes do hash para aumentar a segurança.
      // O segundo argumento (10) é o número de 'rounds' ou custo computacional.
      const salt = await bcrypt.genSalt(10);
      const senha_hash = await bcrypt.hash(senha, salt);

      // Insere o novo usuário no banco de dados com a senha hasheada.
      const [result] = await pool.execute(
        'INSERT INTO usuarios (nome_usuario, email, senha_hash) VALUES (?, ?, ?)',
        [nome_usuario, email, senha_hash]
      );

      // Retorna uma resposta de sucesso.
      // @ts-ignore
      res.status(201).json({ message: 'Usuário registrado com sucesso!', id: result?.insertId });
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      // Verifica se o erro é devido a uma entrada duplicada (nome_usuario ou email UNIQUE).
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Erro: Nome de usuário ou email já cadastrado.', error: error.message });
      }
      res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
  }
  // Lida com métodos HTTP não permitidos.
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
