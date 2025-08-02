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

            if (Array.isArray(rows) && rows?.length === 0) {
                return res.status(404).json({ message: 'Usuário não encontrado.' });
            }

            return res.status(200).json(rows[0]);

        } else if (req.method === 'PUT') {
            const { nome_usuario, email, senha_antiga, nova_senha } = req.body;

            // Verifica se o usuário está tentando alterar a senha ou email
            if ((email || nova_senha) && !senha_antiga) {
                return res.status(400).json({ message: 'A senha antiga é obrigatória para alterar dados sensíveis.' });
            }

            // Se a senha antiga foi fornecida, comparar com o hash no banco.
            if (senha_antiga) {
                const [userRows] = await connection.execute(
                    'SELECT senha_hash FROM usuarios WHERE id = ?',
                    [id]
                );

                if (Array.isArray(userRows) && userRows.length === 0) {
                    return res.status(404).json({ message: 'Usuário não encontrado.' });
                }

                const storedHash = userRows[0].senha_hash;
                const match = await bcrypt.compare(senha_antiga, storedHash);

                if (!match) {
                    return res.status(401).json({ message: 'Senha antiga incorreta.' });
                }
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

            // Atualiza a senha só se uma nova senha for fornecida
            if (nova_senha) {
                const senha_hash = await bcrypt.hash(nova_senha, saltRounds);
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