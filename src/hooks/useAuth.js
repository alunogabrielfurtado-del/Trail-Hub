// src/hooks/useAuth.js
//
// CORREÇÃO (CLEAN CODE): Hook centralizado para acessar o AuthContext.
// Elimina a repetição de `useContext(AuthContext)` em cada screen.
// Uso: const { user, login, logout } = useAuth();

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  }

  return context;
}
