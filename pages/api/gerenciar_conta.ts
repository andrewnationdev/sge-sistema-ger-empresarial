import bcrypt from 'bcrypt';
import pool from '../../db/db';

const saltRounds = 10;

export default async function handler(req, res) {
    const { id } = req.query;

    let connection;
    try {
        connection = await pool.getConnection();

        if (req.method === 'GET') {
            const [rows] = await connection.execute(
                'SELECT id, nome_usuario, email, data_registro FROM usuarios WHERE id = ?',
                [id]
            );

            if (rows.length === 0) {
                return res.status(404).json({ message: 'Usuário não encontrado.' });
            }

            return res.status(200).json(rows[0]);

        } else if (req.method === 'PUT') {
            const { nome_usuario, email, senha } = req.body;

            if (!nome_usuario && !email && !senha) {
                return res.status(400).json({ message: 'Nenhum dado para atualização fornecido.' });
            }

            let updateFields = [];
            let updateValues = [];

            if (nome_usuario) {
                updateFields.push('nome_usuario = ?');
                updateValues.push(nome_usuario);
            }

            if (email) {
                updateFields.push('email = ?');
                updateValues.push(email);
            }

            if (senha) {
                const senha_hash = await bcrypt.hash(senha, saltRounds);
                updateFields.push('senha_hash = ?');
                updateValues.push(senha_hash);
            }

            if (updateFields.length === 0) {
                return res.status(400).json({ message: 'Nenhum campo válido para atualização fornecido.' });
            }

            const query = `UPDATE usuarios SET ${updateFields.join(', ')} WHERE id = ?`;
            updateValues.push(id);

            const [result] = await connection.execute(query, updateValues);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Usuário não encontrado.' });
            }

            return res.status(200).json({ message: 'Usuário atualizado com sucesso.' });

        } else {
            res.setHeader('Allow', ['GET', 'PUT']);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error('Erro ao processar requisição:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            if (error.sqlMessage.includes('email')) {
                return res.status(409).json({ message: 'Este e-mail já está em uso.' });
            }
            if (error.sqlMessage.includes('nome_usuario')) {
                return res.status(409).json({ message: 'Este nome de usuário já está em uso.' });
            }
        }
        return res.status(500).json({ message: 'Erro interno do servidor ao processar requisição.', error: error.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
}
