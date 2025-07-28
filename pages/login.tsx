// pages/login.js

import { useState } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha: password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login bem-sucedido
        // Armazena o token e os dados do utilizador (opcional)
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user)); // Armazena dados básicos do utilizador
        router.push('/dashboard'); // Redireciona para uma página de dashboard após o login
      } else {
        // Erro no login
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
      <div className="card mt-4">
        <h2 className="card-header">SGE - Sistema de Gerenciamento Empresarial</h2>
        <form onSubmit={handleSubmit} className="card-body">
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
          <p className="alert alert-error">{error}</p>
          <button
            type="submit"
            className="btn btn-primary"
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
