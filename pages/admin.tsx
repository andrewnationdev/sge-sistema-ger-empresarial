import { useRouter } from 'next/router';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import GlobalHeader from '../components/GlobalHeader';
import Icon from '../components/Icon';
import { IFuncionario } from '../types/usuario';
import { throwError, throwSuccess } from '../utils/toast';

const API_FUNCIONARIOS_URL = '/api/funcionarios';
const API_USUARIOS_URL = '/api/usuarios';

export default function AdminPage() {
    const [userName, setUserName] = useState('');
    const router = useRouter();

    const [funcionarios, setFuncionarios] = useState<IFuncionario[]>([]);
    const [loadingFuncionarios, setLoadingFuncionarios] = useState(true);
    const [errorFuncionarios, setErrorFuncionarios] = useState<string | null>(null);
    const [searchFuncionarioTerm, setSearchFuncionarioTerm] = useState<string>('');

    const [usuarios, setUsuarios] = useState([]);
    const [loadingUsuarios, setLoadingUsuarios] = useState(true);
    const [errorUsuarios, setErrorUsuarios] = useState<string | null>(null);

    const fetchInativos = useCallback(async () => {
        setLoadingFuncionarios(true);
        setErrorFuncionarios(null);
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const response = await fetch(API_FUNCIONARIOS_URL, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Falha ao buscar funcionários.');

            const data: any[] = await response.json();
            const inativos = data.filter(f => !f.ativo).map(f => ({
                id: f.id, nome: f.nome, sobrenome: f.sobrenome, cargo: f.cargo,
                departamento: f.departamento, email: f.email, telefone: f.telefone,
                data_contratacao: f.data_contratacao ? new Date(f.data_contratacao).toISOString().split('T')[0] : null,
                ativo: f.ativo, usuario_id: f.usuario_id, usuario_nome: f.usuarioNome
            }));
            setFuncionarios(inativos);
        } catch (err: any) {
            console.error('Erro ao buscar funcionários:', err);
            setErrorFuncionarios(err.message || 'Não foi possível carregar os funcionários inativos.');
        } finally {
            setLoadingFuncionarios(false);
        }
    }, [router]);

    const handle_reactivate_funcionario = async (funcionario_id: number) => {
        if (!window.confirm('Tem certeza que deseja reativar este funcionário?')) return;
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('Usuário não autenticado.');

            const url = `${API_FUNCIONARIOS_URL}?id=${funcionario_id}`;
            const response = await fetch(url, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ ativo: true }),
            });

            if (!response.ok) throw new Error('Falha ao reativar funcionário.');
            throwSuccess('Funcionário reativado com sucesso!');
            fetchInativos();
        } catch (err: any) {
            console.error('Erro ao reativar funcionário:', err);
            throwError(`Erro ao reativar funcionário: ${err.message || 'Erro desconhecido'}`);
        }
    };

    const fetchUsuarios = useCallback(async () => {
        setLoadingUsuarios(true);
        setErrorUsuarios(null);
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const response = await fetch(API_USUARIOS_URL, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            });
            if (!response.ok) throw new Error('Falha ao buscar usuários.');

            const data = await response.json();
            setUsuarios(data);
        } catch (err: any) {
            console.error('Erro ao buscar usuários:', err);
            setErrorUsuarios(err.message || 'Não foi possível carregar os usuários.');
        } finally {
            setLoadingUsuarios(false);
        }
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

    useEffect(() => { fetchInativos(); }, [fetchInativos]);
    useEffect(() => { fetchUsuarios(); }, [fetchUsuarios]);

    const filteredFuncionarios = useMemo(() => {
        if (!searchFuncionarioTerm) return funcionarios;
        const lowercasedSearchTerm = searchFuncionarioTerm.toLowerCase();
        return funcionarios.filter((f) =>
            f.nome.toLowerCase().includes(lowercasedSearchTerm) ||
            f.sobrenome.toLowerCase().includes(lowercasedSearchTerm) ||
            (f.email && f.email.toLowerCase().includes(lowercasedSearchTerm)) ||
            (f.cargo && f.cargo.toLowerCase().includes(lowercasedSearchTerm)) ||
            (f.departamento && f.departamento.toLowerCase().includes(lowercasedSearchTerm))
        );
    }, [funcionarios, searchFuncionarioTerm]);

    const handle_logout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); router.push('/login'); };
    const handleAccountPage = () => { router.push("/conta"); };

    return (
        <>
            <GlobalHeader userName={userName} handleLogout={handle_logout} handleAccountPage={handleAccountPage} />
            <main className="mt-5 container">
                <h1>Página de Administração</h1>
                <div className="alert alert-warning alert-dismissible fade show" role="alert">
                    Esta página é destinada a administradores do sistema afim de gerenciar usuários e reativar funcionários.
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>

                <section>
                    <h2>Reativar Funcionários</h2>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="col-md-4">
                            <input
                                type="text"
                                className="form-control rounded-pill"
                                placeholder="Buscar funcionário inativo..."
                                value={searchFuncionarioTerm}
                                onChange={(e) => setSearchFuncionarioTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    {loadingFuncionarios && (
                        <div className="text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Carregando...</span>
                            </div>
                            <p className="mt-2">Carregando funcionários inativos...</p>
                        </div>
                    )}
                    {errorFuncionarios && (
                        <div className="alert alert-danger" role="alert">
                            Erro: {errorFuncionarios}
                        </div>
                    )}
                    {!loadingFuncionarios && !errorFuncionarios && (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Nome Completo</th>
                                        <th scope="col">Departamento</th>
                                        <th scope="col">Cargo</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredFuncionarios.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="text-center">Nenhum funcionário inativo encontrado.</td>
                                        </tr>
                                    ) : (
                                        filteredFuncionarios.map((funcionario) => (
                                            <tr key={funcionario.id}>
                                                <th scope="row">{funcionario.id}</th>
                                                <td>{funcionario.nome} {funcionario.sobrenome}</td>
                                                <td>{funcionario.departamento || 'N/A'}</td>
                                                <td>{funcionario.cargo || 'N/A'}</td>
                                                <td>{funcionario.email || 'N/A'}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-success btn-sm rounded-pill"
                                                        title="Reativar"
                                                        onClick={() => handle_reactivate_funcionario(funcionario.id!)}>
                                                        <Icon name="person-add" /> Reativar
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
                <hr />

                <section>
                    <h2>Gerenciamento de Contas</h2>
                    {loadingUsuarios && (
                        <div className="text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Carregando...</span>
                            </div>
                            <p className="mt-2">Carregando usuários...</p>
                        </div>
                    )}
                    {errorUsuarios && (
                        <div className="alert alert-danger" role="alert">
                            Erro: {errorUsuarios}
                        </div>
                    )}
                    {!loadingUsuarios && !errorUsuarios && (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Nome de Usuário</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Data de Registro</th>
                                        <th scope="col">Nível de Acesso</th>
                                        <th scope="col">Ações</th>                                        
                                    </tr>
                                </thead>
                                <tbody>
                                    {usuarios.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="text-center">Nenhum usuário encontrado.</td>
                                        </tr>
                                    ) : (
                                        usuarios.map((usuario) => (
                                            <tr key={usuario.id}>
                                                <th scope="row">{usuario.id}</th>
                                                <td>{usuario.nome_usuario}</td>
                                                <td>{usuario.email}</td>
                                                <td>{new Date(usuario.data_registro).toLocaleDateString()}</td>
                                                <td>
                                                    <span>Administrador</span>
                                                </td>
                                                <td>
                                                    <button className="btn btn-success">Tornar Administrador</button>
                                                    <button className="btn btn-danger">Desativar</button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>
        </>
    );
}