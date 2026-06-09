import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import CadastroCliente from "./pages/CadastroCliente";
import TrocaSenha from "./pages/TrocaSenha";
import Carrinho from "./pages/Carrinho";
import CadastroServico from "./pages/CadastroServico";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<CadastroCliente />} />
        <Route path="/troca-senha" element={<TrocaSenha />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/cadastro-servico" element={<CadastroServico />} />
      </Routes>
    </BrowserRouter>
  );
}