import { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import OpeningAnimation from "./components/Abertura";
import LoadingPagina from "./components/LoadingPagina";
import Sidebar from "./components/Sidebar";
import Home from "./pages/MainPage";
import Pessoas from "./pages/Pessoas";
import Categorias from "./pages/Categorias";
import Transacoes from "./pages/Transacoes";
import ConsultaPessoa from "./pages/ConsultaPessoa";
import ConsultaCategorias from "./pages/ConsultaCategoria";

function AppContent() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const siderbarWidth = sidebarCollapsed ? "70px" : "180px";

  return (
    <>
    <OpeningAnimation />
    <LoadingPagina key={location.pathname}>
      {!isHome && (<Sidebar onToggle={(collapsed) => setSidebarCollapsed(collapsed)} />)}
      <div className="content" style={{
        marginLeft: isHome ? "30px" : `calc(${siderbarWidth} + 20px)`, 
        marginRight: isHome ? "30px" : "20px",
        transition: "margin 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        paddingTop: "20px"}}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Pessoas" element={<Pessoas />} />
            <Route path="/Categorias" element={<Categorias />} />
            <Route path="/Transacoes" element={<Transacoes />} />
            <Route path="/ConsultaPessoa" element={<ConsultaPessoa />} />
            <Route path="/ConsultaCategoria" element={<ConsultaCategorias />} />
          </Routes>
      </div>
    </LoadingPagina>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;