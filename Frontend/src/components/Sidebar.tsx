import { useState } from "react";
import { VscListUnordered } from "react-icons/vsc";
import { VscChevronRight } from "react-icons/vsc";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  onToggle: (collapsed: boolean) => void;
}

function Sidebar({ onToggle }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(true);  
  const [openConsultas, setOpenConsultas] = useState(false);

  const handleToggle = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    onToggle(newCollapsed);
  };

  const navLinkStyle = ({ isActive }: { isActive: boolean }) => {
    return {
      pointerEvents: isActive ? ("none" as const) : ("auto" as const),
      opacity: isActive ? 1 : 0.8,
      backgroundColor: isActive ? "#333" : "transparent",
      fontStyle: isActive ? "italic" : "normal",
    };
  };

  return (
    <>
      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button className="btnMenu" onClick={handleToggle}>
        <VscListUnordered />
      </button>
      <nav>
        <ul className="menu">
          {[
            { to: "/", label: "Home"},
            { to: "/pessoas", label: "Pessoas"},
            { to: "/categorias", label: "Categorias"},
            { to: "/transacoes", label: "Transações"},
          ].map((item) => (
          <li key={item.to}>
              <span className="menuIcon"><VscChevronRight /></span>
              <NavLink 
                to={item.to} 
                className={({ isActive }) => `btnModal ${isActive ? "active" : ""}`}
                style={navLinkStyle}>
                <span>{item.label}</span>
              </NavLink>
          </li>
          ))}

          <li onClick={() => setOpenConsultas(!openConsultas)}>
            <span className="menuIcon" style={{ transform: openConsultas ? 'rotate(90deg)' : 'none', transition: '0.3s' }}>
              <VscChevronRight />
            </span>
            <button className="btnModal">
              <span>Consultas</span>
            </button>
          </li>

          {!collapsed && openConsultas && (
            <div className="submenuConteiner">
              <li className="submenu">
                <NavLink to="/consultaPessoa" className={({ isActive }) => `btnModal ${isActive ? "active" : ""}`}>
                  <span>Pessoa</span>
                </NavLink>
              </li>
              <li className="submenu">
                <NavLink to="/consultaCategoria" className={({ isActive }) => `btnModal ${isActive ? "active" : ""}`}>
                  <span>Categoria</span>
                </NavLink>
              </li>
            </div>
          )}  
        </ul>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;