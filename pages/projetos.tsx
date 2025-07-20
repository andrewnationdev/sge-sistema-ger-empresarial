import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import GlobalHeader from '../components/GlobalHeader';
import KanbanCard from '../components/KanbanCard';
import Icon from '../components/Icon';
import AddTaskModal from '../components/form/AddTaskModal';
import EditTaskModal from '../components/form/EditTaskModal';

export default function ProjetosPage() {
  const [userName, setUserName] = useState('');
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [tarefas, setTarefas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currTask, setCurrTask] = useState({});

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleOpenEditModal = () => {
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  useEffect(() => {
    const fetchTarefas = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('/api/projetos', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Falha ao buscar tarefas.');
        }

        const data = await response.json();
        setTarefas(data);
      } catch (err) {
        console.error('Erro ao buscar tarefas:', err);
        setError(err.message || 'Não foi possível carregar as tarefas.');
      } finally {
        setLoading(false);
      }
    };

    fetchTarefas();
  }, [router]);

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
            <button className="btn btn-primary mb-3" onClick={handleOpenModal}>
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
                        setCurrTask(tarefa);
                        handleOpenEditModal();
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
                        setCurrTask(tarefa);
                        handleOpenEditModal();
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
                        setCurrTask(tarefa);
                        handleOpenEditModal();
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {showModal && <AddTaskModal onClose={handleCloseModal} />}
      {showEditModal && <EditTaskModal onClose={handleCloseEditModal} task={currTask} />}
    </main>
  );
}