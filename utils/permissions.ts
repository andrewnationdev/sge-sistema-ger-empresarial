export async function fetchPermissoes(id: string) {
    const req = await fetch(`/api/permissoes?id=${id}`);
    if (!req.ok) {
        throw new Error('Permissão não encontrada');
    }
    const data = await req.json();

    return data.user_role;
}

export async function fetchAllPermissoes() {
    const req = await fetch(`/api/permissoes`);
    if (!req.ok) {
        throw new Error('Permissão não encontrada');
    }
    const data = await req.json();
    return data;
}


export type IPermissao = 'ADMIN' | 'USER' | 'DESATIVADO' | 'READONLY' | '';

export function getIdFromPermissao(permissao: IPermissao): string {
    switch (permissao) {
        case 'ADMIN':
            return 'Administrador';
        case 'USER':
            return 'Usuário';
        case 'DESATIVADO':
            return 'Desativado';
        case 'READONLY':
            return 'Somente Leitura';
        default:
            return '???'
    }
}