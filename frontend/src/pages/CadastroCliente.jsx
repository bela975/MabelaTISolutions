import { useState } from "react";
import Header from "../components/Header";
import Feedback from "../components/Feedback";
import { postData } from "../services/api";
import { isValidEmail, isStrongPassword, isAdult } from "../utils/validations";

export default function CadastroCliente() {
  const [form, setForm] = useState({
    nome: "",
    login: "",
    senha: "",
    confirmarSenha: "",
    cpf: "",
    dataNascimento: "",
    telefone: "",
    escolaridade: "",
    estadoCivil: "",
  });

  const [feedback, setFeedback] = useState("");
  const [type, setType] = useState("error");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validar() {
    if (!form.nome.trim()) return "O nome deve ser preenchido.";
    if (!form.login.trim()) return "O login/e-mail deve ser preenchido.";
    if (!isValidEmail(form.login)) return "O login deve ter formato de e-mail válido.";
    if (!form.senha) return "A senha deve ser preenchida.";

    const senhaErro = isStrongPassword(form.senha);
    if (senhaErro) return senhaErro;

    if (!form.confirmarSenha) return "A confirmação de senha deve ser preenchida.";
    if (form.senha !== form.confirmarSenha) return "A confirmação deve ser igual à senha.";

    if (!form.cpf.trim()) return "O CPF deve ser preenchido.";
    if (!form.dataNascimento) return "A data de nascimento deve ser preenchida.";
    if (!isAdult(form.dataNascimento)) return "O cliente deve ser maior de idade.";
    if (!form.escolaridade.trim()) return "A escolaridade deve ser preenchida.";
    if (!form.estadoCivil.trim()) return "O estado civil deve ser preenchido.";

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

    const dadosCliente = {
      nome: form.nome,
      login: form.login,
      senha: form.senha,
      cpf: form.cpf,
      dataNascimento: form.dataNascimento,
      telefone: form.telefone,
      escolaridade: form.escolaridade,
      estadoCivil: form.estadoCivil,
    };

    const result = await postData("/clientes", dadosCliente);

    setType(result.sucesso ? "success" : "error");
    setFeedback(result.mensagem);
  }

  return (
    <div className="page-shell">
      <Header title="Cadastro de clientes" subtitle="Preencha os dados cadastrais." />

      <main className="main-inner">
        <section className="card register-card">
          <h2>Formulário de novo cliente</h2>

          <form onSubmit={handleSubmit} className="form-grid">
            <div className="two-col">
              <div className="field-group">
                <label>Nome</label>
                <input name="nome" value={form.nome} onChange={handleChange} />
              </div>

              <div className="field-group">
                <label>E-mail / Login</label>
                <input name="login" type="email" value={form.login} onChange={handleChange} />
              </div>
            </div>

            <div className="two-col">
              <div className="field-group">
                <label>Senha</label>
                <input name="senha" type="password" value={form.senha} onChange={handleChange} />
              </div>

              <div className="field-group">
                <label>Confirmar senha</label>
                <input
                  name="confirmarSenha"
                  type="password"
                  value={form.confirmarSenha}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="two-col">
              <div className="field-group">
                <label>CPF</label>
                <input name="cpf" value={form.cpf} onChange={handleChange} />
              </div>

              <div className="field-group">
                <label>Data de nascimento</label>
                <input
                  name="dataNascimento"
                  type="date"
                  value={form.dataNascimento}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="two-col">
              <div className="field-group">
                <label>Telefone</label>
                <input name="telefone" value={form.telefone} onChange={handleChange} />
              </div>

              <div className="field-group">
                <label>Escolaridade</label>
                <select name="escolaridade" value={form.escolaridade} onChange={handleChange}>
                  <option value="">Selecione</option>
                  <option value="1º grau incompleto">1º grau incompleto</option>
                  <option value="1º grau completo">1º grau completo</option>
                  <option value="2º grau completo">2º grau completo</option>
                  <option value="Superior">Superior</option>
                  <option value="Pós-graduação">Pós-graduação</option>
                </select>
              </div>
            </div>

            <div className="field-group">
              <label>Estado civil</label>
              <select name="estadoCivil" value={form.estadoCivil} onChange={handleChange}>
                <option value="">Selecione</option>
                <option value="Solteiro(a)">Solteiro(a)</option>
                <option value="Casado(a)">Casado(a)</option>
                <option value="Divorciado(a)">Divorciado(a)</option>
                <option value="Viúvo(a)">Viúvo(a)</option>
              </select>
            </div>

            <Feedback message={feedback} type={type} />

            <div className="button-row">
              <button className="btn btn-primary" type="submit">Cadastrar</button>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => {
                  setForm({
                    nome: "",
                    login: "",
                    senha: "",
                    confirmarSenha: "",
                    cpf: "",
                    dataNascimento: "",
                    telefone: "",
                    escolaridade: "",
                    estadoCivil: "",
                  });
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