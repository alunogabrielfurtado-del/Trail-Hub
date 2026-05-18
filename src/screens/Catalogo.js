// src/screens/Catalogo.js
//
// CORREÇÕES APLICADAS:
// [PERFORMANCE] useTrilhas hook com filtro server-side (where ativo==true)
// [CLEAN CODE]  useAuth hook em vez de useContext direto
// [CLEAN CODE]  Loading state e tratamento de erro exibidos ao usuário

import { StyleSheet, FlatList, View, Text, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { useTrilhas } from "../hooks/useTrilhas";
import colors from "../styles/colors";

export default function Catalogo({ navigation }) {
  const { user }                          = useAuth();
  const { trilhas, loading, error, recarregar } = useTrilhas({ apenasAtivas: true });

  function renderNivel(nivel) {
    if (!nivel) return "Indefinido";
    switch (nivel.toLowerCase()) {
      case "facil":   return "🟢 Fácil";
      case "medio":   return "🟡 Médio";
      case "dificil": return "🔴 Difícil";
      default:        return nivel;
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={recarregar}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {user?.role === "admin" && (
        <TouchableOpacity
          style={styles.adminButton}
          onPress={() => navigation.navigate("AdminTrilhas")}
        >
          <Text style={styles.adminText}>⚙ Gerenciar Trilhas</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={trilhas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.empty}>Nenhuma trilha disponível no momento</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.imagemURL }} style={styles.img} />
            <View style={styles.content}>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.info}>📍 {item.local}</Text>
              <Text style={styles.nivel}>{renderNivel(item.nivel)}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("Reserva", { trilha: item })}
              >
                <Text style={styles.buttonText}>Reservar trilha</Text>
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
  retryButton: { backgroundColor: colors.primary, padding: 12, borderRadius: 10, alignItems: "center" },
  retryText:   { color: "#fff", fontWeight: "bold" },
  card:        { backgroundColor: "#fff", margin: 12, borderRadius: 15, overflow: "hidden", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 3 }, elevation: 4 },
  img:         { width: "100%", height: 180 },
  content:     { padding: 12 },
  nome:        { fontSize: 20, fontWeight: "bold", color: colors.primary, marginBottom: 5 },
  info:        { fontSize: 14, color: "#555", marginBottom: 5 },
  nivel:       { fontSize: 14, fontWeight: "600", marginBottom: 10 },
  button:      { backgroundColor: colors.primary, padding: 12, borderRadius: 10, alignItems: "center" },
  buttonText:  { color: "#fff", fontWeight: "bold" },
  adminButton: { backgroundColor: "#222", margin: 10, padding: 12, borderRadius: 10, alignItems: "center" },
  adminText:   { color: "#fff", fontWeight: "bold" },
  empty:       { textAlign: "center", marginTop: 50, color: "#777" },
});
