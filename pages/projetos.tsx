import { useRouter } from 'next/router';
import React, { useEffect, useState, useCallback } from 'react';
import GlobalHeader from '../components/GlobalHeader';
import KanbanCard from '../components/KanbanCard';
import TaskModal from '../components/form/TaskModal';
import { ITarefa } from '../types/kanban';

const API_BASE_URL = '/api/projetos';

export default function ProjetosPage() {
  const [userName, setUserName] = useState('');
  const router = useRouter();
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ITarefa | null>(null);
  
  const [tarefas, setTarefas] = useState<ITarefa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

 const fetchTarefas = useCallback(async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao buscar tarefas.');
      }

      const data: any[] = await response.json(); 


      setTarefas(data.map(task => {
        const processDate = (dbDate: string | null | undefined): string | null => {
          if (!dbDate) return null;
          try {
            const dateObj = new Date(dbDate);
            // Verifica se a data é válida e retorna no formato 'YYYY-MM-DD'
            return isNaN(dateObj.getTime()) ? null : dateObj.toISOString().split('T')[0];
          } catch (e) {
            console.error("Erro ao processar data do banco:", dbDate, e);
            return null;
          }
        };

        return {
          id: task.id,
          titulo: task.titulo,
          descricao: task.descricao,
          status: task.status,
          prioridade: task.prioridade,
          data_criacao: processDate(task.data_criacao),
          data_vencimento: processDate(task.data_vencimento),
          criado_por_usuario_id: task.criado_por_usuario_id,
          responsavel_funcionario_id: task.responsavel_funcionario_id
        } as unknown as ITarefa;
      }));
    } catch (err: any) {
      console.error('Erro ao buscar tarefas:', err);
      setError(err.message || 'Não foi possível carregar as tarefas.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchTarefas();
  }, [fetchTarefas]);

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
  }, [router]);

  const handleOpenAddModal = () => {
    setSelectedTask(null);
    setShowTaskModal(true);
  };

  const handleOpenEditModal = (task: ITarefa) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleCloseTaskModal = () => {
    setShowTaskModal(false);
    setSelectedTask(null);
  };

  const handleSaveTask = async (taskData: Partial<ITarefa>) => {
    try {
      let response;
      let finalTask: ITarefa;
      const token = localStorage.getItem('token');

      if (!token) {
          throw new Error('Usuário não autenticado. Redirecionando para o login.');
      }

      const dataToSend = {
          ...taskData,
          criado_por_usuario_id: taskData.criado_por_usuario_id === null || taskData.criado_por_usuario_id === '' ? null : Number(taskData.criado_por_usuario_id),
          responsavel_funcionario_id: taskData.responsavel_funcionario_id === null || taskData.responsavel_funcionario_id === '' ? null : Number(taskData.responsavel_funcionario_id),
      };

      if (selectedTask) {
        response = await fetch(API_BASE_URL, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ ...dataToSend, id: selectedTask.id }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Falha ao atualizar a tarefa.');
        }
        finalTask = { ...selectedTask, ...taskData } as ITarefa;
        console.log('Tarefa atualizada no backend:', finalTask);

      } else {
        response = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(dataToSend),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Falha ao adicionar nova tarefa.');
        }
        const result = await response.json();
        finalTask = {
          ...taskData,
          id: result.id,
          dataCriacao: new Date().toISOString().split('T')[0],
        } as ITarefa;
        console.log('Nova tarefa adicionada no backend:', finalTask);
      }

      await fetchTarefas();

      handleCloseTaskModal();
    } catch (err: any) {
      console.error('Erro ao salvar tarefa:', err);
      alert(`Ocorreu um erro ao salvar a tarefa: ${err.message || 'Erro desconhecido'}`);
      if (err.message === 'Usuário não autenticado. Redirecionando para o login.') {
          router.push('/login');
      }
    }
  };

  const tarefasAFazer = tarefas.filter(tarefa => tarefa.status === "A FAZER");
  const tarefasEmAndamento = tarefas.filter(tarefa => tarefa.status === "EM ANDAMENTO");
  const tarefasConcluido = tarefas.filter(tarefa => tarefa.status === "CONCLUIDO");

  return (
    <main>
      <GlobalHeader userName={userName} handleLogout={handleLogout} />
      <div className="container mt-5">
        <div className="d-flex justify-content-between">
          <h1 className="mb-4">Lista Kanban de Tarefas e Projetos</h1>
          {!loading && !error && (
            <button className="btn btn-primary mb-3" onClick={handleOpenAddModal}>
              <i className="bi bi-plus-lg"></i> Adicionar Tarefa
            </button>
          )}
        </div>

        {loading && (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
            <p className="mt-2">Carregando tarefas...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            Erro: {error}
          </div>
        )}

        {!loading && !error && (
          <div className="row">
            <div className="col-md-4">
              <div className="card mb-3 text-bg-primary">
                <div className="card-header">
                  <h5>A Fazer ({tarefasAFazer.length})</h5>
                </div>
                <div className="card-body">
                  {tarefasAFazer.map((tarefa) => (
                    <KanbanCard
                      key={tarefa.id}
                      card={tarefa}
                      onClick={() => {
                        handleOpenEditModal(tarefa);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card mb-3 text-bg-primary">
                <div className="card-header">
                  <h5>Em Andamento ({tarefasEmAndamento.length})</h5>
                </div>
                <div className="card-body">
                  {tarefasEmAndamento.map((tarefa) => (
                    <KanbanCard
                      key={tarefa.id}
                      card={tarefa}
                      onClick={() => {
                        handleOpenEditModal(tarefa);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card mb-3 text-bg-primary">
                <div className="card-header">
                  <h5>Concluído ({tarefasConcluido.length})</h5>
                </div>
                <div className="card-body">
                  {tarefasConcluido.map((tarefa) => (
                    <KanbanCard
                      key={tarefa.id}
                      card={tarefa}
                      onClick={() => {
                        handleOpenEditModal(tarefa);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {showTaskModal && (
        <TaskModal
          onClose={handleCloseTaskModal}
          task={selectedTask}
          onSave={handleSaveTask}
        />
      )}
    </main>
  );
}