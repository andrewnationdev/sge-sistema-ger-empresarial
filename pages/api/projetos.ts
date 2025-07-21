import pool from '../../db/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Busca todas as tarefas/cards do Kanban
      const [rows] = await pool.query('SELECT id, titulo, descricao, status, prioridade, data_criacao, data_vencimento, criado_por_usuario_id, responsavel_funcionario_id FROM tarefas');
      res.status(200).json(rows);
    } catch (error) {
      console.error('Erro ao buscar tarefas:', error);
      res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      // Extrai os dados do corpo da requisição para criar uma nova tarefa
      const { titulo, descricao, status, prioridade, data_vencimento, criado_por_usuario_id, responsavel_funcionario_id } = req.body;

      // Validação básica: título da tarefa é obrigatório
      if (!titulo) {
        return res.status(400).json({ message: 'Título da tarefa é obrigatório.' });
      }

      // Insere a nova tarefa no banco de dados
      const [result] = await pool.execute(
        'INSERT INTO tarefas (titulo, descricao, status, prioridade, data_vencimento, criado_por_usuario_id, responsavel_funcionario_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [titulo, descricao, status, prioridade, data_vencimento, criado_por_usuario_id, responsavel_funcionario_id]
      );

      // Retorna uma resposta de sucesso com o ID da nova tarefa
      res.status(201).json({ message: 'Tarefa adicionada com sucesso!', id: result.insertId });
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      // Se houver um erro, retorna uma mensagem de erro interno do servidor
      res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
  } else if (req.method === 'PUT') { // Adicionando a lógica para PUT
    try {
      // Para PUT, geralmente esperamos que o ID venha na URL (ex: /api/tarefas/123)
      // Mas para um endpoint único, podemos pegá-lo do corpo ou de um query param.
      // Assumindo que o ID virá no corpo para simplificar este arquivo único.
      // Se você tiver rotas dinâmicas como pages/api/tarefas/[id].js, o ID viria de req.query.id
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
  }
  else {
    // Se o método da requisição não for GET nem POST, retorna 'Method Not Allowed'
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}