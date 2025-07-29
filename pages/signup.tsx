import { useState } from 'react';
import { useRouter } from 'next/router';
import GlobalHeader from '../components/GlobalHeader';
import { throwError } from '../utils/toast';

export default function RegisterPage() {
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome_usuario: nomeUsuario, email, senha: password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/login?registered=true');
      } else {
        setError(data.message || 'Erro ao registrar. Tente novamente.');
      }
    } catch (err) {
      console.error('Erro na requisição de registro:', err);
      throwError('Ocorreu um erro inesperado. Verifique sua conexão.')
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <GlobalHeader userName={""}/>
      <div className="card shadow-sm p-4 mt-4 mx-auto" style={{ maxWidth: '500px', borderRadius: '15px' }}>
        <h2 className="card-header">Criar Nova Conta</h2>
        <form onSubmit={handleSubmit} className="card-body">
          {/* Campo Nome de Usuário */}
          <div className="form-group">
            <label htmlFor="nomeUsuario">Nome de Usuário</label>
            <input
              type="text"
              id="nomeUsuario"
              className="form-control rounded-pill"
              value={nomeUsuario}
              onChange={(e) => setNomeUsuario(e.target.value)}
              required
            />
          </div>
          {/* Campo Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="form-control rounded-pill"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              className="form-control rounded-pill"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <p className="alert alert-error">{error}</p>
          )}
          <button
            type="submit"
            className="btn btn-primary rounded-pill mt-4 w-100"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>
        <p className="card-footer">
          Já tem uma conta?{' '}
          <a href="/login">
            Faça login aqui
          </a>
        </p>
      </div>
    </div>
  );
}
