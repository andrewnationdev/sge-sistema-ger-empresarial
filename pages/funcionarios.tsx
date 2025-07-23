import { useRouter } from 'next/router';
import React, { useEffect, useState, useCallback } from 'react';
import GlobalHeader from '../components/GlobalHeader';
import Icon from '../components/Icon';
import FuncionarioModal from '../components/form/FuncionarioModal';
import { IFuncionario } from '../types/usuario';

const API_FUNCIONARIOS_URL = '/api/funcionarios';

export default function FuncionariosPage() {
  const [userName, setUserName] = useState('');
  const router = useRouter();
  const [funcionarios, setFuncionarios] = useState<IFuncionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [show_funcionario_modal, setShowFuncionarioModal] = useState(false);
  const [funcionario, setFuncionario] = useState<IFuncionario>();
  const [mode, setMode] = useState<"create"|"edit"|"view">("create");

  const handle_logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const fetchFuncionarios = useCallback(async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(API_FUNCIONARIOS_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        const error_data = await response.json();
        throw new Error(error_data.message || 'Falha ao buscar funcionários.');
      }

      const data: any[] = await response.json();
      setFuncionarios(data.map(f => ({
        id: f.id,
        nome: f.nome,
        sobrenome: f.sobrenome,
        cargo: f.cargo,
        departamento: f.departamento,
        email: f.email,
        telefone: f.telefone,
        data_contratacao: f.data_contratacao ? new Date(f.data_contratacao).toISOString().split('T')[0] : null,
        ativo: f.ativo,
        usuario_id: f.usuario_id,
        usuario_nome: f.usuarioNome
      })));
    } catch (err: any) {
      console.error('Erro ao buscar funcionários:', err);
      setError(err.message || 'Não foi possível carregar os funcionários.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchFuncionarios();
  }, [fetchFuncionarios]);

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

  const handle_open_funcionario_modal = () => {
    setShowFuncionarioModal(true);
  };

  const handle_close_funcionario_modal = () => {
    setShowFuncionarioModal(false);
  };

  const handle_save_funcionario = async (funcionario_data: Partial<IFuncionario>) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Usuário não autenticado.');
      }

      const data_to_send = {
        ...funcionario_data,
        ativo: funcionario_data.ativo !== undefined ? funcionario_data.ativo : true,
        usuario_id: funcionario_data.usuario_id === null || funcionario_data.usuario_id === '' ? null : Number(funcionario_data.usuario_id),
      };

      const response = await fetch(API_FUNCIONARIOS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data_to_send),
      });

      if (!response.ok) {
        const error_data = await response.json();
        throw new Error(error_data.message || 'Falha ao cadastrar funcionário.');
      }

      console.log('Funcionário cadastrado com sucesso!', await response.json());
      await fetchFuncionarios();
      handle_close_funcionario_modal();
      alert('Funcionário cadastrado com sucesso!');
    } catch (err: any) {
      console.error('Erro ao salvar funcionário:', err);
      alert(`Erro ao cadastrar funcionário: ${err.message || 'Erro desconhecido'}`);
    }
  };

  const clear_modal_state = () => {
    setFuncionario({});
    setMode("create");
  }

  const handle_deactivate_funcionario = async (funcionario_id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Usuário não autenticado.');
      }

      const url = `${API_FUNCIONARIOS_URL}?id=${funcionario_id}`;
      const data_to_send = {
        ativo: false,
      };

      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data_to_send),
      });

      if (!response.ok) {
        const error_data = await response.json();
        throw new Error(error_data.message || 'Falha ao desativar funcionário.');
      }

      console.log('Funcionário desativado com sucesso!', await response.json());
      await fetchFuncionarios();
      alert('Funcionário desativado com sucesso!');
    } catch (err: any) {
      console.error('Erro ao desativar funcionário:', err);
      alert(`Erro ao desativar funcionário: ${err.message || 'Erro desconhecido'}`);
    }
  };

  return (
    <main>
      <GlobalHeader userName={userName} handleLogout={handle_logout} />
      <div className="container mt-5">
        <h1 className="mb-4">Lista de Funcionários</h1>
        <button className="btn btn-primary mb-3" onClick={() => {
          clear_modal_state();
          handle_open_funcionario_modal();
          }}>
          <i className="bi bi-person-vcard"></i> Cadastrar Funcionário
        </button>

        {loading && (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
            <p className="mt-2">Carregando funcionários...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            Erro: {error}
          </div>
        )}

        {!loading && !error && (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Nome Completo</th>
                  <th scope="col">Departamento</th>
                  <th scope="col">Cargo</th>
                  <th scope="col">Email</th>
                  <th scope="col">Telefone</th>
                  <th scope="col">Data Contratação</th>
                  <th scope="col">Ações</th>
                </tr>
              </thead>
              <tbody>
                {funcionarios.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center">Nenhum funcionário encontrado.</td>
                  </tr>
                ) : (
                  funcionarios.filter((f) => f.ativo == true).map((funcionario) => (
                    <tr key={funcionario.id}>
                      <th scope="row">{funcionario.id}</th>
                      <td>{funcionario.nome} {funcionario.sobrenome}</td>
                      <td>{funcionario.departamento || 'N/A'}</td>
                      <td>{funcionario.cargo || 'N/A'}</td>
                      <td>{funcionario.email || 'N/A'}</td>
                      <td>{funcionario.telefone || 'N/A'}</td>
                      <td>{funcionario.data_contratacao ? new Date(funcionario.data_contratacao).toLocaleDateString('pt-BR') : 'N/A'}</td>
                      <td>
                        <button className="btn btn-info btn-sm me-1" title="Editar" onClick={()=>{
                          setMode("edit");
                          setFuncionario(funcionario);
                          handle_open_funcionario_modal();
                        }}>
                          <Icon name="pencil" />
                        </button>
                        <button className="btn btn-warning btn-sm me-1" title="Ver Detalhes" onClick={()=>{
                          setMode("view");
                          setFuncionario(funcionario);
                          handle_open_funcionario_modal();
                        }}>
                          <Icon name="eye" />
                        </button>
                        <button className="btn btn-danger btn-sm" title="Deletar" onClick={() => handle_deactivate_funcionario(funcionario.id)}>
                          <Icon name="trash" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {show_funcionario_modal && (
        <FuncionarioModal
          onClose={handle_close_funcionario_modal}
          onSave={handle_save_funcionario}
          mode={mode}
          funcionarioToEdit={funcionario}
        />
      )}
    </main>
  );
}