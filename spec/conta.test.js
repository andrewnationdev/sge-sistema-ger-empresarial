const LOGIN_API_ROUTE = 'https://sge-sistema-ger-empresarial.vercel.app/api/auth/login';

const usuarios = {
    valido: {
        usuario: 'ametista13',
        email: 'ametista13@gmail.com',
        senha: '12345',
    },
    invalido: {
        email: 'ametista13@gmail.com',
        senha: 'senha_incorreta',
    },
    novos_dados: {
        email: '',
        senha: 'senhanova'
    }
}

describe('Conta de Usuário', () => {
    test('Deve realizar o login corretamente', async () => {
        const response = await fetch(LOGIN_API_ROUTE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuarios.valido),
        });

        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toHaveProperty('token');
    })

    test('Não deve realizar o login corretamente', async () => {
        const response = await fetch(LOGIN_API_ROUTE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuarios.invalido),
        });

        const data = await response.json();

        expect(response.status).not.toBe(200);
        expect(data).not.toHaveProperty('token');
    })
})

describe('Fluxo de Alteração de Tela de Usuário', () => {
    test('Deve logar e alterar a senha do usuário', async () => {
        const response = await fetch(LOGIN_API_ROUTE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuarios.valido),
        });

        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toHaveProperty('token');

        const res = await fetch(`https://sge-sistema-ger-empresarial.vercel.app/api/usuario_by_nome?nome_usuario=${usuarios.valido.usuario}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.token}`
            }
        });

        const u_data = await res.json();

        expect(u_data).toHaveProperty('id')

        const req_alterar_dados = await fetch("https://sge-sistema-ger-empresarial.vercel.app/api/gerenciar_conta", {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.token}`
            },
            body: {
                nome_usuario: usuarios.valido.usuario,
                email: usuarios.valido.email,
                senha_antiga: usuarios.valido.senha,
                nova_senha: usuarios.novos_dados.senha
            }
        });

        console.log(req_alterar_dados)

        expect(req_alterar_dados.status).toBe(200);
    })
})