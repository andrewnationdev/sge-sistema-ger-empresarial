import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Icon from '../components/Icon';
import GlobalHeader from '../components/GlobalHeader';

export default function DashboardPage() {
  const [userName, setUserName] = useState('');
  const router = useRouter();

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleAccountPage = () => {
        router.push("/conta");
    };

  return (
    <div>
      <GlobalHeader userName={userName} handleLogout={handleLogout} handleAccountPage={handleAccountPage}/>

      <div className="container mt-5">
        <div className="p-5 bg-white rounded-3 shadow-sm">
          <h1 className="display-4">Bem-vindo ao Sistema de Gerenciamento Empresarial</h1>
          <p className="lead">Esta é a área principal do seu dashboard. Em breve, você verá informações e ferramentas importantes aqui.</p>
          <hr className="my-4" />
          <p>Use a barra de navegação acima para acessar as diferentes seções do sistema.</p>
        </div>
      </div>
    </div>
  );
}
