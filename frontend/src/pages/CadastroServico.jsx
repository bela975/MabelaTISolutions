import { useState } from "react";
import Header from "../components/Header";
import Feedback from "../components/Feedback";
import { postData } from "../services/api";

export default function CadastroServico() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [prazoDias, setPrazoDias] = useState("");
  const [feedback, setFeedback] = useState("");
  const [type, setType] = useState("error");

  function validar() {
    if (!nome.trim()) return "O nome do serviço deve ser preenchido.";
    if (!descricao.trim()) return "A descrição do serviço deve ser preenchida.";
    if (!preco) return "O preço deve ser preenchido.";
    if (Number(preco) <= 0) return "O preço deve ser maior que zero.";
    if (!prazoDias) return "O prazo deve ser preenchido.";
    if (Number(prazoDias) <= 0) return "O prazo deve ser maior que zero.";
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

    const result = await postData("/servicos", {
      nome,
      descricao,
      preco: Number(preco),
      prazoDias: Number(prazoDias),
    });

    setType(result.sucesso ? "success" : "error");
    setFeedback(result.mensagem);

    if (result.sucesso) {
      setNome("");
      setDescricao("");
      setPreco("");
      setPrazoDias("");
    }
  }

  return (
    <div className="page-shell">
      <Header title="Cadastro de serviços de TI" subtitle="Cadastre novos serviços disponíveis." />

      <main className="main-inner">
        <section className="card">
          <h2>Novo serviço de TI</h2>

          <form onSubmit={handleSubmit} className="form-grid">
            <div className="field-group">
              <label>Nome do serviço</label>
              <input value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>

            <div className="field-group">
              <label>Descrição</label>
              <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} />
            </div>

            <div className="two-col">
              <div className="field-group">
                <label>Preço</label>
                <input type="number" min="0" value={preco} onChange={(e) => setPreco(e.target.value)} />
              </div>

              <div className="field-group">
                <label>Prazo em dias</label>
                <input
                  type="number"
                  min="1"
                  value={prazoDias}
                  onChange={(e) => setPrazoDias(e.target.value)}
                />
              </div>
            </div>

            <Feedback message={feedback} type={type} />

            <button className="btn btn-primary" type="submit">Salvar serviço</button>
          </form>
        </section>
      </main>
    </div>
  );
}