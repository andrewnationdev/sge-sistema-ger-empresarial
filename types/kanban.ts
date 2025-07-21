export interface ITarefa {
  /**
   * Identificador único da tarefa/card.
   */
  id: number;

  /**
   * Título principal da tarefa.
   */
  titulo: string;

  /**
   * Descrição detalhada da tarefa. Pode ser nula.
   */
  descricao: string | null;

  /**
   * O status atual da tarefa no fluxo do Kanban.
   */
  status: 'A FAZER' | 'EM ANDAMENTO' | 'CONCLUIDO';

  /**
   * Nível de prioridade da tarefa.
   */
  prioridade: 'BAIXA' | 'MEDIA' | 'ALTA';

  /**
   * Data e hora de criação da tarefa.
   */
  data_criacao: string; // Representado como string (ISO 8601) para TIMESTAMP

  /**
   * Data limite para a conclusão da tarefa. Pode ser nula.
   */
  data_vencimento: string | null; // Representado como string ('YYYY-MM-DD') para DATE

  /**
   * ID do usuário que criou esta tarefa. Pode ser nulo se não houver referência.
   */
  criado_por_usuario_id: number | null;

  /**
   * ID do funcionário responsável por esta tarefa. Pode ser nulo se não houver atribuição.
   */
  responsavel_funcionario_id: number | null;
}
