import { useEffect, useState } from "react";
import Header from "../components/Header";
import Feedback from "../components/Feedback";
import { getData, putData } from "../services/api";
import { addDays, formatDateBR, formatMoney } from "../utils/validations";

export default function Carrinho() {
  const [servicos, setServicos] = useState([]);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [servicoSelecionado, setServicoSelecionado] = useState("");
  const [feedback, setFeedback] = useState("");
  const [type, setType] = useState("success");

  const login = localStorage.getItem("login");

  useEffect(() => {
    carregarServicos();
    carregarSolicitacoes();
  }, []);

  async function carregarServicos() {
    const result = await getData("/servicos");

    if (result.sucesso) {
      setServicos(result.servicos);
      if (result.servicos.length > 0) {
        setServicoSelecionado(String(result.servicos[0].id));
      }
    }
  }

  async function carregarSolicitacoes() {
    if (!login) return;

    const result = await getData(`/solicitacoes/${login}`);

    if (result.sucesso) {
      const lista = result.solicitacoes.map((item) => ({
        id: item.id,
        servicoId: item.servico_id,
        servicoNome: item.servico_nome,
        preco: item.preco,
        prazoDias: item.prazo_dias,
        status: item.status,
        dataPedido: item.data_pedido?.split("T")[0] || item.data_pedido,
        dataPrevista: item.data_prevista?.split("T")[0] || item.data_prevista,
      }));

      setSolicitacoes(lista);
    }
  }

  function adicionarSolicitacao() {
    const servico = servicos.find((item) => String(item.id) === servicoSelecionado);

    if (!servico) return;

    const hoje = new Date().toISOString().split("T")[0];
    const prevista = addDays(hoje, servico.prazo_dias);

    const novaSolicitacao = {
      id: crypto.randomUUID(),
      servicoId: servico.id,
      servicoNome: servico.nome,
      preco: servico.preco,
      prazoDias: servico.prazo_dias,
      status: "EM ELABORAÇÃO",
      dataPedido: hoje,
      dataPrevista: prevista,
    };

    setSolicitacoes([...solicitacoes, novaSolicitacao]);
    setFeedback("");
  }

  function excluirSolicitacao(id) {
    setSolicitacoes(solicitacoes.filter((item) => item.id !== id));
  }

  async function atualizarSolicitacoes() {
    if (!login) {
      setType("error");
      setFeedback("Você precisa estar logado para atualizar as solicitações.");
      return;
    }

    const payload = {
      login,
      solicitacoes: solicitacoes.map((item) => ({
        servicoId: item.servicoId,
        dataPedido: item.dataPedido,
        status: item.status,
        dataPrevista: item.dataPrevista,
      })),
    };

    const result = await putData("/solicitacoes", payload);

    setType(result.sucesso ? "success" : "error");
    setFeedback(result.mensagem);

    if (result.sucesso) {
      carregarSolicitacoes();
    }
  }

  const servicoAtual = servicos.find((item) => String(item.id) === servicoSelecionado);

  return (
    <div className="page-shell">
      <Header
        title="Solicitação de serviços de TI"
        subtitle="Gerencie as solicitações do usuário logado."
      />

      <main className="main-inner">
        <section className="card cart-card layout-stack">
          <article className="summary-box">
            <p className="kicker">Usuário logado</p>
            <div className="meta-row">
              <span><strong>Login:</strong> {login || "Nenhum usuário logado"}</span>
            </div>
          </article>

          <article>
            <p className="kicker">Solicitações já realizadas</p>

            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Data do pedido</th>
                    <th>Serviço de TI</th>
                    <th>Status</th>
                    <th>Preço</th>
                    <th>Data prevista</th>
                    <th>Ação</th>
                  </tr>
                </thead>

                <tbody>
                  {solicitacoes.map((item) => (
                    <tr key={item.id}>
                      <td>{formatDateBR(item.dataPedido)}</td>
                      <td>{item.servicoNome}</td>
                      <td>{item.status}</td>
                      <td>{formatMoney(item.preco)}</td>
                      <td>{formatDateBR(item.dataPrevista)}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => excluirSolicitacao(item.id)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}

                  {solicitacoes.length === 0 && (
                    <tr>
                      <td colSpan="6">Nenhuma solicitação cadastrada.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </article>

          <article className="page-grid">
            <div className="card">
              <p className="kicker">Nova solicitação</p>

              <div className="form-grid">
                <div className="field-group">
                  <label>Serviço de TI</label>
                  <select
                    value={servicoSelecionado}
                    onChange={(e) => setServicoSelecionado(e.target.value)}
                  >
                    {servicos.map((servico) => (
                      <option key={servico.id} value={servico.id}>
                        {servico.nome}
                      </option>
                    ))}
                  </select>
                </div>

                {servicoAtual && (
                  <div className="three-col">
                    <div className="field-group">
                      <label>Preço</label>
                      <output>{formatMoney(servicoAtual.preco)}</output>
                    </div>

                    <div className="field-group">
                      <label>Prazo</label>
                      <output>{servicoAtual.prazo_dias} dias</output>
                    </div>

                    <div className="field-group">
                      <label>Status</label>
                      <output>EM ELABORAÇÃO</output>
                    </div>
                  </div>
                )}

                <div className="button-row">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={adicionarSolicitacao}
                  >
                    Incluir solicitação
                  </button>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={atualizarSolicitacoes}
                  >
                    Atualizar solicitações
                  </button>
                </div>

                <Feedback message={feedback} type={type} />
              </div>
            </div>

            <div className="card">
              <p className="kicker">Observações</p>
              <p>
                Os serviços são carregados do banco de dados pelo endpoint de consulta de serviços.
              </p>
              <p>
                O botão de atualização apaga as solicitações atuais do usuário e grava a nova lista.
              </p>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}