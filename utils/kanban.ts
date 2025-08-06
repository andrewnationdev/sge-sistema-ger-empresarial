import { IColorCard } from "../types/kanban";

const ColorMaping = {
    "A FAZER": {
        "ALTA": "warning",
        "MEDIA": "secondary",
        "BAIXA": "light"
    },
    "EM ANDAMENTO": {
        "ALTA": "danger",
        "MEDIA": "warning",
        "BAIXA": "warning"
    },
    "CONCLUIDO": {
        "ALTA": "success",
        "MEDIA": "success",
        "BAIXA": "success"
    },
}

export function getCardColorFromStatus(props:IColorCard){
    return ColorMaping[props.status] ? ColorMaping[props.status][props.prioridade] : '';
}