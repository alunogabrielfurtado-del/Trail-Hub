// src/hooks/useTrilhas.js
//
// CORREÇÃO (CLEAN CODE): Lógica de fetch de trilhas extraída das screens.
// Antes: cada screen repetia getDocs + map + setTrilhas + setLoading.
// Agora: um único hook reutilizável.

import { useState, useEffect, useCallback } from "react";
import { db } from "../services/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export function useTrilhas({ apenasAtivas = false } = {}) {
  const [trilhas, setTrilhas]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // ✅ PERFORMANCE: Filtra ativas no servidor (where), não no cliente
      const ref = apenasAtivas
        ? query(collection(db, "trilhas"), where("ativo", "==", true))
        : collection(db, "trilhas");

      const snapshot = await getDocs(ref);

      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setTrilhas(lista);
    } catch (err) {
      console.error("Erro ao carregar trilhas:", err);
      setError("Não foi possível carregar as trilhas.");
    } finally {
      setLoading(false);
    }
  }, [apenasAtivas]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return { trilhas, loading, error, recarregar: carregar };
}
