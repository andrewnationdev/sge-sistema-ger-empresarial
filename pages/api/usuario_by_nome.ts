import pool from "../../db/db";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { nome_usuario } = req.query;

    if (!nome_usuario) {
      return res.status(400).json({ message: 'Nome de usuário é obrigatório para esta busca.' });
    }

    try {
      const [rows] = await pool.query(
        'SELECT id, nome_usuario, email FROM usuarios WHERE nome_usuario = ?',
        [nome_usuario]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }

      res.status(200).json(rows[0]);
    } catch (error) {
      console.error('Erro ao buscar usuário por nome de usuário:', error);
      res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}