import React, { useState, useEffect } from 'react';
import { ITarefa } from '../../types/kanban';
import { IFuncionario } from '../../types/usuario';

async function getAllFuncionarios(): Promise<IFuncionario[]> {
  try {
    const response = await fetch('/api/funcionarios');
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
    }
    const funcionarios = await response.json();
    return funcionarios;
  } catch (error) {
    console.error('Erro ao buscar todos os funcionários:', error);
    return [];
  }
}

export default function TaskForm({ initialData, onSubmit, onDelete }: { initialData?: ITarefa | null, onSubmit: (data: Partial<ITarefa>) => void, onDelete: (id: string | number) => void }) {
  const [formData, setFormData] = useState<Partial<ITarefa>>({
    titulo: initialData?.titulo || '',
    descricao: initialData?.descricao || '',
    status: initialData?.status || 'A FAZER',
    prioridade: initialData?.prioridade || 'BAIXA',
    data_vencimento: initialData?.data_vencimento || '',
    criado_por_usuario_id: initialData?.criado_por_usuario_id || null,
    responsavel_funcionario_id: initialData?.responsavel_funcionario_id || null,
  });

  const [funcionarios, setFuncionarios] = useState<IFuncionario[]>([]);
  const [loadingFuncionarios, setLoadingFuncionarios] = useState(true);
  const [errorFuncionarios, setErrorFuncionarios] = useState<string | null>(null);

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

  useEffect(() => {
    async function fetchFuncionarios() {
      try {
        setLoadingFuncionarios(true);
        const data = await getAllFuncionarios();
        setFuncionarios(data.filter((f:IFuncionario) => f!.ativo));
      } catch (error: any) {
        setErrorFuncionarios(error.message);
      } finally {
        setLoadingFuncionarios(false);
      }
    }

    fetchFuncionarios();
  }, []); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: (name === 'responsavel_funcionario_id' || name === 'criado_por_usuario_id')
                ? (value === '' ? null : Number(value))
                : value,
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
          className="form-control rounded-pill"
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
          className="form-select rounded-pill"
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
          className="form-select rounded-pill"
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
          className="form-control rounded-pill"
          id="dataVencimento"
          name="data_vencimento"
          value={formData.data_vencimento || ''}
          onChange={handleChange}
        />
      </div>

      {/*<div className="mb-3">
        <label htmlFor="criadoPorUsuarioId" className="form-label">Criado Por (ID do Usuário):</label>
        <input
          type="number"
          className="form-control rounded-pill"
          id="criadoPorUsuarioId"
          name="criado_por_usuario_id"
          value={formData.criado_por_usuario_id === null ? '' : formData.criado_por_usuario_id}
          onChange={handleChange}
          placeholder="Opcional"
        />
      </div>*/}

      <div className="mb-3">
        <label htmlFor="responsavelFuncionarioId" className="form-label">Responsável (ID do Funcionário):</label>
        <select
          className="form-select rounded-pill"
          id="responsavelFuncionarioId"
          name="responsavel_funcionario_id"
          value={formData.responsavel_funcionario_id === null ? '' : formData.responsavel_funcionario_id}
          onChange={handleChange}
        >
          <option value="">Selecione um funcionário (Opcional)</option>
          {loadingFuncionarios ? (
            <option disabled>Carregando funcionários...</option>
          ) : errorFuncionarios ? (
            <option disabled>Erro ao carregar funcionários: {errorFuncionarios}</option>
          ) : (
            funcionarios.map((func) => (
              <option key={func.id} value={func.id}>
                {func.nome} {func.sobrenome}
              </option>
            ))
          )}
        </select>
      </div>
      <button type="submit" className="btn btn-primary rounded-pill">
        {initialData ? "Salvar Alterações" : "Adicionar Tarefa"}
      </button>
      {initialData && <button type="button" className="btn btn-danger rounded-pill" onClick={() => onDelete(initialData.id)}>
        Deletar Item
      </button>}
    </form>
  );
}