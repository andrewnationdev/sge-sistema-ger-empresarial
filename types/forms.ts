import { IFuncionario } from "./usuario";

export interface FuncionarioModalProps {
  onClose: () => void;
  onSave: (data: Partial<IFuncionario>) => void;
  mode: 'create' | 'edit' | 'view';
  funcionarioToEdit?: IFuncionario | null;
}