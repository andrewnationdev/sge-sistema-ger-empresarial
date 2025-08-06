import React from 'react';
import FuncionarioForm from './FuncionarioForm';
import { FuncionarioModalProps } from '../../types/forms';

export default function FuncionarioModal({ onClose, onSave, mode, funcionarioToEdit }: FuncionarioModalProps) {
  const getTitle = () => {
    switch (mode) {
      case 'create': return 'Cadastrar Novo Funcionário';
      case 'edit': return 'Editar Funcionário';
      case 'view': return 'Detalhes do Funcionário';
      default: return 'Funcionário';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '8px',
        width: '600px',
        maxWidth: '90%',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        maxHeight: '90vh',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            fontSize: '1.8rem',
            cursor: 'pointer',
            color: '#666'
          }}
        >
          &times;
        </button>
        <h2 className="mb-4">{getTitle()}</h2>
        <FuncionarioForm
          onSubmit={onSave}
          onCancel={onClose}
          mode={mode}
          initialData={funcionarioToEdit}
        />
      </div>
    </div>
  );
}