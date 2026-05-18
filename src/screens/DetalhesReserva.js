// src/screens/DetalhesReserva.js
//
// CORREÇÕES APLICADAS:
// [BUG FIX]    navigation.goBack() no lugar de navigation.navigate("Minhas Reservas")
//              após cancelar — garante que a tela anterior (já com onSnapshot ativo)
//              reflita a exclusão sem precisar recarregar.
// [CLEAN CODE] Logs de debug removidos (console.log / console.error de diagnóstico)
// [CLEAN CODE] Alert.alert substituindo alert() global
// [CLEAN CODE] Função getStatusColor extraída do JSX
// [FEATURE]    Botão "Ver no mapa" lê latitude/longitude do GeoPoint da reserva

import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, ScrollView, Alert,
} from "react-native";

import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";

function getStatusColor(status) {
  if (status === "Confirmada") return "#2e7d32";
  if (status === "Cancelada")  return "#d32f2f";
  return "#555";
}

export default function DetalhesReserva({ route, navigation }) {
  const { reserva } = route.params;

  // GeoPoint do Firestore expõe .latitude e .longitude diretamente
  const temMapa = reserva.localizacao != null;

  async function cancelarReserva() {
    Alert.alert(
      "Cancelar reserva",
      "Tem certeza que deseja cancelar esta reserva?",
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim, cancelar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "reservas", reserva.id));
              Alert.alert("Sucesso", "Reserva cancelada.", [
                { text: "OK", onPress: () => navigation.goBack() },
              ]);
            } catch (error) {
              console.error("Erro ao cancelar reserva:", error);
              Alert.alert("Erro", "Não foi possível cancelar a reserva.");
            }
          },
        },
      ]
    );
  }

  return (
    <ScrollView style={styles.container}>
      {reserva.imagemURL && (
        <Image source={{ uri: reserva.imagemURL }} style={styles.image} />
      )}

      <View style={styles.card}>
        <Text style={styles.title}>🏕 {reserva.trilha}</Text>
        <Text style={styles.info}>📍 {reserva.local}</Text>

        <View style={styles.row}>
          <Text style={styles.info}>📅 {reserva.data}</Text>
          <Text style={styles.info}>⏰ {reserva.horario}</Text>
        </View>

        <Text style={styles.info}>👥 {reserva.pessoas} pessoas</Text>
        {reserva.nome     && <Text style={styles.info}>👤 {reserva.nome}</Text>}
        {reserva.telefone && <Text style={styles.info}>📞 {reserva.telefone}</Text>}

        <View style={styles.statusBox}>
          <Text style={[styles.status, { color: getStatusColor(reserva.status) }]}>
            {reserva.status ?? "Pendente"}
          </Text>
        </View>

        {/* ✅ FEATURE: botão só aparece se a reserva tiver GeoPoint salvo.
            O GeoPoint do Firestore já expõe .latitude e .longitude como number,
            então passamos direto para o MapaTrilha sem conversão. */}
        {temMapa && (
          <TouchableOpacity
            style={styles.mapaButton}
            onPress={() => navigation.navigate("MapaTrilha", {
              trilha: {
                nome:      reserva.trilha,
                local:     reserva.local,
                latitude:  reserva.localizacao.latitude,
                longitude: reserva.localizacao.longitude,
              },
            })}
          >
            <Text style={styles.mapaText}>🗺️ Ver localização no mapa</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.cancelButton} onPress={cancelarReserva}>
          <Text style={styles.cancelText}>Cancelar Reserva</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: "#f5f5f5" },
  image:        { width: "100%", height: 220 },
  card:         { backgroundColor: "#fff", margin: 15, padding: 15, borderRadius: 15, elevation: 3 },
  title:        { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  info:         { fontSize: 14, color: "#555", marginTop: 5 },
  row:          { flexDirection: "row", justifyContent: "space-between" },
  statusBox:    { marginTop: 15, padding: 10, backgroundColor: "#f0f0f0", borderRadius: 10, alignItems: "center" },
  status:       { fontWeight: "bold", fontSize: 15 },
  mapaButton:   { marginTop: 15, backgroundColor: "#1565c0", padding: 15, borderRadius: 12, alignItems: "center" },
  mapaText:     { color: "#fff", fontWeight: "bold" },
  cancelButton: { marginTop: 10, backgroundColor: "#d32f2f", padding: 15, borderRadius: 12, alignItems: "center" },
  cancelText:   { color: "#fff", fontWeight: "bold" },
  backButton:   { marginTop: 10, backgroundColor: "#ddd", padding: 15, borderRadius: 12, alignItems: "center" },
  backText:     { color: "#333", fontWeight: "bold" },
});