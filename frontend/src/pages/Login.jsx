import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Feedback from "../components/Feedback";
import { postData } from "../services/api";
import { isValidEmail } from "../utils/validations";

export default function Login() {
  const navigate = useNavigate();

  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [feedback, setFeedback] = useState("");
  const [type, setType] = useState("error");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!login.trim()) {
      setType("error");
      setFeedback("O login deve ser preenchido.");
      return;
    }

    if (!isValidEmail(login)) {
      setType("error");
      setFeedback("O login deve ter formato de e-mail válido.");
      return;
    }

    if (!senha) {
      setType("error");
      setFeedback("A senha deve ser preenchida.");
      return;
    }

    const result = await postData("/auth/login", { login, senha });

    if (result.autenticado) {
      localStorage.setItem("login", login);
      setType("success");
      setFeedback("Login realizado com sucesso.");
      navigate("/carrinho");
    } else {
      setType("error");
      setFeedback(result.mensagem || "Login inválido.");
    }
  }

  return (
    <div className="page-shell">
      <Header
        title="Login de clientes"
        subtitle="Entre com seu e-mail e senha para acessar a área de serviços."
      />

      <main className="main-inner">
        <section className="card auth-card">
          <h2>Autenticação do cliente</h2>

          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="field-group">
              <label>Login / e-mail</label>
              <input
                type="email"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="cliente@exemplo.com"
              />
            </div>

            <div className="field-group">
              <label>Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite sua senha"
              />
            </div>

            <Feedback message={feedback} type={type} />

            <div className="button-row">
              <button className="btn btn-primary" type="submit">
                Realizar Login
              </button>

              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => {
                  setLogin("");
                  setSenha("");
                  setFeedback("");
                }}
              >
                Limpar
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}