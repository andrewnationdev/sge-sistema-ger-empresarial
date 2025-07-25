import { ITarefa } from "../types/kanban";
import React, { useEffect, useState } from "react";
import { getCardColorFromStatus } from "../utils/kanban";
import formatDate from "../utils/dateFormat";
import { getNomeFuncionarioById } from "../utils/funcionario";

export default function KanbanCard({ card, onClick }: { card: ITarefa, onClick: () => {} }) {
  const [funcionario, setFuncionario] = useState(null);

  useEffect(() => {
    async function fetchFuncionario() {
      let nome_funcionario = await getNomeFuncionarioById(card.responsavel_funcionario_id);

      if (nome_funcionario) setFuncionario(nome_funcionario);
    }
    fetchFuncionario();
  }, [])

  return (
    <div className={`card text-bg-${getCardColorFromStatus({ status: card.status, prioridade: card.prioridade })} mb-3`} onClick={onClick}>
      <div className="card-header">
        {card.titulo} <br />
        <small>Concluir até: {formatDate(card.data_vencimento)}</small>
      </div>
      <div className="card-body">
        {card.descricao}
      </div>
      {funcionario && <div className="card-footer">
        <small>Criado por <strong>{funcionario}</strong> em <em>{formatDate(card.data_criacao)}</em></small>
      </div>}
    </div>

  )
}