import pool from '../../db/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { id } = req.query;

      if (id) {
        const [rows] = await pool.query(
          'SELECT id, nome, sobrenome, cargo, departamento, email, telefone, data_contratacao, ativo, usuario_id FROM funcionarios WHERE id = ?',
          [id]
        );

        if (Array.isArray(rows)){
          if (rows?.length === 0) {
            return res.status(404).json({ message: 'Funcionário não encontrado.' });
          }
        }
        res.status(200).json(rows[0]);
      } else {
        const [rows] = await pool.query('SELECT id, nome, sobrenome, cargo, departamento, email, telefone, data_contratacao, ativo, usuario_id FROM funcionarios');
        res.status(200).json(rows);
      }
    } catch (error) {
      console.error('Erro ao buscar funcionário(s):', error);
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

      res.status(201).json({ message: 'Funcionário adicionado com sucesso!', id: result?.insertId });
    } catch (error) {
      console.error('Erro ao adicionar funcionário:', error);

      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Erro: Email ou ID de usuário já cadastrado.', error: error.message });
      }

      res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
  } else if (req.method === 'PATCH') {
    try {
      const { id } = req.query;
      const updates = req.body;

      if (!id) {
        return res.status(400).json({ message: 'ID do funcionário é obrigatório para atualização.' });
      }

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: 'Nenhum dado fornecido para atualização.' });
      }

      const setClauses = [];
      const values = [];
      for (const key in updates) {
        const allowedFields = ['nome', 'sobrenome', 'cargo', 'departamento', 'email', 'telefone', 'data_contratacao', 'ativo', 'usuario_id'];
        if (allowedFields.includes(key)) {
          setClauses.push(`${key} = ?`);
          values.push(updates[key]);
        }
      }

      if (setClauses.length === 0) {
        return res.status(400).json({ message: 'Nenhum campo válido para atualização foi fornecido.' });
      }

      values.push(id);

      const [result] = await pool.execute(
        `UPDATE funcionarios SET ${setClauses.join(', ')} WHERE id = ?`,
        values
      );

      if (result?.affectedRows === 0) {
        return res.status(404).json({ message: 'Funcionário não encontrado ou nenhum dado alterado.' });
      }

      res.status(200).json({ message: 'Funcionário atualizado com sucesso!' });
    } catch (error) {
      console.error('Erro ao atualizar funcionário:', error);
      res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PATCH']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}