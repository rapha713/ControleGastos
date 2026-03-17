import "../styles/Paginas.css";
import { useEffect, useState, useMemo } from "react";
import { BsXCircle, BsChevronRight, BsChevronDoubleLeft,
  BsChevronDoubleRight, BsCaretUpFill, BsCaretDownFill, BsChevronLeft
 } from "react-icons/bs";
import logo from "../assets/background.png";
import { NavLink } from "react-router-dom";
import axios from "axios";

interface Categoria {
  id: number;
  descricao: string;
  finalidade: string;
}

const API_URL = "https://localhost:7099/Categorias";

function Categorias() {
  const [categorias, setCategoria] = useState<Categoria[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalItems, setModalItems] = useState<"cadastrar" | null>(null)
  const [formData, setFormData] = useState<Partial<Categoria>>({ descricao: "", finalidade: "" });

  const [campoBusca, setCampoBusca] = useState("id");
  const [filtroTexto, setFiltroTexto] = useState("");
  const [ordenacao, setOrdenacao] = useState<{ campo: keyof Categoria,
    dir: 'asc' | 'desc' }>({ campo: 'id', dir: 'asc' });
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPagina = 20;

  const carregarCategoria = async () => {
    try {
      const response = await axios.get<Categoria[]>(`${API_URL}/listarCategorias`);
      console.log("Categorias carregadas:", response.data);
      setCategoria(response.data);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await carregarCategoria();
    };

    fetchData();
  }, []);

  const dadosProcessados = useMemo(() => {
        let resultado = [...categorias];
    
        if (filtroTexto) {
          resultado = resultado.filter(p => {
            let valorParaFiltrar = "";
    
            valorParaFiltrar = String(p[campoBusca as keyof Categoria] || "");
    
            return valorParaFiltrar.toLowerCase().includes(filtroTexto.toLowerCase());
          });
        }
    
        resultado.sort((a, b) => {
          const valA = a[ordenacao.campo as keyof Categoria] ?? "";
          const valB = b[ordenacao.campo as keyof Categoria] ?? "";
  
          if (valA < valB) return ordenacao.dir === 'asc' ? -1 : 1;
          if (valA > valB) return ordenacao.dir === 'asc' ? 1 : -1;
          return 0;
        });
    
        return resultado;
      }, [categorias, filtroTexto, campoBusca, ordenacao]);
    
      const totalPaginas = Math.ceil(dadosProcessados.length / itensPagina);
      const dadosPaginados = dadosProcessados.slice((paginaAtual - 1) * itensPagina, paginaAtual * itensPagina);
    
      const handleSort = (campo: typeof ordenacao.campo) => {
        setOrdenacao(prev => ({
          campo,
          dir: prev.campo === campo && prev.dir === 'asc' ? 'desc' : 'asc'
        }));
      };
    
      const renderSeta = (campo: string) => {
        if (ordenacao.campo !== campo) return null;
        return ordenacao.dir === 'asc' ? <BsCaretUpFill /> : <BsCaretDownFill />;
      };

  const abrirModal = (tipo: "cadastrar", categoria?: Categoria) => {
    setModalItems(tipo);
    setFormData(categoria || { descricao: "", finalidade: "" });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    console.log("URL de chamada:", `${API_URL}/cadastrarCategorias`);
    try {
      if (modalItems === "cadastrar") {
        await axios.post(`${API_URL}/cadastrarCategorias`, null, { params: formData });
      }
      setShowModal(false);
      carregarCategoria();
    } catch (error) {
      console.error("Erro ao processar ação:", error);
      alert("Erro ao conectar com a API C#.");
    }
  };

  return (
    <div className="pessoaMenu">
      <img src={logo} alt="Logo" className="logoPagina" />
      <div className="pessoa">
        <h1>Gerenciamento de Categorias</h1>
        <button style={{marginRight: '10px'}} className="btnCadastrar" onClick={() => abrirModal("cadastrar")}>Cadastrar Categoria</button>
        <NavLink to="/"><button className="btnVoltar">Voltar</button></NavLink>

        <div>
          <select className="filtros" value={campoBusca} 
            onChange={(e) => { 
              setCampoBusca(e.target.value);
              setFiltroTexto("");
              setPaginaAtual(1);
            }}>
            <option value="id">Id</option>
            <option value="descricao">Descrição</option>
            <option value="finalidade">Finalidade</option>
          </select>

          <input 
            className="busca" 
            placeholder={`Buscar por ${
              campoBusca === "id" ? "Id" : 
              campoBusca === "descricao" ? "Descrição" : "Finalidade"
            }...`} 
            value={filtroTexto}
            onChange={(e) => { setFiltroTexto(e.target.value); setPaginaAtual(1); }}
          />
        </div>
      </div>
      <br />

      <div className="tabelaContainer">
        <table className="tabela">
          <thead>
            <tr>
              <th style={{ width: "30px", cursor: 'pointer'}} onClick={() => handleSort('id')}>Id {renderSeta('id')}</th>
              <th onClick={() => handleSort('descricao')} style={{ cursor: 'pointer' }}>Descrição {renderSeta('descricao')}</th>
              <th style={{ cursor: 'pointer'}} onClick={() => handleSort('finalidade')}>Finalidade {renderSeta('finalidade')}</th>
            </tr>
          </thead>
          <tbody>
            {dadosPaginados.map((c) => {
              return (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.descricao}</td>
                  <td>{c.finalidade}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {/* Paginação */}
        <div className="paginacao" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '5px' }}>
          <button disabled={paginaAtual === 1} onClick={() => setPaginaAtual(1)}><BsChevronDoubleLeft /></button>
          <button disabled={paginaAtual === 1} onClick={() => setPaginaAtual(p => p - 1)}><BsChevronLeft /></button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#333' }}>
            Página 
            <input type="number" value={paginaAtual} 
              min={1} max={totalPaginas} 
              onChange={(e) => {
                const p = Number(e.target.value);
                if (p >= 1 && p <= totalPaginas) setPaginaAtual(p);
              }} style={{ width: '50px', textAlign: 'center' }}
            /> de {totalPaginas}
          </div>
          <button disabled={paginaAtual === totalPaginas} onClick={() => setPaginaAtual(p => p + 1)}><BsChevronRight /></button>
          <button disabled={paginaAtual === totalPaginas} onClick={() => setPaginaAtual(totalPaginas)}><BsChevronDoubleRight /></button>
        </div>
      </div>

      {showModal && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <header className="modalHeader">
              <h2>{modalItems?.toUpperCase()}</h2>
              <button className="btnFechar" onClick={() => setShowModal(false)}><BsXCircle /></button>
            </header>

            <div className="modalBody">
              {(
                <div className="campo">
                  <label>Descrição</label>
                  <input 
                    type="text" 
                    value={formData.descricao} 
                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  />
                  <label>Finalidade</label>
                  <select 
                    value={formData.finalidade} 
                    onChange={(e) => setFormData({...formData, finalidade: e.target.value})}
                  >
                    <option value="">Selecione...</option>
                    <option value="Despesa">Despesa</option>
                    <option value="Receita">Receita</option>
                    <option value="Ambas">Ambas</option>
                  </select>
                </div>
              )}
            </div>

            <footer className="modalFooter">
              <button className="btnConfirmar" onClick={handleSubmit}>Confirmar</button>
              <button className="btnCancelar" onClick={() => setShowModal(false)}>Cancelar</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categorias;