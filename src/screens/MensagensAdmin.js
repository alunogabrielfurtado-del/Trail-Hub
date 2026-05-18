// src/screens/MensagensAdmin.js
//
// CORREÇÕES APLICADAS:
// [CLEAN CODE] Componente StatusBadge extraído (era JSX inline)
// [CLEAN CODE] marcarLida e excluir com try/catch + feedback ao usuário
// [CLEAN CODE] Confirmação antes de excluir (evita exclusão acidental)

import { useEffect, useState } from "react";
import {
  View, Text, FlatList, StyleSheet,
  TouchableOpacity, Alert, ActivityIndicator,
} from "react-native";

import { db } from "../services/firebase";
import {
  collection, onSnapshot, updateDoc, deleteDoc, doc,
} from "firebase/firestore";

function StatusBadge({ lida }) {
  return (
    <View style={[styles.status, { backgroundColor: lida ? "#e8f5e9" : "#ffebee" }]}>
      <Text style={[styles.statusText, { color: lida ? "#2e7d32" : "#c62828" }]}>
        {lida ? "Lida" : "Nova"}
      </Text>
    </View>
  );
}

export default function MensagensAdmin() {
  const [mensagens, setMensagens] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "mensagens"),
      (snapshot) => {
        const lista = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0));

        setMensagens(lista);
        setLoading(false);
      },
      (error) => {
        console.error("Erro ao ouvir mensagens:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  async function marcarLida(id) {
    try {
      await updateDoc(doc(db, "mensagens", id), { lida: true });
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
      Alert.alert("Erro", "Não foi possível atualizar a mensagem.");
    }
  }

  function confirmarExclusao(id) {
    Alert.alert(
      "Excluir mensagem",
      "Tem certeza que deseja excluir esta mensagem?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "mensagens", id));
            } catch (error) {
              console.error("Erro ao excluir mensagem:", error);
              Alert.alert("Erro", "Não foi possível excluir a mensagem.");
            }
          },
        },
      ]
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Central de Mensagens</Text>
        <Text style={styles.subtitle}>Gerencie contatos dos usuários</Text>
      </View>

      <FlatList
        data={mensagens}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhuma mensagem encontrada</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.nome}>{item.nome}</Text>
              <StatusBadge lida={item.lida} />
            </View>

            <Text style={styles.email}>{item.email}</Text>
            <Text style={styles.assunto}>{item.assunto}</Text>
            <Text style={styles.mensagem} numberOfLines={4}>{item.mensagem}</Text>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, styles.lidaBtn]}
                onPress={() => marcarLida(item.id)}
                disabled={item.lida}
              >
                <Text style={styles.btnText}>
                  {item.lida ? "Já lida" : "Marcar como lida"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.deleteBtn]}
                onPress={() => confirmarExclusao(item.id)}
              >
                <Text style={styles.btnText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: "#f4f6f8" },
  center:     { flex: 1, justifyContent: "center", alignItems: "center" },
  header:     { padding: 20, backgroundColor: "#2e7d32" },
  title:      { fontSize: 20, fontWeight: "bold", color: "#fff" },
  subtitle:   { color: "#e0e0e0", marginTop: 4 },
  card:       { backgroundColor: "#fff", marginHorizontal: 15, marginTop: 12, padding: 15, borderRadius: 14, elevation: 3 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  nome:       { fontSize: 16, fontWeight: "bold", color: "#222" },
  email:      { fontSize: 13, color: "#666", marginTop: 2 },
  assunto:    { fontSize: 14, fontWeight: "600", marginTop: 10, color: "#333" },
  mensagem:   { fontSize: 13, color: "#555", marginTop: 6, lineHeight: 18 },
  status:     { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: "bold" },
  actions:    { flexDirection: "row", marginTop: 15, justifyContent: "space-between" },
  button:     { flex: 1, padding: 10, borderRadius: 10, alignItems: "center", marginHorizontal: 5 },
  lidaBtn:    { backgroundColor: "#2e7d32" },
  deleteBtn:  { backgroundColor: "#c62828" },
  btnText:    { color: "#fff", fontWeight: "bold", fontSize: 12 },
  empty:      { textAlign: "center", marginTop: 30, color: "#777" },
});
