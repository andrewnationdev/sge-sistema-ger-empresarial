import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import GlobalHeader from "../components/GlobalHeader";
import React from "react";

interface EmployeeStats {
    total_funcionarios: number;
    funcionarios_ativos: number;
    funcionarios_inativos: number;
}

interface TaskCount {
    status?: string;
    prioridade?: string;
    total: number;
}

interface ResponsibleTask {
    funcionario_id: number;
    nome: string;
    sobrenome: string;
    tarefas_ativas_responsavel: number;
}

interface ReportData {
    employeeStats: EmployeeStats;
    taskStatusCounts: TaskCount[];
    taskPriorityCounts: TaskCount[];
    overdueTasks: { total_tarefas_atrasadas: number };
    tasksByResponsible: ResponsibleTask[];
    completedThisMonth: { tarefas_concluidas_mes_atual: number };
}

export default function RelatoriosPage() {
    const [userName, setUserName] = useState('');
    const router = useRouter();
    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [loadingReports, setLoadingReports] = useState(true);
    const [reportsError, setReportsError] = useState<string | null>(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        const userString = localStorage.getItem('user');
        if (userString) {
            try {
                const user = JSON.parse(userString);
                setUserName(user.nome_usuario || user.email);
            } catch (e) {
                console.error("Erro ao analisar dados do usuário do localStorage:", e);
            }
        }

        const fetchReports = async () => {
            setLoadingReports(true);
            setReportsError(null);
            try {
                const response = await fetch('/api/relatorios', { // New API endpoint
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) {
                    const error_data = await response.json();
                    throw new Error(error_data.message || 'Falha ao buscar dados de relatórios.');
                }
                const data: ReportData = await response.json();
                setReportData(data);
            } catch (err: any) {
                console.error('Erro ao buscar relatórios:', err);
                setReportsError(err.message || 'Não foi possível carregar os relatórios.');
            } finally {
                setLoadingReports(false);
            }
        };

        fetchReports();
    }, [router]);

    const handleAccountPage = () => {
        router.push("/conta");
    };

    return (
        <main>
            <GlobalHeader userName={userName} handleLogout={handleLogout} handleAccountPage={handleAccountPage}/>
            <div className="container mt-5">
                <h1 className="mb-4">Relatórios Globais</h1>

                {loadingReports ? (
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Carregando relatórios...</span>
                        </div>
                        <p className="mt-2">Carregando relatórios...</p>
                    </div>
                ) : reportsError ? (
                    <div className="alert alert-danger" role="alert">
                        Erro ao carregar relatórios: {reportsError}
                    </div>
                ) : reportData ? (
                    <div>
                        {/* Summary Cards */}
                        <div className="row mb-4">
                            <div className="col-md-4">
                                <div className="card text-white bg-primary mb-3">
                                    <div className="card-header">Funcionários Ativos</div>
                                    <div className="card-body">
                                        <h5 className="card-title">{reportData.employeeStats.funcionarios_ativos || 0}</h5>
                                        <p className="card-text">Total de funcionários ativos.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card text-white bg-info mb-3">
                                    <div className="card-header">Total de Tarefas</div>
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            {reportData.taskStatusCounts.reduce((sum, item) => sum + item.total, 0) || 0}
                                        </h5>
                                        <p className="card-text">Total de tarefas cadastradas.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card text-white bg-danger mb-3">
                                    <div className="card-header">Tarefas Atrasadas</div>
                                    <div className="card-body">
                                        <h5 className="card-title">{reportData.overdueTasks.total_tarefas_atrasadas || 0}</h5>
                                        <p className="card-text">Tarefas com vencimento no passado e não concluídas.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Sections */}
                        <div className="row">
                            <div className="col-md-6 mb-4">
                                <div className="card">
                                    <div className="card-header">Status das Tarefas</div>
                                    <div className="card-body">
                                        <ul className="list-group list-group-flush">
                                            {reportData.taskStatusCounts.length > 0 ? (
                                                reportData.taskStatusCounts.map((item, index) => (
                                                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                                        {item.status || 'N/A'}
                                                        <span className="badge bg-secondary rounded-pill">{item.total}</span>
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="list-group-item">Nenhum dado de status de tarefa.</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 mb-4">
                                <div className="card">
                                    <div className="card-header">Prioridade das Tarefas</div>
                                    <div className="card-body">
                                        <ul className="list-group list-group-flush">
                                            {reportData.taskPriorityCounts.length > 0 ? (
                                                reportData.taskPriorityCounts.map((item, index) => (
                                                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                                        {item.prioridade || 'N/A'}
                                                        <span className="badge bg-secondary rounded-pill">{item.total}</span>
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="list-group-item">Nenhum dado de prioridade de tarefa.</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12 mb-4">
                                <div className="card">
                                    <div className="card-header">Tarefas Ativas por Funcionário</div>
                                    <div className="card-body">
                                        {reportData.tasksByResponsible.length > 0 ? (
                                            <table className="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>Funcionário</th>
                                                        <th>Tarefas Ativas</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {reportData.tasksByResponsible.map((item) => (
                                                        <tr key={item.funcionario_id}>
                                                            <td>{item.nome} {item.sobrenome}</td>
                                                            <td>{item.tarefas_ativas_responsavel}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <p>Nenhum funcionário com tarefas ativas.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-4">
                                <div className="card">
                                    <div className="card-header">Tarefas Concluídas Mês Atual</div>
                                    <div className="card-body">
                                        <h5 className="card-title">{reportData.completedThisMonth.tarefas_concluidas_mes_atual || 0}</h5>
                                        <p className="card-text">Tarefas marcadas como 'Concluído' no mês corrente.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 mb-4">
                                <div className="card">
                                    <div className="card-header">Estatísticas de Funcionários</div>
                                    <div className="card-body">
                                        <p>Total de funcionários: **{reportData.employeeStats.total_funcionarios || 0}**</p>
                                        <p>Funcionários inativos: **{reportData.employeeStats.funcionarios_inativos || 0}**</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="alert alert-info" role="alert">
                        Nenhum dado de relatório disponível.
                    </div>
                )}
            </div>
        </main>
    );
}