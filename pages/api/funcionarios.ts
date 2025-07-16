import pool from '../../db/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {

      const [rows] = await pool.query('SELECT id, nome, sobrenome, cargo, departamento, email, telefone, data_contratacao, ativo, usuario_id FROM funcionarios');

      res.status(200).json(rows);
    } catch (error) {
      console.error('Erro ao buscar funcionários:', error);
      res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { nome, sobrenome, cargo, departamento, email, telefone, data_contratacao, ativo, usuario_id } = req.body;

      if (!nome || !sobrenome) {
        return res.status(400).json({ message: 'Nome e sobrenome são obrigatórios.' });
      }

      const [result] = await pool.execute(
        'INSERT INTO funcionarios (nome, sobrenome, cargo, departamento, email, telefone, data_contratacao, ativo, usuario_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [nome, sobrenome, cargo, departamento, email, telefone, data_contratacao, ativo, usuario_id]
      );

      res.status(201).json({ message: 'Funcionário adicionado com sucesso!', id: result.insertId });
    } catch (error) {
      console.error('Erro ao adicionar funcionário:', error);

      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Erro: Email ou ID de usuário já cadastrado.', error: error.message });
      }
      
      res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
  } else {
    
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
