// src/screens/AdminTrilhas.js
//
// CORREÇÕES APLICADAS:
// [CLEAN CODE]  useTrilhas hook substitui lógica de fetch inline
// [CLEAN CODE]  Estado de loading e erro tratados
// [CLEAN CODE]  Função excluir com try/catch + feedback de erro

import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { db } from "../services/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { useTrilhas } from "../hooks/useTrilhas";

export default function AdminTrilhas({ navigation }) {
  const { trilhas, loading, error, recarregar } = useTrilhas();

  async function excluir(id) {
    Alert.alert(
      "Excluir trilha",
      "Tem certeza que deseja excluir esta trilha?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "trilhas", id));
              recarregar();
            } catch (err) {
              console.error("Erro ao excluir trilha:", err);
              Alert.alert("Erro", "Não foi possível excluir a trilha.");
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

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.addButton} onPress={recarregar}>
          <Text style={styles.addText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⚙ Administração de Trilhas</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("FormTrilha")}
        >
          <Text style={styles.addText}>+ Nova Trilha</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={trilhas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhuma trilha cadastrada</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.info}>📍 {item.local}</Text>
            <Text style={styles.info}>🎯 Nível: {item.nivel}</Text>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate("FormTrilha", { trilha: item })}
              >
                <Text style={styles.editText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => excluir(item.id)}
              >
                <Text style={styles.deleteText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: "#f5f5f5" },
  center:      { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  errorText:   { color: "#d32f2f", marginBottom: 12, textAlign: "center" },
  header:      { padding: 15, backgroundColor: "#fff", elevation: 3 },
  title:       { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  addButton:   { backgroundColor: "#2e7d32", padding: 12, borderRadius: 10, alignItems: "center" },
  addText:     { color: "#fff", fontWeight: "bold" },
  card:        { backgroundColor: "#fff", margin: 12, padding: 15, borderRadius: 12, elevation: 2 },
  nome:        { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  info:        { color: "#555", marginBottom: 3 },
  actions:     { flexDirection: "row", justifyContent: "space-between", marginTop: 15 },
  editButton:  { backgroundColor: "#1976d2", padding: 10, borderRadius: 8, flex: 1, marginRight: 5, alignItems: "center" },
  deleteButton:{ backgroundColor: "#d32f2f", padding: 10, borderRadius: 8, flex: 1, marginLeft: 5, alignItems: "center" },
  editText:    { color: "#fff", fontWeight: "bold" },
  deleteText:  { color: "#fff", fontWeight: "bold" },
  empty:       { textAlign: "center", marginTop: 50, color: "#777" },
});
