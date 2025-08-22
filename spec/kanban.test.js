const API_ROUTE = "http://localhost:3000/api/projetos"
const LOGIN_API_ROUTE = 'http://localhost:3000/api/auth/login';

const obterToken = async () => {
    const response = await fetch(LOGIN_API_ROUTE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: 'ametista13@gmail.com',
            senha: '123456'
        }),
    });

    const data = await response.json();

    return data.token;
}

describe('Tela Kanban', () => {
    const item = {
        titulo: 'Novo Item',
        status: 'A FAZER',
        descricao: 'Descrição do novo item',
        prioridade: 'BAIXA',
        data_vencimento: "2025-09-19",
        criado_por_usuario_id: 2,
        responsavel_funcionario_id: 5
    }

    const props_item = {
        id: null
    }

    test('Deve retornar todos os items', async () => {
        const req = await fetch(API_ROUTE, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await req.json()

        expect(data.length).toBeGreaterThan(0);

        for (let item = 0; item < data.length; item++) {
            expect(data[item]).toHaveProperty('id');
            expect(data[item]).toHaveProperty('titulo');
            expect(data[item]).toHaveProperty('status');
            expect(data[item]).toHaveProperty('descricao');
            expect(data[item]).toHaveProperty('data_criacao');
            expect(data[item]).toHaveProperty('data_vencimento');
            expect(data[item]).toHaveProperty('responsavel_funcionario_id');
        }
    })

    test('Deve registrar novo item e visualizar', async () => {
        const token = await obterToken();
        const req = await fetch(API_ROUTE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(item)
        });

        console.log(JSON.stringify(item))
        const data = await req.json()

        console.log(data)

        expect(data.message).not.toBe("Erro interno do servidor");
        expect(data).toHaveProperty('id')

        props_item.id = data.id;

    });

    test('Deve editar item', () => { });

    test('Deve deletar item', async () => {
        const token = await obterToken();
        const req = await fetch(`${API_ROUTE}?id=${props_item.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(item)
        });

        const data = await req.json()

        expect(data.message).toBe("Tarefa excluída com sucesso!")
    });
})