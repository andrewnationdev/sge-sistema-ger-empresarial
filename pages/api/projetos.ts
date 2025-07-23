import pool from '../../db/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [rows] = await pool.query('SELECT id, titulo, descricao, status, prioridade, data_criacao, data_vencimento, criado_por_usuario_id, responsavel_funcionario_id FROM tarefas');
      res.status(200).json(rows);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
      res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const { titulo, descricao, status, prioridade, data_vencimento, criado_por_usuario_id, responsavel_funcionario_id } = req.body;

      if (!titulo) {
        return res.status(400).json({ message: 'Título da tarefa é obrigatório.' });
      }

      const [result] = await pool.execute(
        'INSERT INTO tarefas (titulo, descricao, status, prioridade, data_vencimento, criado_por_usuario_id, responsavel_funcionario_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [titulo, descricao, status, prioridade, data_vencimento, criado_por_usuario_id, responsavel_funcionario_id]
      );

      res.status(201).json({ message: 'Tarefa adicionada com sucesso!', id: result.insertId });
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const { id, titulo, descricao, status, prioridade, data_vencimento, criado_por_usuario_id, responsavel_funcionario_id } = req.body;

      if (!id) {
        return res.status(400).json({ message: 'ID da tarefa é obrigatório para atualização.' });
      }
      if (!titulo) {
        return res.status(400).json({ message: 'Título da tarefa é obrigatório.' });
      }

      const [result] = await pool.execute(
        `UPDATE tarefas SET
          titulo = ?,
          descricao = ?,
          status = ?,
          prioridade = ?,
          data_vencimento = ?,
          criado_por_usuario_id = ?,
          responsavel_funcionario_id = ?
        WHERE id = ?`,
        [titulo, descricao, status, prioridade, data_vencimento, criado_por_usuario_id, responsavel_funcionario_id, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Tarefa não encontrada.' });
      }

      res.status(200).json({ message: 'Tarefa atualizada com sucesso!' });
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query; // Assuming ID comes as a query parameter (e.g., /api/tarefas?id=123)

      if (!id) {
        return res.status(400).json({ message: 'ID da tarefa é obrigatório para exclusão.' });
      }

      const [result] = await pool.execute(
        'DELETE FROM tarefas WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Tarefa não encontrada.' });
      }

      res.status(200).json({ message: 'Tarefa excluída com sucesso!' });
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
  }
  else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}