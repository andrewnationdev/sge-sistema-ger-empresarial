import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import GlobalHeader from '../components/GlobalHeader';
import KanbanCard from '../components/KanbanCard';
import Icon from '../components/Icon';

export default function ProjetosPage() {
  const [userName, setUserName] = useState('');
  const router = useRouter();

  const [tarefas, setTarefas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
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

  return (
    <main>

      <GlobalHeader userName={userName} handleLogout={handleLogout} />
      <div className="container mt-5">
        <div className="d-flex justify-content-between"><h1 className="mb-4">Lista Kanban de Tarefas e Projetos</h1>

          {!loading && !error && <button className="btn btn-primary mb-3">
            <i className="bi bi-plus-lg"></i> Adicionar Tarefa
          </button>}</div>

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

        {!loading && !error && (<div>
          {tarefas.map((tarefa) => <KanbanCard
            titulo={tarefa.titulo}
            id={tarefa.id}
            descricao={tarefa.descricao}
            status={tarefa.status}
            prioridade={tarefa.prioridade}
            dataCriacao={tarefa.data_criacao}
            dataVencimento={tarefa.data_vencimento}
            criadoPorUsuarioId={0}
            responsavelFuncionarioId={0}
          />)}
        </div>)}

      </div>
    </main>
  );
}