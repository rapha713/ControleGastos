import { useEffect, useState } from "react";
import logo from "../assets/background.png";

function OpeningAnimation() {
  const [primeiraVisita] = useState(() => {
    const visited = sessionStorage.getItem("visited");
    if (!visited) {
      sessionStorage.setItem("visited", "true");
      return true;
    }
    return false;
  });
  const [phase, setPhase] = useState<"logo" | "open" | "hide">("logo");

  useEffect(() => {
    if (!primeiraVisita) return;

    const timer1 = setTimeout(() => setPhase("open"), 2500);
    const timer2 = setTimeout(() => setPhase("hide"), 3500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [primeiraVisita]);

  if (!primeiraVisita || phase === "hide") return null;

  return (
  <>
    <div className="containerAbertura"></div>

    <div className={`telaAbertura top ${phase === "open" ? "abrir" : ""}`}></div>
    <div className={`telaAbertura bottom ${phase === "open" ? "abrir" : ""}`}></div>
    
    <div className={`aberturaInicial ${phase !== "logo" ? "sumir" : ""}`}>
      <img src={logo} alt="Logo" className="logoAbertura" /> {/*Imagem inicial*/}
      <p className="mensagemInicial">
        Bem-vindo!
      </p>
    </div>
  </>
);
}

export default OpeningAnimation;