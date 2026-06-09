import { Link } from "react-router-dom";
import logo from "../assets/logo.svg";

export default function Header({ title, subtitle }) {
  const loggedUser = localStorage.getItem("login");

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="branding">
          <img className="logo" src={logo} alt="Logo da Mabela Serviços" />
          <div>
            <h1>{title}</h1>
            <p className="slogan">{subtitle}</p>
          </div>
        </div>

        <nav className="nav-links">
          <Link to="/">Apresentação</Link>
          <Link to="/login">Login</Link>
          <Link to="/cadastro">Cadastro</Link>
          <Link to="/troca-senha">Troca de senha</Link>
          <Link to="/cadastro-servico">Cadastrar serviço</Link>
          {loggedUser && <Link to="/carrinho">Solicitar serviços</Link>}
        </nav>
      </div>
    </header>
  );
}