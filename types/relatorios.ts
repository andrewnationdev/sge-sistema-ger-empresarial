export interface EmployeeStats {
    total_funcionarios: number;
    funcionarios_ativos: number;
    funcionarios_inativos: number;
}

export interface TaskCount {
    status?: string;
    prioridade?: string;
    total: number;
}

export interface ResponsibleTask {
    funcionario_id: number;
    nome: string;
    sobrenome: string;
    tarefas_ativas_responsavel: number;
}

export interface ReportData {
    employeeStats: EmployeeStats;
    taskStatusCounts: TaskCount[];
    taskPriorityCounts: TaskCount[];
    overdueTasks: { total_tarefas_atrasadas: number };
    tasksByResponsible: ResponsibleTask[];
    completedThisMonth: { tarefas_concluidas_mes_atual: number };
}