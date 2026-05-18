// src/screens/MinhasReservas.js
//
// CORREÇÕES APLICADAS:
// [BUG FIX]    getDocs substituído por onSnapshot — a lista agora atualiza em
//              tempo real quando uma reserva é excluída em DetalhesReserva,
//              sem precisar recarregar manualmente a tela.
// [CLEAN CODE] useCallback / carregar removidos (não fazem sentido com listener)
// [CLEAN CODE] Listener limpo no cleanup do useEffect (evita memory leak)

import { useEffect, useState } from "react";
import {
  View, Text, FlatList, StyleSheet,
  ActivityIndicator, TouchableOpacity,
} from "react-native";

import { db } from "../services/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";

function StatusBadge({ status }) {
  const cor =
    status === "Confirmada" ? "#2e7d32" :
    status === "Cancelada"  ? "#d32f2f" :
    "#555";

  return (
    <Text style={[styles.status, { color: cor }]}>
      {status ?? "Pendente"}
    </Text>
  );
}

export default function MinhasReservas({ navigation }) {
  const { user }                = useAuth();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    // Admin vê todas as reservas; usuário comum vê apenas as suas
    const q = user?.role === "admin"
      ? collection(db, "reservas")
      : query(collection(db, "reservas"), where("userId", "==", user.uid));

    // onSnapshot mantém a lista sincronizada com o Firestore em tempo real.
    // Quando uma reserva é excluída em DetalhesReserva, ela some aqui automaticamente.
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setReservas(lista);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Erro ao ouvir reservas:", err);
        setError("Não foi possível carregar suas reservas.");
        setLoading(false);
      }
    );

    // Cancela o listener quando o componente desmonta (evita memory leak)
    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text style={{ marginTop: 10 }}>Carregando reservas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={reservas}
      keyExtractor={(item) => item.id}
      contentContainerStyle={reservas.length === 0 ? styles.center : { paddingBottom: 20 }}
      ListEmptyComponent={<Text style={styles.empty}>Nenhuma reserva encontrada</Text>}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.nome}>🏕 {item.trilha}</Text>
            <StatusBadge status={item.status} />
          </View>

          <Text style={styles.info}>📍 {item.local}</Text>
          <Text style={styles.info}>📅 {item.data} às {item.horario}</Text>
          <Text style={styles.info}>👥 {item.pessoas} pessoas</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("DetalhesReserva", { reserva: item })}
          >
            <Text style={styles.buttonText}>Ver detalhes</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card:        { backgroundColor: "#fff", margin: 12, padding: 15, borderRadius: 15, elevation: 3 },
  header:      { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  nome:        { fontSize: 18, fontWeight: "bold", flex: 1 },
  status:      { fontSize: 14, fontWeight: "bold" },
  info:        { color: "#555", marginTop: 3 },
  button:      { marginTop: 12, backgroundColor: "#2e7d32", padding: 12, borderRadius: 10, alignItems: "center" },
  buttonText:  { color: "#fff", fontWeight: "bold" },
  center:      { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  errorText:   { color: "#d32f2f", marginBottom: 12, textAlign: "center" },
  empty:       { fontSize: 16, color: "#777" },
});