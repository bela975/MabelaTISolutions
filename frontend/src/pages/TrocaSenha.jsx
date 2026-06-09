import { useState } from "react";
import Header from "../components/Header";
import Feedback from "../components/Feedback";
import { postData } from "../services/api";
import { isValidEmail, isStrongPassword } from "../utils/validations";

export default function TrocaSenha() {
  const [login, setLogin] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [feedback, setFeedback] = useState("");
  const [type, setType] = useState("error");

  function validar() {
    if (!login.trim()) return "O login deve ser preenchido.";
    if (!isValidEmail(login)) return "O login deve ter formato de e-mail válido.";
    if (!senhaAtual) return "A senha atual deve ser preenchida.";
    if (!novaSenha) return "A nova senha deve ser preenchida.";

    const senhaErro = isStrongPassword(novaSenha);
    if (senhaErro) return senhaErro;

    if (!confirmarSenha) return "A confirmação de senha deve ser preenchida.";
    if (novaSenha !== confirmarSenha) return "A confirmação deve ser igual à nova senha.";

    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const erro = validar();

    if (erro) {
      setType("error");
      setFeedback(erro);
      return;
    }

    const result = await postData("/auth/trocar-senha", {
      login,
      senhaAtual,
      novaSenha,
    });

    setType(result.sucesso ? "success" : "error");
    setFeedback(result.mensagem);
  }

  return (
    <div className="page-shell">
      <Header title="Troca de senha" subtitle="Atualize sua senha com segurança." />

      <main className="main-inner">
        <section className="card password-card">
          <h2>Atualização de credenciais</h2>

          <form onSubmit={handleSubmit} className="form-grid">
            <div className="field-group">
              <label>Login / e-mail</label>
              <input type="email" value={login} onChange={(e) => setLogin(e.target.value)} />
            </div>

            <div className="field-group">
              <label>Senha atual</label>
              <input type="password" value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} />
            </div>

            <div className="field-group">
              <label>Nova senha</label>
              <input type="password" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} />
            </div>

            <div className="field-group">
              <label>Confirmar nova senha</label>
              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
              />
            </div>

            <Feedback message={feedback} type={type} />

            <div className="button-row">
              <button className="btn btn-primary" type="submit">Trocar senha</button>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => {
                  setLogin("");
                  setSenhaAtual("");
                  setNovaSenha("");
                  setConfirmarSenha("");
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