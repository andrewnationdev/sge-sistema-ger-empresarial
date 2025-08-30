LOGIN_API_ROUTE = 'https://sge-sistema-ger-empresarial.vercel.app/api/auth/login';

describe("Permissões", () => {
    it("Deve retornar as permissões de um usuário", async () => {
        const fail_req = await fetch("https://sge-sistema-ger-empresarial.vercel.app/api/permissoes?id=2", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        })

        const data = await fail_req.json()
        expect(data).toHaveProperty("message")
        expect(data.message).toBe("Permissão não encontrada para o usuário especificado.")

        const suc_req = await fetch("https://sge-sistema-ger-empresarial.vercel.app/api/permissoes?id=9", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        })

        const suc_data = await suc_req.json()
        expect(suc_data).toHaveProperty("user_role")
        expect(suc_data.message).not.toBe(undefined || "")
    })

    it("Deve editar a permissão do usuário", async () => {
        const response = await fetch(LOGIN_API_ROUTE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: "admin24@gmail.com",
                senha: "admin24"
            }),
        });

        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data).toHaveProperty('token');

        const req = await fetch("https://sge-sistema-ger-empresarial.vercel.app/api/permissoes", {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.token}`
            },
            body: JSON.stringify({
                usuario_id: 9,
                user_role: "ADMIN"
            })
        })

        const d = await req.json()
        expect(d).toHaveProperty("message")
        expect(d.message).toBe("Permissão do usuário atualizada com sucesso!")
    })
})