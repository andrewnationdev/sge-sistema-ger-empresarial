import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import GlobalHeader from "../components/GlobalHeader";
import React from "react";

export default function RelatoriosPage() {
    const [userName, setUserName] = useState('');
    const router = useRouter();

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
                setUserName(user.nome_usuario || user.email);
            } catch (e) {
                console.error("Erro ao analisar dados do usuário do localStorage:", e);
            }
        }
    }, [router]);

    return (
        <main>
            <GlobalHeader userName={userName} handleLogout={handleLogout} />
            <div className="container mt-5">
        <h1 className="mb-0">Relatórios Globais</h1>
        </div>
        </main>
    )
}