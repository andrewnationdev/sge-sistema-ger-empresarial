export interface IUsuario {
  id: number;
  nome_usuario: string;
  email: string;
}

export interface IFuncionario {
  id: number;
  nome: string;
  sobrenome: string;
  cargo: string | null;
  departamento: string | null;
  email: string | null; 
  telefone: string | null;
  data_contratacao: string | null;
  ativo?: boolean;
  usuario_id: number | null;
  usuarioNome?: string;
}