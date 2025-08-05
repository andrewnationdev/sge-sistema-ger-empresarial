// pages/api/auth/register.js

import pool from '../../../db/db';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { nome_usuario, email, senha } = req.body;

      if (!nome_usuario || !email || !senha) {
        return res.status(400).json({ message: 'Nome de usuário, email e senha são obrigatórios.' });
      }

      const salt = await bcrypt.genSalt(10);
      const senha_hash = await bcrypt.hash(senha, salt);

      const [result] = await pool.execute(
        'INSERT INTO usuarios (nome_usuario, email, senha_hash) VALUES (?, ?, ?)',
        [nome_usuario, email, senha_hash]
      );

      //@ts-ignore
      let id = result?.insertId;

      if (id) {
        //@ts-ignore
        const [result_perm] = await pool.execute(
          'INSERT INTO permissoes (user_role, usuario_id) VALUES (\'READONLY\', ?) ', [id]
        );
      } else {
        throw("Não foi possível gerar as permissões necessárias.");
      }

      // @ts-ignore
      res.status(201).json({ message: 'Usuário registrado com sucesso!', id: result?.insertId });

    } catch (error) {
      console.error('Erro ao registar usuário:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Erro: Nome de usuário ou email já registrado.', error: error.message });
      }
      res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
