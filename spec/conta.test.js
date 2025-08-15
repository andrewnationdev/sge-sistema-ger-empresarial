const LOGIN_API_ROUTE = 'https://sge-sistema-ger-empresarial.vercel.app/api/auth/login';

const usuarios = {
    valido: {
        email: 'ametista13@gmail.com',
        senha: '12345',
    },
    invalido: {
        email: 'ametista13@gmail.com',
        senha: 'senha_incorreta',
    }
}

describe('Conta de Usuário', () => {
    test('Deve realizar o login corretamente', async () =>  {
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

    test('Não deve realizar o login corretamente', async () =>  {
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