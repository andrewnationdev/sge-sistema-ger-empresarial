// components/TarefaForm.js

import React, { useState, useEffect } from 'react';
import { ITarefa } from '../../types/kanban';

// Você pode passar valores iniciais para o formulário, úteis para edição
// Por exemplo: <TarefaForm initialData={tarefaExistente} onSubmit={handleSave} />
export default function EditTaskForm({ initialData = {
    id: 0,
    titulo: '',
    descricao: '',
    status: 'A FAZER',
    prioridade: 'BAIXA',
    dataCriacao: '',
    dataVencimento: '',
    criadoPorUsuarioId: 0,
    responsavelFuncionarioId: 0
}, onSubmit } : {initialData: ITarefa, onSubmit: () => {}}) {
  const [formData, setFormData] = useState({
    titulo: initialData.titulo || '',
    descricao: initialData.descricao || '',
    status: initialData.status || 'A FAZER', // Valor padrão
    prioridade: initialData.prioridade || 'BAIXA', // Valor padrão
    dataVencimento: initialData.dataVencimento || '', // Formato YYYY-MM-DD
    criadoPorUsuarioId: initialData.criadoPorUsuarioId || '', // Pode ser nulo, então string vazia
    responsavelFuncionarioId: initialData.responsavelFuncionarioId || '', // Pode ser nulo, então string vazia
  });

  // Este useEffect garante que se `initialData` mudar (ex: ao editar um novo item),
  // o formulário seja redefinido com os novos dados.
  useEffect(() => {
    if (initialData) {
      setFormData({
        titulo: initialData.titulo || '',
        descricao: initialData.descricao || '',
        status: initialData.status || 'A FAZER',
        prioridade: initialData.prioridade || 'BAIXA',
        dataVencimento: initialData.dataVencimento || '',
        criadoPorUsuarioId: initialData.criadoPorUsuarioId || '',
        responsavelFuncionarioId: initialData.responsavelFuncionarioId || '',
      });
    }
  }, [initialData]);


  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      // Converte para número se for um input do tipo 'number'
      [name]: type === 'number' ? (value === '' ? null : Number(value)) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode adicionar validações antes de enviar
    console.log('Dados do Formulário:', formData);
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}  style={{maxHeight: "450px", overflowY: "scroll"}}>
      <div className="mb-3">
        <label htmlFor="titulo" className="form-label">Título da Tarefa:</label>
        <input
          type="text"
          className="form-control"
          id="titulo"
          name="titulo"
          value={formData.titulo}
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
          rows="3"
          value={formData.descricao}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="mb-3">
        <label htmlFor="status" className="form-label">Status:</label>
        <select
          className="form-select"
          id="status"
          name="status"
          value={formData.status}
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
          value={formData.prioridade}
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
          name="dataVencimento"
          value={formData.dataVencimento}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="criadoPorUsuarioId" className="form-label">Criado Por (ID do Usuário):</label>
        <input
          type="number"
          className="form-control"
          id="criadoPorUsuarioId"
          name="criadoPorUsuarioId"
          value={formData.criadoPorUsuarioId === null ? '' : formData.criadoPorUsuarioId}
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
          name="responsavelFuncionarioId"
          value={formData.responsavelFuncionarioId === null ? '' : formData.responsavelFuncionarioId}
          onChange={handleChange}
          placeholder="Opcional"
        />
      </div>

      <button type="submit" className="btn btn-primary">Salvar Tarefa</button>
    </form>
  );
}