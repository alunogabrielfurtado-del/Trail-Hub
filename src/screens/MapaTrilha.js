// src/screens/MapaTrilha.js
//
// Exibe o mapa com um marcador na localização da trilha.
// Recebe o objeto "trilha" via route.params, que deve conter
// os campos latitude (number) e longitude (number).
//
// Dependências: react-native-maps, expo-location
// Instalação:   npx expo install react-native-maps expo-location

import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";

export default function MapaTrilha({ route }) {
  const { trilha } = route.params;

  const [localizacaoUsuario, setLocalizacaoUsuario] = useState(null);
  const [loadingLoc, setLoadingLoc]                 = useState(true);

  // Coordenadas da trilha vindas do Firestore
  const coordTrilha = {
    latitude:  parseFloat(trilha.latitude),
    longitude: parseFloat(trilha.longitude),
  };

  useEffect(() => {
    async function obterLocalizacao() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          Alert.alert(
            "Permissão negada",
            "Ative a localização para ver sua posição no mapa."
          );
          setLoadingLoc(false);
          return;
        }

        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        setLocalizacaoUsuario({
          latitude:  loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      } catch (error) {
        console.error("Erro ao obter localização:", error);
      } finally {
        setLoadingLoc(false);
      }
    }

    obterLocalizacao();
  }, []);

  // Região inicial centralizada na trilha, com zoom adequado
  const regiaoInicial = {
    latitude:        coordTrilha.latitude,
    longitude:       coordTrilha.longitude,
    latitudeDelta:   0.05,
    longitudeDelta:  0.05,
  };

  if (loadingLoc) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text style={{ marginTop: 10 }}>Carregando mapa...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho com nome da trilha */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🏕 {trilha.nome}</Text>
        <Text style={styles.headerSub}>📍 {trilha.local}</Text>
      </View>

      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={regiaoInicial}
        showsUserLocation={!!localizacaoUsuario}   // ponto azul do usuário
        showsMyLocationButton={!!localizacaoUsuario}
      >
        {/* Marcador da trilha */}
        <Marker
          coordinate={coordTrilha}
          title={trilha.nome}
          description={trilha.local}
          pinColor="#2e7d32"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: "#f5f5f5" },
  center:      { flex: 1, justifyContent: "center", alignItems: "center" },
  header:      { padding: 15, backgroundColor: "#2e7d32" },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  headerSub:   { fontSize: 13, color: "#e0e0e0", marginTop: 3 },
  map:         { flex: 1 },
});