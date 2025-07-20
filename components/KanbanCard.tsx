import { ITarefa } from "../types/kanban";
import React from "react";
import { getCardColorFromStatus } from "../utils/kanban";
import formatDate from "../utils/dateFormat";

export default function KanbanCard({ card, onClick }: { card: ITarefa, onClick: () => {} }) {
  return (
    <div className={`card text-bg-${getCardColorFromStatus({ status: card.status, prioridade: card.prioridade })} mb-3`} onClick={onClick}>
      <div className="card-header">
        {card.titulo} <br />
        <small>Concluir até: {formatDate(card.dataVencimento)}</small>
      </div>
      <div className="card-body">
        {card.descricao}
      </div>
      <div className="card-footer">
        <small>Criado por <strong>{"Funcionário"}</strong> em <em>{formatDate(card.dataCriacao)}</em></small>
      </div>
    </div>

  )
}