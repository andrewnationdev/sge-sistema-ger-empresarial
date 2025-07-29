import { useRouter } from 'next/router';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import GlobalHeader from '../components/GlobalHeader';
import Icon from '../components/Icon';
import FuncionarioModal from '../components/form/FuncionarioModal';
import { IFuncionario } from '../types/usuario';
import { formatPhoneNumber } from '../utils/mascara';
import { throwError, throwSuccess } from '../utils/toast';

const API_FUNCIONARIOS_URL = '/api/funcionarios';

export default function FuncionariosPage() {
  const [userName, setUserName] = useState('');
  const router = useRouter();
  const [funcionarios, setFuncionarios] = useState<IFuncionario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [show_funcionario_modal, setShowFuncionarioModal] = useState(false);
  const [funcionario, setFuncionario] = useState<IFuncionario | null>(null);
  const [mode, setMode] = useState<"create" | "edit" | "view">("create");
  const [search_term, setSearchTerm] = useState<string>('');

  const handle_logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleAccountPage = () => {
    router.push("/conta")
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

  const filteredFuncionarios = useMemo(() => {
    if (!search_term) {
      return funcionarios.filter(f => f.ativo);
    }
    const lowercasedSearchTerm = search_term.toLowerCase();
    return funcionarios.filter((f) => {
      if (!f.ativo) return false; 

      return (
        f.nome.toLowerCase().includes(lowercasedSearchTerm) ||
        f.sobrenome.toLowerCase().includes(lowercasedSearchTerm) ||
        (f.email && f.email.toLowerCase().includes(lowercasedSearchTerm)) ||
        (f.cargo && f.cargo.toLowerCase().includes(lowercasedSearchTerm)) ||
        (f.departamento && f.departamento.toLowerCase().includes(lowercasedSearchTerm))
      );
    });
  }, [funcionarios, search_term]);

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
    setFuncionario(null);
    setMode("create");
    fetchFuncionarios();
  };

  const handle_save_funcionario = async (funcionario_data: Partial<IFuncionario>) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Usuário não autenticado.');
      }

      const is_update = funcionario_data.id !== undefined && funcionario_data.id !== null;
      const method = is_update ? 'PATCH' : 'POST';
      const url = is_update ? `${API_FUNCIONARIOS_URL}?id=${funcionario_data.id}` : API_FUNCIONARIOS_URL;

      const data_to_send = {
        ...funcionario_data,
        ativo: funcionario_data.ativo !== undefined ? funcionario_data.ativo : true,
        usuario_id: 
          funcionario_data.usuario_id === null ||
          (typeof funcionario_data.usuario_id === 'string' && funcionario_data.usuario_id === '')
            ? null
            : Number(funcionario_data.usuario_id),
      };

      if (is_update) {
        delete data_to_send.id;
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data_to_send),
      });

      if (!response.ok) {
        const error_data = await response.json();
        throw new Error(error_data.message || `Falha ao ${is_update ? 'atualizar' : 'cadastrar'} funcionário.`);
      }

      throwSuccess(`Funcionário ${is_update ? 'atualizado' : 'cadastrado'} com sucesso!`);
      handle_close_funcionario_modal();
    } catch (err: any) {
      console.error('Erro ao salvar funcionário:', err);
      throwError(`Erro ao salvar funcionário: ${err.message || 'Erro desconhecido'}`);
    }
  };

  const handle_deactivate_funcionario = async (funcionario_id: number) => {
    if (!window.confirm('Tem certeza que deseja desativar este funcionário?')) {
      return;
    }
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

      throwSuccess('Funcionário desativado com sucesso!');
      fetchFuncionarios();
    } catch (err: any) {
      console.error('Erro ao desativar funcionário:', err);
      throwError(`Erro ao desativar funcionário: ${err.message || 'Erro desconhecido'}`);
    }
  };

  return (
    <main>
      <GlobalHeader userName={userName} handleLogout={handle_logout} handleAccountPage={handleAccountPage} />
      <div className="container mt-5">
        <h1 className="mb-4">Lista de Funcionários</h1>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control rounded-pill"
              placeholder="Buscar por nome, email, cargo..."
              value={search_term}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn btn-primary rounded-pill" onClick={() => {
            setFuncionario(null);
            setMode("create");
            handle_open_funcionario_modal();
          }}>
            <i className="bi bi-person-vcard"></i> Cadastrar Funcionário
          </button>
        </div>

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
                  <th scope="col">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredFuncionarios.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center">Nenhum funcionário encontrado.</td>
                  </tr>
                ) : (
                  filteredFuncionarios.map((funcionario) => (
                    <tr key={funcionario.id}>
                      <th scope="row">{funcionario.id}</th>
                      <td>{funcionario.nome} {funcionario.sobrenome}</td>
                      <td>{funcionario.departamento || 'N/A'}</td>
                      <td>{funcionario.cargo || 'N/A'}</td>
                      <td>{funcionario.email || 'N/A'}</td>
                      <td>{formatPhoneNumber(funcionario.telefone) || 'N/A'}</td>
                      <td>
                        <button className="btn btn-dark btn-sm me-1 rounded-pill" title="Editar" onClick={() => {
                          setMode("edit");
                          setFuncionario(funcionario);
                          handle_open_funcionario_modal();
                        }}>
                          <Icon name="pencil" />
                        </button>
                        <button className="btn btn-primary btn-sm me-1 rounded-pill" title="Ver Detalhes" onClick={() => {
                          setMode("view");
                          setFuncionario(funcionario);
                          handle_open_funcionario_modal();
                        }}>
                          <Icon name="eye" />
                        </button>
                        {funcionario.ativo && (
                          <button className="btn btn-danger btn-sm rounded-pill" title="Desativar" onClick={() => handle_deactivate_funcionario(funcionario.id!)}>
                            <Icon name="trash" />
                          </button>
                        )}
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