/* eslint-disable react-hooks/exhaustive-deps */
import "../styles/Paginas.css";
import { useEffect, useState, useMemo, useCallback } from "react"
import { BsXCircle, BsChevronLeft, BsChevronRight, 
  BsChevronDoubleLeft, BsChevronDoubleRight, BsCaretUpFill, BsCaretDownFill
 } from "react-icons/bs";
import logo from "../assets/background.png";
import { NavLink } from "react-router-dom";
import axios from "axios";

// Interfaces
interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: string;
  idCategoria: number;
  idPessoa: number;
  nomeCategoria?: string; 
  nomePessoa?: string;
}

interface Categoria {
  id: number;
  descricao: string;
  finalidade: string; 
}

interface Pessoa {
  id: number;
  nome: string;
}

const API_URL = "https://localhost:7099/Transacoes";
const API_URL_CATEGORIA = "https://localhost:7099/Categorias/listarCategorias";
const API_URL_PESSOA = "https://localhost:7099/Pessoas/listarPessoas";

function Transacao() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  
  const [campoBusca, setCampoBusca] = useState("id");
  const [filtroTexto, setFiltroTexto] = useState("");
  const [ordenacao, setOrdenacao] = useState<{ campo: keyof Transacao | 'nomeCategoria' | 'nomePessoa',
    dir: 'asc' | 'desc' }>({ campo: 'id', dir: 'asc' });
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPagina = 20;
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Transacao>>({
    descricao: "", valor: 0, tipo: "", idCategoria: 0, idPessoa: 0
  });

  // Carregamento de dados
  const carregarDados = useCallback(async () => {
    try {
      const [resT, resC, resP] = await Promise.all([
        axios.get<Transacao[]>(`${API_URL}/listarTransacoes`),
        axios.get<Categoria[]>(API_URL_CATEGORIA),
        axios.get<Pessoa[]>(API_URL_PESSOA)
      ]);
      
      setTransacoes(resT.data);
      setCategorias(resC.data);
      setPessoas(resP.data);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await carregarDados();
    };
    fetchData();
  }, []);

  const dadosProcessados = useMemo(() => {
    let resultado = [...transacoes];

    if (filtroTexto) {
      resultado = resultado.filter(t => {
        let valorParaFiltrar = "";

        if (campoBusca === "nomeCategoria") {
          valorParaFiltrar = categorias.find(c => c.id === t.idCategoria)?.descricao || "";
        } 
        else if (campoBusca === "nomePessoa") {
          valorParaFiltrar = pessoas.find(p => p.id === t.idPessoa)?.nome || "";
        } 
        else {
          valorParaFiltrar = String(t[campoBusca as keyof Transacao] || "");
        }

        return valorParaFiltrar.toLowerCase().includes(filtroTexto.toLowerCase());
      });
    }

    resultado.sort((a, b) => {
      let valA: string | number;
      let valB: string | number;

      if (ordenacao.campo === 'nomeCategoria') {
        valA = categorias.find(c => c.id === a.idCategoria)?.descricao || "";
        valB = categorias.find(c => c.id === b.idCategoria)?.descricao || "";
      } 
      else if (ordenacao.campo === 'nomePessoa') {
        valA = pessoas.find(p => p.id === a.idPessoa)?.nome || "";
        valB = pessoas.find(p => p.id === b.idPessoa)?.nome || "";
      } 
      else {
        valA = a[ordenacao.campo as keyof Transacao] ?? "";
        valB = b[ordenacao.campo as keyof Transacao] ?? "";
      }

      if (valA < valB) return ordenacao.dir === 'asc' ? -1 : 1;
      if (valA > valB) return ordenacao.dir === 'asc' ? 1 : -1;
      return 0;
    });

    return resultado;
  }, [transacoes, filtroTexto, campoBusca, ordenacao, categorias, pessoas]);

  //Paginação
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

  const abrirModal = () => {
    setFormData({ descricao: "", valor: 0, tipo: "", idCategoria: 0, idPessoa: 0 });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    const categoriaSelecionada = categorias.find(c => c.id === formData.idCategoria);
    
    if (categoriaSelecionada) {
      const finalidade = categoriaSelecionada.finalidade;
      if (finalidade !== "Ambas" && finalidade !== formData.tipo) {
        alert(`Esta categoria é exclusiva para ${finalidade}. Ajuste o tipo da transação.`);
        return;
      }
    }

    try {
      console.log(formData);
      await axios.post(`${API_URL}/cadastrarTransacoes`, null, { 
      params: {
        descricao: formData.descricao,
        valor: formData.valor,
        tipo: formData.tipo,
        idCategoria: formData.idCategoria,
        idPessoa: formData.idPessoa
      } 
    });
      setShowModal(false);
      carregarDados();
    } catch {
      alert("Erro ao salvar transação.");
    }
  };

  return (
    <div className="pessoaMenu">
      <img src={logo} alt="Logo" className="logoPagina" />
      <div className="pessoa">
        <h1>Gerenciamento de Transações</h1>
        <button style={{marginRight: '10px'}} className="btnCadastrar" onClick={abrirModal}>Cadastrar Categoria</button>
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
            <option value="valor">Valor</option>
            <option value="tipo">Tipo</option>
            <option value="nomeCategoria">Categoria</option>
            <option value="nomePessoa">Pessoa</option>
          </select>

          <input 
            className="busca" 
            placeholder={`Buscar por ${
              campoBusca === "nomeCategoria" ? "Categoria" : 
              campoBusca === "nomePessoa" ? "Pessoa" : campoBusca
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
              <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>Id {renderSeta('id')}</th>
              <th onClick={() => handleSort('descricao')} style={{ cursor: 'pointer' }}>Descrição {renderSeta('descricao')}</th>
              <th onClick={() => handleSort('valor')} style={{ cursor: 'pointer' }}>Valor {renderSeta('valor')}</th>
              <th onClick={() => handleSort('tipo')} style={{ cursor: 'pointer' }}>Tipo {renderSeta('tipo')}</th>
              <th onClick={() => handleSort('nomeCategoria')} style={{ cursor: 'pointer' }}>Categoria {renderSeta('nomeCategoria')}</th>
              <th onClick={() => handleSort('nomePessoa')} style={{ cursor: 'pointer' }}>Pessoa {renderSeta('nomePessoa')}</th>
            </tr>
          </thead>
          <tbody>
            {dadosPaginados.map((t) => {
              const categoriaDesc = categorias.find(c => c.id === t.idCategoria)?.descricao || "N/A";
              const pessoaNome = pessoas.find(p => p.id === t.idPessoa)?.nome || "N/A";

              return (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.descricao}</td>
                  <td style={{ color: t.tipo === "Despesa" ? "red" : "green" }}>
                    R$ {Number(t.valor).toFixed(2)}
                  </td>
                  <td>{t.tipo}</td>
                  <td>{categoriaDesc}</td>
                  <td>{pessoaNome}</td>
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
        <div className="modal">
          <div className="modalContent">
            <header className="modalHeader">
              <h2>CADASTRAR</h2>
              <button className="closeX" onClick={() => setShowModal(false)}><BsXCircle /></button>
            </header>

            <div className="modalBody">
              <div className="campo">
                <label>Descrição</label>
                <input type="text" value={formData.descricao} 
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})} />
                
                <label>Valor (R$)</label>
                <input type="number" step="0.01" min={"0"} value={formData.valor} 
                  onChange={(e) => setFormData({...formData, valor: parseFloat(e.target.value)})} />

                <label>Tipo</label>
                <select value={formData.tipo} onChange={(e) => setFormData({...formData, tipo: e.target.value})}>
                    <option value="">Selecione...</option>
                    <option value="Receita">Receita</option>
                    <option value="Despesa">Despesa</option>
                </select>

                <label>Categoria</label>
                <select value={formData.idCategoria} onChange={(e) => setFormData({...formData, idCategoria: Number(e.target.value)})}>
                    <option value={0}>Selecione a Categoria...</option>
                    {categorias.map(c => (
                        <option key={c.id} value={c.id}>{c.descricao} ({c.finalidade})</option>
                    ))}
                </select>

                <label>Pessoa</label>
                <select value={formData.idPessoa} onChange={(e) => setFormData({...formData, idPessoa: Number(e.target.value)})}>
                    <option value={0}>Selecione a Pessoa...</option>
                    {pessoas.map(p => (
                        <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                </select>
              </div>
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

export default Transacao;