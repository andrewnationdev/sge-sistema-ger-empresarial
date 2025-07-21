import React, { useState, useEffect } from 'react';
import { ITarefa } from '../../types/kanban';

export default function TaskForm({ initialData, onSubmit }: { initialData?: ITarefa | null, onSubmit: (data: Partial<ITarefa>) => void }) {
  const [formData, setFormData] = useState<Partial<ITarefa>>({
    titulo: initialData?.titulo || '',
    descricao: initialData?.descricao || '',
    status: initialData?.status || 'A FAZER',
    prioridade: initialData?.prioridade || 'BAIXA',
    data_vencimento: initialData?.data_vencimento || '',
    criado_por_usuario_id: initialData?.criado_por_usuario_id || null,
    responsavel_funcionario_id: initialData?.responsavel_funcionario_id || null,
  });

  useEffect(() => {
    setFormData({
      titulo: initialData?.titulo || '',
      descricao: initialData?.descricao || '',
      status: initialData?.status || 'A FAZER',
      prioridade: initialData?.prioridade || 'BAIXA',
      data_vencimento: initialData?.data_vencimento || '',
      criado_por_usuario_id: initialData?.criado_por_usuario_id || null,
      responsavel_funcionario_id: initialData?.responsavel_funcionario_id || null,
    });
  }, [initialData]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setFormData((prevData) => ({
      ...prevData,

      [name]: type === 'number' ? (value === '' ? null : Number(value)) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dados do Formulário:', formData);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxHeight: "450px", overflowY: "scroll" }}>
      <div className="mb-3">
        <label htmlFor="titulo" className="form-label">Título da Tarefa:</label>
        <input
          type="text"
          className="form-control"
          id="titulo"
          name="titulo"
          value={formData.titulo || ''}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="descricao" className="form-label">Descrição:</label>
        <textarea
          className="form-control"
          id="descricao"
          name="descricao"
          rows={3}
          value={formData.descricao || ''}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="mb-3">
        <label htmlFor="status" className="form-label">Status:</label>
        <select
          className="form-select"
          id="status"
          name="status"
          value={formData.status || 'A FAZER'}
          onChange={handleChange}
          required
        >
          <option value="A FAZER">A Fazer</option>
          <option value="EM ANDAMENTO">Em Andamento</option>
          <option value="CONCLUIDO">Concluído</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="prioridade" className="form-label">Prioridade:</label>
        <select
          className="form-select"
          id="prioridade"
          name="prioridade"
          value={formData.prioridade || 'BAIXA'}
          onChange={handleChange}
          required
        >
          <option value="BAIXA">Baixa</option>
          <option value="MEDIA">Média</option>
          <option value="ALTA">Alta</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="dataVencimento" className="form-label">Data de Vencimento:</label>
        <input
          type="date"
          className="form-control"
          id="dataVencimento"
          name="data_vencimento"
          value={formData.data_vencimento || ''}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="criadoPorUsuarioId" className="form-label">Criado Por (ID do Usuário):</label>
        <input
          type="number"
          className="form-control"
          id="criadoPorUsuarioId"
          name="criado_por_usuario_id"
          value={formData.criado_por_usuario_id === null ? '' : formData.criado_por_usuario_id}
          onChange={handleChange}
          placeholder="Opcional"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="responsavelFuncionarioId" className="form-label">Responsável (ID do Funcionário):</label>
        <input
          type="number"
          className="form-control"
          id="responsavelFuncionarioId"
          name="responsavel_funcionario_id"
          value={formData.responsavel_funcionario_id === null ? '' : formData.responsavel_funcionario_id}
          onChange={handleChange}
          placeholder="Opcional"
        />
      </div>
      <button type="submit" className="btn btn-primary">
        {initialData ? "Salvar Alterações" : "Adicionar Tarefa"}
      </button>
      {initialData && <button className="btn btn-danger">
        Deletar Item
        </button>}
    </form>
  );
}