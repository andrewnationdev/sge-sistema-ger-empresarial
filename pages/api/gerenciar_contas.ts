import bcrypt from 'bcryptjs';
import pool from '../../db/db';

const saltRounds = 10;

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const { id } = req.query;
            const [rows] = await pool.query(
                'SELECT id, nome_usuario, email, data_registro FROM usuarios WHERE id = ?',
                [id]
            );
            if (Array.isArray(rows) && rows.length === 0) {
                return res.status(404).json({ message: 'Usuário não encontrado.' });
            }
            res.status(200).json(rows[0]);
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
        }
    } else if (req.method === 'PUT') {
        try {
            const { id } = req.query;
            const updates = req.body;

            if (!id) {
                return res.status(400).json({ message: 'ID do usuário é obrigatório para atualização.' });
            }
            if (Object.keys(updates).length === 0) {
                return res.status(400).json({ message: 'Nenhum dado fornecido para atualização.' });
            }

            const allowedFields = ['nome_usuario', 'email', 'nova_senha'];
            const setClauses = [];
            const values = [];
            for (const key in updates) {
                if (allowedFields.includes(key)) {
                    if (key === 'nova_senha') {
                        const senha_hash = await bcrypt.hash(updates[key], saltRounds);
                        setClauses.push('senha_hash = ?');
                        values.push(senha_hash);
                    } else {
                        setClauses.push(`${key} = ?`);
                        values.push(updates[key]);
                    }
                }
            }

            if (setClauses.length === 0) {
                return res.status(400).json({ message: 'Nenhum campo válido para atualização foi fornecido.' });
            }

            values.push(id);
            const [result] = await pool.execute(
                `UPDATE usuarios SET ${setClauses.join(', ')} WHERE id = ?`,
                values
            );
            // @ts-ignore
            if (result?.affectedRows === 0) {
                return res.status(404).json({ message: 'Usuário não encontrado ou nenhum dado alterado.' });
            }
            res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}