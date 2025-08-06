// pages/api/auth/login.js

import pool from '../../../db/db'; // Ajuste o caminho conforme a localização do seu db.js/db.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
      }

      const [rows] = await pool.query('SELECT id, nome_usuario, email, senha_hash FROM usuarios WHERE email = ?', [email]);

      if (Array.isArray(rows) && rows?.length === 0) {
        return res.status(401).json({ message: 'Credenciais inválidas.' });
      }

      const user = rows[0];

      const [userPermissions] = await pool.query('SELECT user_role FROM permissoes WHERE usuario_id = ?', [user.id]);

      //@ts-ignore
       if (userPermissions?.length > 0 && userPermissions[0].user_role === 'DESATIVADO') {
        return res.status(403).json({ message: 'Login desativado para este usuário.' });
      }

      const isPasswordValid = await bcrypt.compare(senha, user.senha_hash);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Credenciais inválidas.' });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, nome_usuario: user.nome_usuario },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } // Token expira em 1 hora
      );

      res.status(200).json({ message: 'Login bem-sucedido!', token, user: { id: user.id, nome_usuario: user.nome_usuario, email: user.email } });

    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
