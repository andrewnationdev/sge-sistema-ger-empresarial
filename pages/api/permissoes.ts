import pool from '../../db/db';

export default async function handler(req, res) {
    if (req.method === "GET") {
        const { id } = req.query;

        if (id) {
            try {
                const [rows] = await pool.query(
                    'SELECT user_role FROM permissoes WHERE usuario_id = ?',
                    [id]
                );

                // @ts-ignore
                if (rows.length === 0) {
                    return res.status(404).json({ message: 'Permissão não encontrada para o usuário especificado.' });
                }
                res.status(200).json(rows[0]);

            } catch (e) {
                console.error('Erro ao buscar permissão:', e);
                res.status(500).json({ message: 'Erro interno do servidor', error: e.message });
            }
        } else {
            try {
                const [rows] = await pool.query('SELECT * FROM permissoes');

                // @ts-ignore
                if (rows.length === 0) {
                    return res.status(200).json([]);
                }
                res.status(200).json(rows);
            } catch (e) {
                console.error('Erro ao buscar todas as permissões:', e);
                res.status(500).json({ message: 'Erro interno do servidor', error: e.message });
            }
        }
    } else if (req.method === "PATCH") {
        const { usuario_id, user_role } = req.body;

        if (!usuario_id || !user_role) {
            return res.status(400).json({ message: 'ID do usuário e novo role são obrigatórios.' });
        }

        try {
            const [result] = await pool.query(
                'UPDATE permissoes SET user_role = ? WHERE usuario_id = ?',
                [user_role, usuario_id]
            );

            // @ts-ignore
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Permissão não encontrada para o usuário especificado ou role já é o mesmo.' });
            }

            res.status(200).json({ message: 'Permissão do usuário atualizada com sucesso!', usuario_id, new_role: user_role });

        } catch (e) {
            console.error('Erro ao atualizar permissão:', e);
            res.status(500).json({ message: 'Erro interno do servidor ao atualizar permissão', error: e.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'PATCH']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}