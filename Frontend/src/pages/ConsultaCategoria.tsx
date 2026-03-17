import "../styles/Paginas.css";
import { useEffect, useState, useMemo } from "react";
import { BsChevronRight, BsChevronDoubleLeft,
  BsChevronDoubleRight, BsCaretUpFill, BsCaretDownFill, BsChevronLeft
 } from "react-icons/bs";
import logo from "../assets/background.png";
import { NavLink } from "react-router-dom";
import axios from "axios";

interface consultaCategoria {
  id: number;
  descricao: string;
  totalReceita: number;
  totalDespesa: number;
  saldo: number;
}

const API_URL = "https://localhost:7099/Categorias";

function ConsultaCategorias() {
  const [categorias, setCategorias] = useState<consultaCategoria[]>([]);

  const [campoBusca, setCampoBusca] = useState("id");
  const [filtroTexto, setFiltroTexto] = useState("");
  const [ordenacao, setOrdenacao] = useState<{ campo: keyof consultaCategoria,
    dir: 'asc' | 'desc' }>({ campo: 'id', dir: 'asc' });
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPagina = 20;

  const carregarCategorias = async () => {
    try {
      const response = await axios.get<consultaCategoria[]>(`${API_URL}/consultaCategorias`);
      console.log("Categorias carregadas:", response.data);
      setCategorias(response.data);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await carregarCategorias();
    };

    fetchData();
  }, []);

  const dadosProcessados = useMemo(() => {
        let resultado = [...categorias];
    
        if (filtroTexto) {
          resultado = resultado.filter(p => {
            let valorParaFiltrar = "";
    
            valorParaFiltrar = String(p[campoBusca as keyof consultaCategoria] || "");
    
            return valorParaFiltrar.toLowerCase().includes(filtroTexto.toLowerCase());
          });
        }
    
        resultado.sort((a, b) => {
          const valA = a[ordenacao.campo as keyof consultaCategoria] ?? "";
          const valB = b[ordenacao.campo as keyof consultaCategoria] ?? "";
  
          if (valA < valB) return ordenacao.dir === 'asc' ? -1 : 1;
          if (valA > valB) return ordenacao.dir === 'asc' ? 1 : -1;
          return 0;
        });
    
        return resultado;
      }, [categorias, filtroTexto, campoBusca, ordenacao]);

      const totaisGerais = useMemo(() => {
        return dadosProcessados.reduce((acc, curr) => ({
          receita: acc.receita + curr.totalReceita,
          despesa: acc.despesa + curr.totalDespesa,
          saldo: acc.saldo + curr.saldo
        }), { receita: 0, despesa: 0, saldo: 0 });
      }, [dadosProcessados]);
    
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

  return (
    <div className="pessoaMenu">
      <img src={logo} alt="Logo" className="logoPagina" />
      <div className="pessoa">
        <h1>Consulta de totais por categoria</h1>
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
            <option value="totalReceita">Total de Receitas</option>
            <option value="totalDespesa">Total de Despesas</option>
            <option value="saldo">Saldo</option>
          </select>

          <input 
            className="busca" 
            placeholder={`Buscar por ${
              campoBusca === "id" ? "Id" : 
              campoBusca === "descricao" ? "Descrição" : 
              campoBusca === "totalReceita" ? "Total de Receitas" : 
              campoBusca === "totalDespesa" ? "Total de Despesas" : "Saldo"
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
              <th onClick={() => handleSort('totalReceita')} style={{ cursor: 'pointer' }}>Total de Receitas {renderSeta('totalReceitas')}</th>
              <th onClick={() => handleSort('totalDespesa')} style={{ cursor: 'pointer' }}>Total de Despesas {renderSeta('totalDespesa')}</th>
              <th onClick={() => handleSort('saldo')} style={{ cursor: 'pointer' }}>Saldo {renderSeta('saldo')}</th>
            </tr>
          </thead>
          <tbody>
            {dadosPaginados.map((c) => {
              return (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.descricao}</td>
                  <td style={{ color: 'green' }}>
                    {c.totalReceita.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td style={{ color: 'red', fontWeight: 'bold' }}>
                    {c.totalDespesa.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td style={{ color: c.saldo < 0 ? 'red' : 'green', fontWeight: 'bold' }}>
                    {c.saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot style={{ backgroundColor: '#f9f9f9', fontWeight: 'bold' }}>
            <tr>
              <td colSpan={2} style={{ textAlign: 'right' }}>TOTAL GERAL:</td>
              <td style={{ color: 'green' }}>
                {totaisGerais.receita.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </td>
              <td style={{ color: 'red' }}>
                {totaisGerais.despesa.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </td>
              <td style={{ color: totaisGerais.saldo < 0 ? 'red' : 'black' }}>
                {totaisGerais.saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </td>
            </tr>
          </tfoot>
        </table>
        
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
    </div>
  );
}

export default ConsultaCategorias;