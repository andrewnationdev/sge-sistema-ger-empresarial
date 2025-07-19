import { ITarefa } from "../types/kanban";
import React from "react";
import { getCardColorFromStatus } from "../utils/kanban";

export default function KanbanCard(props: ITarefa) {
  return (
    <div className={`card text-bg-${getCardColorFromStatus({ status: props.status, prioridade: props.prioridade })} mb-3`}>
      <div className="card-header">
        {props.titulo}
      </div>
      <div className="card-body">
        Concluir até: {props.dataVencimento} <br />
        {props.descricao}
      </div>
      <div className="card-footer">
        Criado por <strong>{props.dataCriacao}</strong> em <em>{props.dataCriacao}</em>
      </div>
    </div>

  )
}