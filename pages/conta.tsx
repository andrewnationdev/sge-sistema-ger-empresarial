import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import GlobalHeader from '../components/GlobalHeader';

export default function ContaPage() {
    const router = useRouter();

    const [userData, setUserData] = useState({
        id: null,
        nome_usuario: '',
        email: '',
        senha: ''
    });
    const [initialUsername, setInitialUsername] = useState('');
    const [userName, setUserName] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

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
                if (user.nome_usuario) {
                    setUserName(user.nome_usuario);
                    setInitialUsername(user.nome_usuario);
                } else {
                    setError("Nome de usuário não encontrado no localStorage.");
                    setLoading(false);
                }
            } catch (e) {
                console.error("Erro ao analisar dados do usuário do localStorage:", e);
                setError("Erro ao carregar informações do usuário.");
                setLoading(false);
            }
        } else {
            setError("Nenhum dado de usuário encontrado no localStorage.");
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        const fetchUserDataFromApi = async () => {
            if (!initialUsername) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await fetch(`/api/usuario_by_nome?nome_usuario=${initialUsername}`);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Falha ao buscar dados do usuário.');
                }
                const data = await response.json();

                setUserData({
                    id: data.id,
                    nome_usuario: data.nome_usuario,
                    email: data.email,
                    senha: ''
                });

            } catch (err) {
                setError('Erro ao carregar dados do usuário: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDataFromApi();
    }, [initialUsername]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleOldPasswordChange = (e) => {
        setOldPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!userData.id) {
            setError("ID do usuário não disponível para atualização. Tente recarregar a página.");
            return;
        }
        
        if (userData.senha && !oldPassword) {
            setError("Por favor, digite sua senha antiga para definir uma nova.");
            return;
        }
        
        try {
            const response = await fetch(`/api/gerenciar_contas?id=${userData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome_usuario: userData.nome_usuario,
                    email: userData.email,
                    senha_antiga: oldPassword,
                    ...(userData.senha && { nova_senha: userData.senha })
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Falha ao atualizar usuário.');
            }

            setMessage(result.message || 'Dados atualizados com sucesso!');
            setUserData(prevData => ({ ...prevData, senha: '' }));
            setOldPassword('');
            
            const userString = localStorage.getItem('user');
            if (userString) {
                const user = JSON.parse(userString);
                user.nome_usuario = userData.nome_usuario;
                user.email = userData.email;
                localStorage.setItem('user', JSON.stringify(user));
                setUserName(userData.nome_usuario);
            }
        } catch (err) {
            setError('Erro ao atualizar: ' + err.message);
        }
    };

    const handleAccountPage = () => {
        router.push("/conta");
    };

    if (loading) {
        return (
            <div>
                <GlobalHeader handleAccountPage={handleAccountPage} handleLogout={handleLogout} userName={userName} />
                <div className="container mt-5">
                    <div className="alert alert-info" role="alert">
                        Carregando dados do usuário...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div> 
            <GlobalHeader handleLogout={handleLogout} handleAccountPage={handleAccountPage} userName={userName} />
            <div className="container mt-5 mb-5">
                <div className="card shadow-sm p-4 mx-auto" style={{ maxWidth: '500px', borderRadius: '15px' }}>
                    <h2 className="card-title text-center mb-4">Minha Conta</h2>

                    {message && (
                        <div className="alert alert-success" role="alert">
                            {message}
                        </div>
                    )}
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="nome_usuario" className="form-label">Nome de Usuário</label>
                            <input
                                type="text"
                                className="form-control rounded-pill"
                                id="nome_usuario"
                                name="nome_usuario"
                                value={userData.nome_usuario}
                                onChange={handleChange}
                                required
                                disabled
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control rounded-pill"
                                id="email"
                                name="email"
                                value={userData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <hr />
                        <div className="mb-3">
                            <label htmlFor="senha_antiga" className="form-label">Senha Antiga</label>
                            <input
                                type="password"
                                className="form-control rounded-pill"
                                id="senha_antiga"
                                name="senha_antiga"
                                value={oldPassword}
                                onChange={handleOldPasswordChange}
                                placeholder="Digite sua senha atual"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="nova_senha" className="form-label">Nova Senha (deixe em branco para não alterar)</label>
                            <input
                                type="password"
                                className="form-control rounded-pill"
                                id="nova_senha"
                                name="senha"
                                value={userData.senha}
                                onChange={handleChange}
                                placeholder="********"
                            />
                        </div>
                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary btn-lg rounded-pill">
                                Atualizar Dados
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}