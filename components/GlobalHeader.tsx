import Icon from "./Icon";
import { Navbar, Nav, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

interface IGlobalHeader {
  userName: string;
  handleLogout?: () => void;
  handleAccountPage?: () => void;
  isDashboard?: boolean;
}

export default function GlobalHeader(props: IGlobalHeader) {
  return (
    <Navbar expand="lg" variant="dark" bg="primary" sticky="top">
      <Container fluid>
        <Navbar.Brand href="/dashboard">
          <Icon name="building" marginRight="1rem" />
          Sistema de Gerenciamento Empresarial
        </Navbar.Brand>
        {props.userName != "" && <>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto mb-2 mb-lg-0">
              <Nav.Link href="/dashboard" className="active">
                <Icon name="house" marginRight="0.5rem" />
                Início
              </Nav.Link>
              <Nav.Link href="/funcionarios" className="active">
                <Icon name="person-vcard" marginRight="0.5rem" />
                Funcionários
              </Nav.Link>
              <Nav.Link href="/projetos" className="active">
                <Icon name="kanban" marginRight="0.5rem" />
                Projetos
              </Nav.Link>
              <Nav.Link href="/relatorios" className="active">
                <Icon name="graph-up-arrow" marginRight="0.5rem" />
                Relatórios
              </Nav.Link>
              <Nav.Link href="/admin" className="active">
                <Icon name="graph-up-arrow" marginRight="0.5rem" />
                Admin
              </Nav.Link>
            </Nav>
            <Nav>
              {props.userName && (
                <Nav.Link as="button" className="btn btn-dark me-2 active" onClick={props.handleAccountPage}>
                  <Icon name="person" marginRight="0.5rem" />
                  Olá, {props.userName}!
                </Nav.Link>
              )}
              <Nav.Link as="button" className="btn btn-danger active" onClick={props.handleLogout}>
                <Icon name="box-arrow-right" marginRight="0.5rem" />
                Sair
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </>}
      </Container>
    </Navbar>
  );
}