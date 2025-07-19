import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import GlobalHeader from '../components/GlobalHeader';
import Icon from '../components/Icon';

export default function FuncionariosPage(){
    const [userName, setUserName] = useState('');
      const router = useRouter();

        const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };


  useEffect(() => {
    const fetchFuncionarios = async () => {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('/api/funcionarios', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Falha ao buscar funcionários.');
        }

        const data = await response.json();
        setFuncionarios(data);
      } catch (err) {
        console.error('Erro ao buscar funcionários:', err);
        setError(err.message || 'Não foi possível carregar os funcionários.');
      } finally {
        setLoading(false);
      }
    };

    fetchFuncionarios();
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

        <GlobalHeader userName={userName} handleLogout={handleLogout}/>
        <div className="container mt-5">
      <h1 className="mb-4">Lista de Funcionários</h1>

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
                <th scope="col">Nome</th>
                <th scope="col">Departamento/Cargo</th>
                <th scope="col">Email</th>
                <th scope="col">Telefone</th>
                <th scope="col">Data Contratação</th>
                <th scope="col">Ações</th>
                {/* <th scope="col">ID Usuário</th> */}
              </tr>
            </thead>
            <tbody>
              {funcionarios.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center">Nenhum funcionário encontrado.</td>
                </tr>
              ) : (
                funcionarios.map((funcionario) => (
                  <tr key={funcionario.id}>
                    <th scope="row">{funcionario.id}</th>
                    <td>{funcionario.nome} {funcionario.sobrenome}</td>
                    <td>{funcionario.departamento || 'N/A'} - {funcionario.cargo || 'N/A'}</td>
                    <td>{funcionario.email || 'N/A'}</td>
                    <td>{funcionario.telefone || 'N/A'}</td>
                    <td>{funcionario.data_contratacao ? new Date(funcionario.data_contratacao).toLocaleDateString('pt-BR') : 'N/A'}</td>
                    <td>
                        <button className="btn btn-info" title="Editar">
                            <Icon name="pencil"/>
                        </button>
                        <button className="btn btn-warning" title="Ver Detalhes">
                            <Icon name="eye"/>
                        </button>
                        <button className="btn btn-danger" title="Deletar">
                            <Icon name="trash"/>
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
    </main>
    );
}