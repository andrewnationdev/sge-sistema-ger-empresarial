import { useState } from 'react';
import { useRouter } from 'next/router';
import GlobalHeader from '../components/GlobalHeader';
import { throwError } from '../utils/toast';
import { getIdFromPermissao } from '../utils/permissions';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const allowLogin = async (email: string) => {
    const users = await fetch(`/api/usuarios`);
    const data = await users.json();
    
    const user = data.find((user) => user.email === email);

    const permissoes = await fetch(`/api/permissoes`);
    const permissoesData = await permissoes.json();

    //Verifique se o usuário tem permissão para login

    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let loginAllowed = await allowLogin(email);
    if(!loginAllowed) return;

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha: password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user)); 
        router.push('/dashboard');
      } else {
        throwError('Erro ao fazer login. Tente novamente.');
        setError(data.message || 'Erro ao fazer login. Tente novamente.');
      }
    } catch (err) {
      console.error('Erro na requisição de login:', err);
      setError('Ocorreu um erro inesperado. Verifique a sua ligação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <GlobalHeader userName={""}/>
      <div className="card shadow-sm p-4 mt-4 mx-auto" style={{ maxWidth: '500px', borderRadius: '15px' }}>
        <h2 className="card-header">Entre no SGE</h2>
        <form onSubmit={handleSubmit} className="card-body">
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
          <p className="alert alert-error">{error}</p>
          <button
            type="submit"
            className="btn btn-primary rounded-pill w-100"
            disabled={loading}
          >
            {loading ? 'Fazendo Login...' : 'Entrar'}
          </button>
        </form>
        <p className="card-footer">
          Não tem uma conta ainda?{' '}
          <a href="/signup">
            Registre-se aqui
          </a>
        </p>
      </div>
    </div>
  );
}
