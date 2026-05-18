// src/context/ReservasContext.js
//
// NOTA: Este context gerencia estado local de reservas no cliente.
// As reservas reais são persistidas no Firestore (MinhasReservas.js).
// Sem alterações críticas neste arquivo.

import { createContext, useState } from "react";

export const ReservasContext = createContext();

export function ReservasProvider({ children }) {
  const [reservas, setReservas] = useState([]);

  function adicionarReserva(novaReserva) {
    setReservas((prev) => [...prev, novaReserva]);
  }

  function cancelarReserva(id) {
    setReservas((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <ReservasContext.Provider value={{ reservas, adicionarReserva, cancelarReserva }}>
      {children}
    </ReservasContext.Provider>
  );
}
