export interface IFuncionario {
  id: number;
  nome: string;
  sobrenome: string;
  ativo?:boolean;
}

export interface FuncionarioModalProps {
  onClose: () => void;
  onSave: (data: Partial<IFuncionario>) => void;
  mode: 'create' | 'edit' | 'view';
  funcionarioToEdit?: IFuncionario | null;
}