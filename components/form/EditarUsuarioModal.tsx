import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export const EditarUsuarioModal = ({ show, handleClose, userData, handleSave }) => {
  const [editedRole, setEditedRole] = useState('');

  useEffect(() => {
    if (userData) {
      setEditedRole(userData.permissao || '');
    }
  }, [userData]);

  const onSave = () => {
    handleSave(userData.id, editedRole);
    handleClose();
  };

  if (!userData) {
    return null;
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Usuário</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nome de Usuário:</Form.Label>
            <Form.Control type="text" value={userData.nome_usuario} readOnly />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>E-mail:</Form.Label>
            <Form.Control type="email" value={userData.email} readOnly />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Data de Contratação:</Form.Label>
            <Form.Control type="text" value={userData.data_registro} readOnly />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Permissões:</Form.Label>
            <Form.Select
              value={editedRole}
              onChange={(e) => setEditedRole(e.target.value)}
            >
              <option value="" disabled>Selecione uma função...</option>
              <option value="ADMIN">Administrador</option>
              <option value="USER">Usuário Padrão</option>
              <option value="READONLY">Somente Leitura</option>
              <option value="DESATIVADO">Login Desabilitado</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={onSave}>
          Salvar Alterações
        </Button>
      </Modal.Footer>
    </Modal>
  );
};