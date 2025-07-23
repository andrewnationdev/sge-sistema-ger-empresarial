import Icon from "./Icon";

interface IGlobalHeader {
  userName: string;
  handleLogout: () => {};
}

export default function GlobalHeader(props) {
  return (<nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
    <div className="container-fluid">
      <a className="navbar-brand" href="/dashboard">
        <Icon name="building" marginRight="1rem" />
        Sistema de Gerenciamento Empresarial</a>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <a className="nav-link active" aria-current="page" href="/dashboard">
              <Icon name="house" marginRight="0.5rem" />
              Início</a>
          </li>
          <li className="nav-item">
            <a className="nav-link active" aria-current="page" href="/funcionarios">
              <Icon name="person-vcard" marginRight="0.5rem" />
              Funcionários</a>
          </li>
          <li className="nav-item">
            <a className="nav-link active" href="/projetos">
              <Icon name="kanban" marginRight="0.5rem" />
              Projetos</a>
          </li>
          <li className="nav-item">
            <a className="nav-link active" href="/relatorios">
              <Icon name="graph-up-arrow" marginRight="0.5rem" />
              Relatórios</a>
          </li>
        </ul>
        <div className="d-flex align-items-center">
          {props.userName && (
            <span className="navbar-text text-white me-3">
              <Icon name="person" marginRight="0.5rem" />
              Olá, {props.userName}!
            </span>
          )}
          <button className="btn btn-outline-light" onClick={props.handleLogout}>
            <Icon name="box-arrow-right" marginRight="0.5rem" />
            Sair
          </button>
        </div>
      </div>
    </div>
  </nav>)
}