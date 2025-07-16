// pages/register.js

import { useState } from 'react';
import { useRouter } from 'next/router';

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
        // Registro bem-sucedido
        // Pode redirecionar para a página de login ou dashboard
        router.push('/login?registered=true'); // Redireciona para login com um parâmetro de sucesso
      } else {
        // Erro no registro
        setError(data.message || 'Erro ao registrar. Tente novamente.');
      }
    } catch (err) {
      console.error('Erro na requisição de registro:', err);
      setError('Ocorreu um erro inesperado. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Mantendo as classes de estilo existentes da sua página de login
    <div className="login-page">
      <div className="card">
        <h2 className="card-header">SGE - Registro de Usuário</h2>
        <form onSubmit={handleSubmit} className="card-body">
          {/* Campo Nome de Usuário */}
          <div className="form-group">
            <label htmlFor="nomeUsuario">Nome de Usuário</label>
            <input
              type="text"
              id="nomeUsuario"
              className="form-control"
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
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {/* Campo Senha */}
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {/* Mensagem de erro */}
          {error && (
            <p className="alert alert-error">{error}</p>
          )}
          {/* Botão de registro */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>
        {/* Link para login */}
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
