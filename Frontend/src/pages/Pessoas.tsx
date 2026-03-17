//Importações e definições de tipos
import "../styles/Paginas.css";
import { useEffect, useState, useMemo } from "react";
// useState -> cria estados para armazenar dados da interface
// useEffect -> executa código em determinados momentos do ciclo de vida do componente
// useMemo -> memoriza cálculos para evitar processamento desnecessário
import { BsXCircle, BsPencilSquare, BsTrash, BsChevronRight, 
  BsChevronDoubleLeft, BsChevronDoubleRight, BsCaretUpFill, BsCaretDownFill,
  BsChevronLeft
 } from "react-icons/bs"; //Importação de ícones
import logo from "../assets/background.png";
import { NavLink } from "react-router-dom"; //NavLink -> componente para navegação entre páginas
import axios from "axios"; //Axios -> biblioteca para fazer requisições HTTP

//Interface TypeScript que define a estrutura de uma pessoa
interface Pessoa {
  id: number;
  nome: string;
  idade: number;
}

const API_URL = "https://localhost:7099/Pessoas";

function Pessoas() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]); //Estado para armazenar a lista de pessoas
  const [showModal, setShowModal] = useState(false); //Estado para controlar a exibição do modal
  const [modalItems, setModalItems] = useState<"cadastrar" | "editar" | "excluir" | null>(null)
  const [formData, setFormData] = useState<Partial<Pessoa>>({ nome: "", idade: 0 }); 
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  
  //Filtragem e ordenação
  const [campoBusca, setCampoBusca] = useState("id");
  const [filtroTexto, setFiltroTexto] = useState("");
  const [ordenacao, setOrdenacao] = useState<{ campo: keyof Pessoa,
    dir: 'asc' | 'desc' }>({ campo: 'id', dir: 'asc' });
  //Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPagina = 20;

  //Função para carregar pessoas da API
  const carregarPessoas = async () => {
    try {
      const response = await axios.get<Pessoa[]>(`${API_URL}/listarPessoas`);
      console.log("Pessoas carregadas:", response.data);
      setPessoas(response.data);
    } catch (error) {
      console.error("Erro ao carregar pessoas:", error);
    }
  };

  // useEffect para carregar pessoas ao montar o componente (equivalente ao "onLoad")
  useEffect(() => {
    const fetchData = async () => {
      await carregarPessoas();
    };
    fetchData();
  }, []);

  // useMemo evita recalcular os dados processados
  const dadosProcessados = useMemo(() => {
    //Cria uma cópia da lista de pessoas para aplicar filtros e ordenação
      let resultado = [...pessoas];
  
      //Filtro
      if (filtroTexto) {
        resultado = resultado.filter(p => {
          let valorParaFiltrar = "";
  
          valorParaFiltrar = String(p[campoBusca as keyof Pessoa] || "");
  
          return valorParaFiltrar.toLowerCase().includes(filtroTexto.toLowerCase());
        });
      }
  
      // Ordenação
      resultado.sort((a, b) => {
        const valA = a[ordenacao.campo as keyof Pessoa] ?? "";
        const valB = b[ordenacao.campo as keyof Pessoa] ?? "";

        if (valA < valB) return ordenacao.dir === 'asc' ? -1 : 1;
        if (valA > valB) return ordenacao.dir === 'asc' ? 1 : -1;
        return 0;
      });
  
      return resultado;
    }, [pessoas, filtroTexto, campoBusca, ordenacao]);
  
    //Paginação
    const totalPaginas = Math.ceil(dadosProcessados.length / itensPagina);
    const dadosPaginados = dadosProcessados.slice((paginaAtual - 1) * itensPagina, paginaAtual * itensPagina);
  
    //Altera entre ascendente e descendente ao clicar no cabeçalho da tabela
    const handleSort = (campo: typeof ordenacao.campo) => {
      setOrdenacao(prev => ({
        campo,
        dir: prev.campo === campo && prev.dir === 'asc' ? 'desc' : 'asc'
      }));
    };
    
    //Altera o ícone de acordo com a direção atual
    const renderSeta = (campo: string) => {
      if (ordenacao.campo !== campo) return null;
      return ordenacao.dir === 'asc' ? <BsCaretUpFill /> : <BsCaretDownFill />;
    };

  //Função para abrir o modal de cadastro, edição ou exclusão
  const abrirModal = (tipo: "cadastrar" | "editar" | "excluir", pessoa?: Pessoa) => {
    setModalItems(tipo);
    setFormData(pessoa || { nome: "", idade: 0 });
    setDeleteConfirmation("");
    setShowModal(true);
  };

  //Função para enviar os dados do formulário para a API
  const handleSubmit = async () => {
    console.log("URL de chamada:", `${API_URL}/cadastrarPessoas`);
    try {
      if (modalItems === "cadastrar") {
        await axios.post(`${API_URL}/cadastrarPessoas`, null, { params: formData });
      } else if (modalItems === "editar") {
        await axios.put(`${API_URL}/atualizarPessoas/${formData.id}`, formData);
      } else if (modalItems === "excluir") {
        if (deleteConfirmation !== "EXCLUIR") return alert("Digite a confirmação corretamente!");
        await axios.delete(`${API_URL}/deletarPessoas/${formData.id}`);
      }
      setShowModal(false);
      carregarPessoas();
    } catch (error) {
      console.error("Erro ao processar ação:", error);
      alert("Erro ao conectar com a API C#.");
    }
  };

  return (
    <div className="pessoaMenu">
      <img src={logo} alt="Logo" className="logoPagina" />
      <div className="pessoa">
        <h1>Gerenciamento de Pessoas</h1>
        <button style={{marginRight: '10px'}} className="btnCadastrar" 
        onClick={() => abrirModal("cadastrar")}>Cadastrar Pessoa</button> {/* Botão para abrir modal de cadastro */}
        <NavLink to="/"><button className="btnVoltar">Voltar</button></NavLink>

        {/* Área de filtros e busca */}
        <div>
          <select className="filtros" value={campoBusca} 
            onChange={(e) => { 
              setCampoBusca(e.target.value); // Muda o campo
              setFiltroTexto("");            // Limpa o texto da busca
              setPaginaAtual(1);             // Reseta para a primeira página
            }}>
            <option value="id">Id</option>
            <option value="nome">Nome</option>
            <option value="idade">Idade</option>
          </select>

          <input 
            className="busca" 
            placeholder={`Buscar por ${
              campoBusca === "id" ? "Id" : 
              campoBusca === "nome" ? "Nome" : "Idade"
            }...`} 
            value={filtroTexto}
            onChange={(e) => { setFiltroTexto(e.target.value); setPaginaAtual(1); }}
          />
        </div>
      </div>
      <br />

      {/* Tabela que exibe os dados */}
      <div className="tabelaContainer">
        <table className="tabela">
          <thead>
            <tr>
              <th style={{ width: "30px", cursor: 'pointer'}} onClick={() => handleSort('id')}>Id {renderSeta('id')}</th>
              <th onClick={() => handleSort('nome')} style={{ cursor: 'pointer' }}>Nome {renderSeta('nome')}</th>
              <th style={{ width: "100px", cursor: 'pointer'}} onClick={() => handleSort('idade')}>Idade {renderSeta('idade')}</th>
              <th style={{ width: "150px"}}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {dadosPaginados.map((p) => {
              return (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nome}</td>
                  <td>{p.idade} anos</td>
                  <td className="txtCenter">
                    <button style={{ marginLeft: '15%', marginRight: '10px'}} className="btnEditar" onClick={() => abrirModal("editar", p)}><BsPencilSquare /></button>
                    <button className="btnExcluir" onClick={() => abrirModal("excluir", p)}><BsTrash /></button>
                  </td>
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

      {/* Modal */}
      {showModal && (
        <div className="modal" onClick={() => setShowModal(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <header className="modalHeader">
              <h2>{modalItems?.toUpperCase()}</h2>
              <button className="btnFechar" onClick={() => setShowModal(false)}><BsXCircle /></button>
            </header>

            <div className="modalBody">
              {modalItems === "excluir" ? (
                <div className="alertaExcluir">
                  <p>Tem certeza que deseja excluir <strong>{formData.nome}</strong>?</p>
                  <small><strong>Atenção:</strong> Esta ação apagará todas as transações vinculadas.</small>
                  <input 
                    placeholder='Digite "EXCLUIR"' 
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value.toUpperCase())} 
                  />
                </div>
              ) : (
                <div className="campo">
                  <label>Nome Completo</label>
                  <input type="text" value={formData.nome} 
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}/>
                  <label>Idade</label>
                  <input type="number" style={{ width: "100px" }}
                    min={"0"} value={formData.idade} 
                    onChange={(e) => setFormData({...formData, idade: Number(e.target.value)})}/>
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

// Exporta o componente para ser usado nas rotas do React
export default Pessoas;