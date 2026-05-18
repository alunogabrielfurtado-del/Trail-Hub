// src/screens/FormTrilha.js
//
// CORREÇÕES APLICADAS:
// [SEGURANÇA]  Validação de campos antes de gravar (validarTrilha)
// [SEGURANÇA]  imagemURL aceita apenas URLs http/https
// [CLEAN CODE] Alert.alert substituindo alert() global
// [FEATURE]    Localização salva como GeoPoint nativo do Firestore
//              no campo "localizacao" (type: geopoint)

import { useState } from "react";
import {
  View, Text, TextInput, StyleSheet,
  TouchableOpacity, Image, ScrollView, Alert,
} from "react-native";

import { db } from "../services/firebase";
import { addDoc, updateDoc, doc, collection, GeoPoint } from "firebase/firestore";
import { validarTrilha } from "../utils/validacao";

export default function FormTrilha({ route, navigation }) {
  const trilha = route.params?.trilha;

  const [nome, setNome]           = useState(trilha?.nome      || "");
  const [nivel, setNivel]         = useState(trilha?.nivel     || "");
  const [local, setLocal]         = useState(trilha?.local     || "");
  const [imagemURL, setImagemURL] = useState(trilha?.imagemURL || "");
  // Inicializa com os valores do GeoPoint existente ao editar, ou vazio ao criar
  const [latitude, setLatitude]   = useState(trilha?.localizacao ? String(trilha.localizacao.latitude)  : "");
  const [longitude, setLongitude] = useState(trilha?.localizacao ? String(trilha.localizacao.longitude) : "");
  const [salvando, setSalvando]   = useState(false);

  function validarCoordenadas() {
    if (!latitude.trim() || !longitude.trim()) {
      Alert.alert("Campos inválidos", "Informe a latitude e a longitude da trilha.");
      return false;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      Alert.alert("Campos inválidos", "Latitude inválida. Use valores entre -90 e 90.\nEx: -22.5074");
      return false;
    }

    if (isNaN(lng) || lng < -180 || lng > 180) {
      Alert.alert("Campos inválidos", "Longitude inválida. Use valores entre -180 e 180.\nEx: -43.1729");
      return false;
    }

    return true;
  }

  async function salvar() {
    const erros = validarTrilha({ nome, nivel, local, imagemURL });
    if (erros.length > 0) {
      Alert.alert("Campos inválidos", erros.join("\n"));
      return;
    }

    if (!validarCoordenadas()) return;

    setSalvando(true);
    try {
      const dados = {
        nome:         nome.trim(),
        nivel:        nivel.trim().toLowerCase(),
        local:        local.trim(),
        imagemURL:    imagemURL.trim(),
        // ✅ FEATURE: GeoPoint nativo do Firestore — aparece como type "geopoint"
        // no console com o field name "localizacao"
        localizacao:  new GeoPoint(parseFloat(latitude), parseFloat(longitude)),
      };

      if (trilha) {
        await updateDoc(doc(db, "trilhas", trilha.id), dados);
      } else {
        await addDoc(collection(db, "trilhas"), { ...dados, ativo: true });
      }

      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar trilha:", error);
      Alert.alert("Erro", "Não foi possível salvar a trilha.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{trilha ? "Editar Trilha" : "Nova Trilha"}</Text>

      <View style={styles.card}>
        {imagemURL ? (
          <Image source={{ uri: imagemURL }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={{ color: "#777" }}>Sem imagem</Text>
          </View>
        )}

        {/* ── INFORMAÇÕES BÁSICAS ── */}
        <Text style={styles.label}>Nome da trilha</Text>
        <TextInput placeholder="Ex: Trilha da Pedra Bonita" value={nome} onChangeText={setNome} style={styles.input} />

        <Text style={styles.label}>Nível</Text>
        <TextInput placeholder="Fácil / Médio / Difícil" value={nivel} onChangeText={setNivel} style={styles.input} autoCapitalize="none" />

        <Text style={styles.label}>Local</Text>
        <TextInput placeholder="Ex: Petrópolis - RJ" value={local} onChangeText={setLocal} style={styles.input} />

        <Text style={styles.label}>URL da imagem</Text>
        <TextInput placeholder="https://..." value={imagemURL} onChangeText={setImagemURL} style={styles.input} autoCapitalize="none" keyboardType="url" />

        {/* ── LOCALIZAÇÃO ── */}
        <View style={styles.separator} />
        <Text style={styles.sectionTitle}>📍 Localização no mapa</Text>
        <Text style={styles.hint}>
          Acesse maps.google.com, clique com o botão direito no local da trilha e copie as coordenadas.
        </Text>

        <View style={styles.coordRow}>
          <View style={styles.coordField}>
            <Text style={styles.label}>Latitude</Text>
            <TextInput
              placeholder="Ex: -22.5074"
              value={latitude}
              onChangeText={setLatitude}
              style={styles.input}
            />
          </View>

          <View style={styles.coordField}>
            <Text style={styles.label}>Longitude</Text>
            <TextInput
              placeholder="Ex: -43.1729"
              value={longitude}
              onChangeText={setLongitude}
              style={styles.input}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, salvando && styles.buttonDisabled]}
          onPress={salvar}
          disabled={salvando}
        >
          <Text style={styles.buttonText}>{salvando ? "Salvando..." : "Salvar Trilha"}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: "#f5f5f5" },
  title:            { fontSize: 22, fontWeight: "bold", margin: 15 },
  card:             { backgroundColor: "#fff", marginHorizontal: 15, borderRadius: 15, padding: 15, elevation: 3, marginBottom: 30 },
  image:            { width: "100%", height: 180, borderRadius: 12, marginBottom: 15 },
  imagePlaceholder: { width: "100%", height: 180, borderRadius: 12, marginBottom: 15, backgroundColor: "#eee", justifyContent: "center", alignItems: "center" },
  label:            { fontSize: 13, fontWeight: "600", marginBottom: 5, marginTop: 10 },
  input:            { backgroundColor: "#f9f9f9", borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12 },
  separator:        { height: 1, backgroundColor: "#eee", marginTop: 25, marginBottom: 15 },
  sectionTitle:     { fontSize: 14, fontWeight: "bold", color: "#2e7d32", marginBottom: 6 },
  hint:             { fontSize: 12, color: "#777", marginBottom: 5, lineHeight: 18 },
  coordRow:         { flexDirection: "row", gap: 10 },
  coordField:       { flex: 1 },
  button:           { backgroundColor: "#2e7d32", padding: 15, borderRadius: 12, marginTop: 20, alignItems: "center" },
  buttonDisabled:   { backgroundColor: "#81c784" },
  buttonText:       { color: "#fff", fontWeight: "bold", fontSize: 16 },
});