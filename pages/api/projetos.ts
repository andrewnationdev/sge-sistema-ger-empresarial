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
  } else {
    // Se o método da requisição não for GET nem POST, retorna 'Method Not Allowed'
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}