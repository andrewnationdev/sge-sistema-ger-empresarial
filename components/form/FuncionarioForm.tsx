import React, { useState, useEffect } from 'react';
import { IFuncionario, IUsuario } from '../../types/usuario';
import { throwMessage } from '../../utils/toast';

interface FuncionarioFormProps {
    onSubmit: (data: Partial<IFuncionario>) => void;
    onCancel: () => void;
    mode: 'create' | 'edit' | 'view';
    initialData?: IFuncionario | null;
}

export default function FuncionarioForm({ onSubmit, onCancel, mode, initialData }: FuncionarioFormProps) {
    const [users, setUsers] = useState<IUsuario[]>([]);
    const [selected_user_id, setSelectedUserId] = useState<number | null>(null);
    const [form_data, setFormData] = useState<Partial<IFuncionario>>({
        nome: '',
        sobrenome: '',
        cargo: '',
        departamento: '',
        email: '',
        telefone: '',
        data_contratacao: '',
        usuario_id: null,
        ativo: true,
    });
    const [loading_users, setLoadingUsers] = useState(true);
    const [users_error, setUsersError] = useState<string | null>(null);
    const [is_submitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            setLoadingUsers(true);
            setUsersError(null);
            const token = localStorage.getItem('token');
            if (!token) {
                setUsersError('Não autenticado para buscar usuários.');
                setLoadingUsers(false);
                return;
            }
            try {
                const response = await fetch('/api/usuarios', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) {
                    const error_data = await response.json();
                    throw new Error(error_data.message || 'Falha ao buscar usuários.');
                }
                const data: IUsuario[] = await response.json();
                setUsers(data);
            } catch (err: any) {
                console.error('Erro ao buscar usuários:', err);
                setUsersError(err.message || 'Não foi possível carregar a lista de usuários.');
            } finally {
                setLoadingUsers(false);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                data_contratacao: initialData.data_contratacao ? new Date(initialData.data_contratacao).toISOString().split('T')[0] : '',
                usuario_id: initialData.usuario_id || null,
            });
            setSelectedUserId(initialData.usuario_id || null);
        } else if (mode === 'create') {
            setFormData({
                nome: '',
                sobrenome: '',
                cargo: '',
                departamento: '',
                email: '',
                telefone: '',
                data_contratacao: '',
                usuario_id: null,
                ativo: true,
            });
            setSelectedUserId(null);
        }
    }, [initialData, mode]);

    useEffect(() => {
        if (mode === 'create' && selected_user_id) {
            const user = users.find(u => u.id === selected_user_id);
            if (user) {
                setFormData(prev_data => ({
                    ...prev_data,
                    nome: user.nome_usuario.split(' ')[0] || '',
                    sobrenome: user.nome_usuario.split(' ').slice(1).join(' ') || '',
                    email: user.email || '',
                    usuario_id: user.id,
                }));
            }
        } else if (mode === 'create' && !selected_user_id) {
            setFormData(prev_data => ({
                ...prev_data,
                nome: '',
                sobrenome: '',
                email: '',
                usuario_id: null,
            }));
        }
    }, [selected_user_id, users, mode]);

    const handle_change = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let newValue: any = value;
        if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
            newValue = e.target.checked;
        } else if (type === 'number') {
            newValue = value === '' ? null : Number(value);
        }
        setFormData((prev_data) => ({
            ...prev_data,
            [name]: newValue,
        }));
    };

    const handle_user_select_change = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const user_id = e.target.value === '' ? null : Number(e.target.value);
        setSelectedUserId(user_id);
    };

    const handle_submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(form_data);
        } finally {
            setIsSubmitting(false);
        }
    };

    const is_disabled = mode === 'view' || is_submitting;
    const is_active_disabled = mode === 'view' || mode === 'create' || is_submitting;

    return (
        <form onSubmit={handle_submit} style={{ maxHeight: "500px", overflowY: "auto", paddingRight: "15px" }}>
            {mode === 'create' && (
                <div className="mb-3">
                    <label htmlFor="select_user" className="form-label">Selecionar Usuário:</label>
                    {loading_users ? (
                        <p>Carregando usuários...</p>
                    ) : users_error ? (
                        <div className="alert alert-danger">{users_error}</div>
                    ) : (
                        <select
                            className="form-select rounded-pill"
                            id="select_user"
                            value={selected_user_id || ''}
                            onChange={handle_user_select_change}
                            required
                            disabled={is_disabled}
                        >
                            <option value="">-- Selecione um usuário --</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.nome_usuario} ({user.email})
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            )}

            <div className="mb-3">
                <label htmlFor="nome" className="form-label">Nome:</label>
                <input
                    type="text"
                    className="form-control rounded-pill"
                    id="nome"
                    name="nome"
                    value={form_data.nome || ''}
                    onChange={handle_change}
                    required
                    disabled={is_disabled}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="sobrenome" className="form-label">Sobrenome:</label>
                <input
                    type="text"
                    className="form-control rounded-pill"
                    id="sobrenome"
                    name="sobrenome"
                    value={form_data.sobrenome || ''}
                    onChange={handle_change}
                    required
                    disabled={is_disabled}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email:</label>
                <input
                    type="email"
                    className="form-control rounded-pill"
                    id="email"
                    name="email"
                    value={form_data.email || ''}
                    onChange={handle_change}
                    disabled={is_disabled}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="cargo" className="form-label">Cargo:</label>
                <input
                    type="text"
                    className="form-control rounded-pill"
                    id="cargo"
                    name="cargo"
                    value={form_data.cargo || ''}
                    onChange={handle_change}
                    disabled={is_disabled}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="departamento" className="form-label">Departamento:</label>
                <input
                    type="text"
                    className="form-control rounded-pill"
                    id="departamento"
                    name="departamento"
                    value={form_data.departamento || ''}
                    onChange={handle_change}
                    disabled={is_disabled}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="telefone" className="form-label">Telefone:</label>
                <input
                    type="text"
                    className="form-control rounded-pill"
                    id="telefone"
                    name="telefone"
                    value={form_data.telefone || ''}
                    onChange={handle_change}
                    disabled={is_disabled}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="data_contratacao" className="form-label">Data de Contratação:</label>
                <input
                    type="date"
                    className="form-control rounded-pill"
                    id="data_contratacao"
                    name="data_contratacao"
                    value={form_data.data_contratacao || ''}
                    onChange={handle_change}
                    disabled={is_disabled}
                />
            </div>

            {(mode === 'edit' || mode === 'view') && (
                <div className="form-check mb-3">
                    <input
                        type="checkbox"
                        className="form-check-input rounded-pill"
                        id="ativo"
                        name="ativo"
                        checked={!!form_data.ativo}
                        onChange={handle_change}
                        disabled={is_active_disabled}
                    />
                    <label className="form-check-label" htmlFor="ativo">
                        Ativo
                    </label>
                </div>
            )}

            <div className="d-flex justify-content-end gap-2 mt-4">
                {mode === 'view' ? (
                    <button type="button" className="btn btn-primary" onClick={() => {
                        throwMessage('Para editar, reabra a modal no modo de edição.');
                        onCancel();
                    }}>OK</button>
                ) : (
                    <>
                        <button type="button" className="btn btn-secondary rounded-pill" onClick={onCancel} disabled={is_submitting}>Cancelar</button>
                        <button type="submit" className="btn btn-success rounded-pill" disabled={is_submitting}>
                            {is_submitting ? 'Salvando...' : (mode === 'create' ? 'Cadastrar Funcionário' : 'Atualizar Funcionário')}
                        </button>
                    </>
                )}
            </div>
        </form>
    );
}