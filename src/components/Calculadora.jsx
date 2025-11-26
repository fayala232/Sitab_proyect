import { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function Calculadora({ usuario, setLogin, setUsuario }) {
  // Vamos a hacer una suma, tenemos dos estados para los dos números
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);

  const navegar = useNavigate();
  const cerrarSesion = () =>{
    setLogin(false);
    setUsuario("");
    navegar("/login");
  };

  return (
    <div>
      <h2>Bienvenido {usuario.toLocaleUpperCase()}</h2>
      <h3>Calculadora básica</h3>
      <input type="number" value={num1} onChange={(e) => setNum1(Number(e.target.value))} />
      <span>+</span>
      <input type="number" value={num2} onChange={(e) => setNum2(Number(e.target.value))} />
      <h3>Resultado: {num1 + num2}</h3>

      <button onClick={cerrarSesion}>Cerrar Sesión</button>
    </div>
  );
}