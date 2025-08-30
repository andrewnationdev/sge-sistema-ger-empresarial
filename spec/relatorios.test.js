const { describe } = require("node:test");

describe("Tela de Relatórios", () => {
    it("Deve obter os dados", async () => {
        const relatorios = await fetch("https://sge-sistema-ger-empresarial.vercel.app/api/relatorios", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        })

        const data = await relatorios.json()
        expect(data).not.toBe(undefined)
        expect(data).toHaveProperty("completedThisMonth")
        expect(data).toHaveProperty("employeeStats")
        expect(data).toHaveProperty("overdueTasks")
        expect(data).toHaveProperty("taskPriorityCounts")
        expect(data).toHaveProperty("taskStatusCounts")
        expect(data).toHaveProperty("tasksByResponsible")
        expect(typeof data).toBe("object")
    })
})