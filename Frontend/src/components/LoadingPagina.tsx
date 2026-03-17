import "../styles/LoadingPagina.css";
import { useEffect, useState } from "react";
import logo from "../assets/background.png";

interface LoadingPaginaProps {
    children: React.ReactNode;
}

function LoadingPagina({ children }: LoadingPaginaProps) {
    const [loading, setLoading] = useState(true);

    // Quando o componente terminar de montar espera um tempo para tirar o carregamento
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 500); 

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <div className={`loadingTransicao ${!loading ? "fade-out" : ""}`}>
                <img src={logo} alt="Logo" className="logoCarregamento" />
            </div>            
            <div className={`transicaoPage ${!loading ? "carregado" : "carregando"}`}>
                {children}
            </div>
        </>
    );
}

export default LoadingPagina;