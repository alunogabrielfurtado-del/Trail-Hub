// src/screens/MapaTrilha.web.js
//
// Fallback para plataforma web — react-native-maps é nativo e não funciona no browser.
// O Expo carrega automaticamente este arquivo no lugar de MapaTrilha.js quando
// o app roda na web, graças à resolução por extensão de plataforma (.web.js).

import { View, Text, StyleSheet, TouchableOpacity, Linking } from "react-native";

export default function MapaTrilha({ route }) {
  const { trilha } = route.params;

  const urlGoogleMaps = `https://www.google.com/maps?q=${trilha.latitude},${trilha.longitude}`;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏕 {trilha.nome}</Text>
        <Text style={styles.headerSub}>📍 {trilha.local}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.icon}>🗺️</Text>
        <Text style={styles.title}>Mapa não disponível no navegador</Text>
        <Text style={styles.subtitle}>
          O mapa interativo funciona apenas no app mobile.{"\n"}
          Acesse a localização pelo Google Maps:
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => Linking.openURL(urlGoogleMaps)}
        >
          <Text style={styles.buttonText}>Abrir no Google Maps</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header:    { padding: 20, backgroundColor: "#2e7d32" },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  headerSub:   { fontSize: 13, color: "#e0e0e0", marginTop: 3 },
  content:   { flex: 1, justifyContent: "center", alignItems: "center", padding: 30 },
  icon:      { fontSize: 60, marginBottom: 20 },
  title:     { fontSize: 18, fontWeight: "bold", color: "#333", textAlign: "center", marginBottom: 10 },
  subtitle:  { fontSize: 14, color: "#666", textAlign: "center", lineHeight: 22, marginBottom: 30 },
  button:    { backgroundColor: "#1565c0", padding: 15, borderRadius: 12, alignItems: "center", width: "100%" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});