export default function formatDate(date: string){
    let formatted = new Date(date)

    return formatted.toLocaleDateString("pt-BR");
}