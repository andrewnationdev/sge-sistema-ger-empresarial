import pool from '../../db/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [employeeStats] = await pool.query(`
        SELECT
            COUNT(*) AS total_funcionarios,
            SUM(CASE WHEN ativo = TRUE THEN 1 ELSE 0 END) AS funcionarios_ativos,
            SUM(CASE WHEN ativo = FALSE THEN 1 ELSE 0 END) AS funcionarios_inativos
        FROM funcionarios;
      `);

      const [taskStatusCounts] = await pool.query(`
        SELECT
            status,
            COUNT(*) AS total
        FROM tarefas
        GROUP BY status;
      `);

      const [taskPriorityCounts] = await pool.query(`
        SELECT
            prioridade,
            COUNT(*) AS total
        FROM tarefas
        GROUP BY prioridade;
      `);

      const [overdueTasks] = await pool.query(`
        SELECT
            COUNT(*) AS total_tarefas_atrasadas
        FROM tarefas
        WHERE data_vencimento < CURDATE() AND status != 'CONCLUIDO';
      `);

      const [tasksByResponsible] = await pool.query(`
        SELECT
            f.id AS funcionario_id,
            f.nome,
            f.sobrenome,
            COUNT(t.id) AS tarefas_ativas_responsavel
        FROM funcionarios f
        LEFT JOIN tarefas t ON f.id = t.responsavel_funcionario_id
        WHERE t.status != 'CONCLUIDO' OR t.status IS NULL
        GROUP BY f.id, f.nome, f.sobrenome
        ORDER BY tarefas_ativas_responsavel DESC;
      `);

      const [completedThisMonth] = await pool.query(`
        SELECT
            COUNT(*) AS tarefas_concluidas_mes_atual
        FROM tarefas
        WHERE status = 'CONCLUIDO' AND data_vencimento BETWEEN CURDATE() - INTERVAL (DAYOFMONTH(CURDATE()) - 1) DAY AND CURDATE();
      `);


      res.status(200).json({
        employeeStats: employeeStats[0] || {},
        taskStatusCounts: taskStatusCounts,
        taskPriorityCounts: taskPriorityCounts,
        overdueTasks: overdueTasks[0] || {},
        tasksByResponsible: tasksByResponsible,
        completedThisMonth: completedThisMonth[0] || {},
      });

    } catch (error) {
      console.error('Erro ao buscar dados para relatórios:', error);
      res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
