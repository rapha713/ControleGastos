import "../styles/Home.css";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { BsXCircle } from "react-icons/bs";
import logo from "../assets/background.png";

function Home() {
  const [showModal, setShowModal] = useState(false);
  const abrirModal = () => { setShowModal(true) };

  return (
    <>
      <div className="containerHome">
        <header className="cabecalho">
          <img src={logo} alt="Logo" className="logoPagina" />
          <h1>Sistema Financeiro Residenciais</h1><br />
          <p>Gerenciamento inteligente de Pessoas, Categorias e Transações.</p>
        </header>

        <main className="homeGrid">
          <div className="cartao">
            <h3>Pessoas</h3><br/>
            <p>Gerencie usuários, idades e permissões do sistema.</p>
            <NavLink to="/pessoas">
              <button className="btnAcesso">Acessar</button>
            </NavLink>
          </div>

          <div className="cartao">
            <h3>Categorias</h3><br/>
            <p>Organize receitas e despesas por finalidade.</p>
            <NavLink to="/categorias">
              <button className="btnAcesso">Configurar</button>
            </NavLink>
          </div>

          <div className="cartao">
            <h3>Transações</h3><br/>
            <p>Lance valores, controle o tipo e valide regras de idade.</p>
            <NavLink to="/transacoes">
              <button className="btnAcesso">Lançamentos</button>
            </NavLink>
          </div>

          <div className="cartao">
            <h3>Resumo Geral</h3><br/>
            <p>Visualize saldos, receitas e despesas por pessoa.</p>
              <button className="btnAcesso" onClick={() => abrirModal()}>Ver Consultas</button>
          </div>
        </main>
      </div>

      {showModal && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <button className="btnFecharModal" onClick={() => setShowModal(false)}><BsXCircle /></button>
            <h2>Selecionar Consulta</h2>
            <div className="modalBody">
              <h3>Consulta Pessoa</h3>
              <NavLink to="/ConsultaPessoa">
                <button className="btnAcessoModal">Consultar</button>
              </NavLink>
              <h3>Consulta Categoria</h3>
              <NavLink to="/ConsultaCategoria">
                <button className="btnAcessoModal">Consultar</button>
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;