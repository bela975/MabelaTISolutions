const express = require("express");
const cors = require("cors");
const pool = require("./db");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

/*Autenticação de clientes*/
app.post("/auth/login", async (req, res) => {
  try {
    const { login, senha } = req.body;

    const result = await pool.query(
      "SELECT * FROM cliente WHERE login = $1",
      [login]
    );

    if (result.rows.length === 0) {
      return res.json({
        sucesso: false,
        autenticado: false,
        mensagem: "Usuário não encontrado.",
      });
    }

    const cliente = result.rows[0];

    const autenticado = cliente.senha === senha;

    return res.json({
      sucesso: autenticado,
      autenticado,
      mensagem: autenticado
        ? "Login realizado com sucesso."
        : "Senha incorreta.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao autenticar.",
    });
  }
});

/*Realizar troca de senha*/
app.post("/auth/trocar-senha", async (req, res) => {
  try {
    const { login, senhaAtual, novaSenha } = req.body;

    const result = await pool.query(
      "SELECT * FROM cliente WHERE login = $1 AND senha = $2",
      [login, senhaAtual]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Login ou senha atual inválidos.",
      });
    }

    await pool.query(
      "UPDATE cliente SET senha = $1 WHERE login = $2",
      [novaSenha, login]
    );

    return res.json({
      sucesso: true,
      mensagem: "Senha alterada com sucesso.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao trocar senha.",
    });
  }
});

/*Cadastro de clientes*/
app.post("/clientes", async (req, res) => {
  try {
    const {
      nome,
      login,
      senha,
      cpf,
      dataNascimento,
      telefone,
      escolaridade,
      estadoCivil,
    } = req.body;

    const usuarioExistente = await pool.query(
      "SELECT id FROM cliente WHERE login = $1",
      [login]
    );

    if (usuarioExistente.rows.length > 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Login já cadastrado.",
      });
    }

    await pool.query(
      `
      INSERT INTO cliente
      (
        nome,
        login,
        senha,
        cpf,
        data_nascimento,
        telefone,
        escolaridade,
        estado_civil
      )
      VALUES
      ($1,$2,$3,$4,$5,$6,$7,$8)
      `,
      [
        nome,
        login,
        senha,
        cpf,
        dataNascimento,
        telefone,
        escolaridade,
        estadoCivil,
      ]
    );

    return res.json({
      sucesso: true,
      mensagem: "Cliente cadastrado com sucesso.",
    });
    } catch (error) {
    console.error("ERRO AO CADASTRAR CLIENTE:", error);

    return res.status(500).json({
      sucesso: false,
      mensagem: error.message,
      detalhe: error.detail,
      codigo: error.code,
    });
  }
});

/*Cadastro de serviços*/
app.post("/servicos", async (req, res) => {
  try {
    const {
      nome,
      descricao,
      preco,
      prazoDias,
    } = req.body;

    await pool.query(
      `
      INSERT INTO servico_ti
      (
        nome,
        descricao,
        preco,
        prazo_dias
      )
      VALUES
      ($1,$2,$3,$4)
      `,
      [
        nome,
        descricao,
        preco,
        prazoDias,
      ]
    );

    return res.json({
      sucesso: true,
      mensagem: "Serviço cadastrado com sucesso.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao cadastrar serviço.",
    });
  }
});

/*Consulta de serviços*/
app.get("/servicos", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM servico_ti ORDER BY id"
    );

    return res.json({
      sucesso: true,
      servicos: result.rows,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao consultar serviços.",
    });
  }
});

/*Consulta de solicitações*/
app.get("/solicitacoes/:login", async (req, res) => {
  try {
    const { login } = req.params;

    const result = await pool.query(
      `
      SELECT
        s.id,
        s.data_pedido,
        s.status,
        s.data_prevista,
        st.id AS servico_id,
        st.nome AS servico_nome,
        st.descricao,
        st.preco,
        st.prazo_dias
      FROM solicitacao_servico_ti s
      INNER JOIN cliente c
        ON c.id = s.cliente_id
      INNER JOIN servico_ti st
        ON st.id = s.servico_ti_id
      WHERE c.login = $1
      ORDER BY s.id
      `,
      [login]
    );

    return res.json({
      sucesso: true,
      solicitacoes: result.rows,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao consultar solicitações.",
    });
  }
});

/* Atalizar solicitações*/
app.put("/solicitacoes", async (req, res) => {
  try {
    const { login, solicitacoes } = req.body;

    const cliente = await pool.query(
      "SELECT id FROM cliente WHERE login = $1",
      [login]
    );

    if (cliente.rows.length === 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Cliente não encontrado.",
      });
    }

    const clienteId = cliente.rows[0].id;

    await pool.query(
      "DELETE FROM solicitacao_servico_ti WHERE cliente_id = $1",
      [clienteId]
    );

    for (const item of solicitacoes) {
      await pool.query(
        `
        INSERT INTO solicitacao_servico_ti
        (
          cliente_id,
          servico_ti_id,
          data_pedido,
          status,
          data_prevista
        )
        VALUES
        ($1,$2,$3,$4,$5)
        `,
        [
          clienteId,
          item.servicoId,
          item.dataPedido,
          item.status,
          item.dataPrevista,
        ]
      );
    }

    return res.json({
      sucesso: true,
      mensagem:
        "Solicitações atualizadas com sucesso.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      sucesso: false,
      mensagem:
        "Erro ao atualizar solicitações.",
    });
  }
});

/* Teste */
app.get("/", (req, res) => {
  res.send("API Mabela Serviços de TI funcionando!");
});


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(
    `Servidor rodando em http://localhost:${PORT}`
  );
});