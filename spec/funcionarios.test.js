LOGIN_API_ROUTE = 'https://sge-sistema-ger-empresarial.vercel.app/api/auth/login';

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
        email: 'admin24@gmail.com',
        senha: 'senhanova'
    },
    admin: {
        email: 'admin24@gmail.com',
        senha: 'admin24'
    }
}

describe('Fluxo de Funcionários', () => {
    test('Deve criar um funcionário e editar', async () => {
        const response = await fetch(LOGIN_API_ROUTE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(usuarios.admin),
        });

        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toHaveProperty('token');

        //Request de usuários
        const req_usuarios = await fetch("https://sge-sistema-ger-empresarial.vercel.app/api/usuarios", {
            method: "GET"
        })

        const u_data = await req_usuarios.json();
        console.log(u_data)

        //Request de funcionários
        const req_func = await fetch("https://sge-sistema-ger-empresarial.vercel.app/api/funcionarios", {
            method: "GET"
        })

        const f_data = await req_func.json();
        console.log(f_data);

        //Obter o id do usuário e com ele cadastrar funcionário novo
        const user_id = 9;

        const req_post_func = await fetch("https://sge-sistema-ger-empresarial.vercel.app/api/funcionarios", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.token}`
            },
            body: JSON.stringify({
                nome: "Funcionário",
                sobrenome: "Teste",
                cargo: "Teste",
                departamento: "Dep Testes",
                email: "func@gmail.com",
                telefone: "(99)98765-4321",
                data_contratacao: "2025-03-01",
                ativo: true,
                usuario_id: 9
            })
        })

        console.log(req_post_func)
        expect(req_post_func.status).toBe(201)
    })

    test('Deve desativar o funcionário', () => {

    })
})