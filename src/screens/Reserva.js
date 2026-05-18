// src/screens/Reserva.js
//
// CORREÇÕES APLICADAS:
// [SEGURANÇA]  Validação de data, horário e número de pessoas antes de gravar
// [SEGURANÇA]  serverTimestamp() no lugar de ausência de timestamp
// [CLEAN CODE] useAuth hook em vez de useContext direto
// [CLEAN CODE] Alert.alert substituindo alert() global
// [CLEAN CODE] Estado de carregamento no botão (evita duplo envio)
// [FEATURE]    GeoPoint da trilha copiado para a reserva no campo "localizacao"

import { useState } from "react";
import {
  View, Text, TextInput, StyleSheet,
  TouchableOpacity, Image, ScrollView, Alert,
} from "react-native";

import { useAuth } from "../hooks/useAuth";
import { db } from "../services/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { validarReserva } from "../utils/validacao";

export default function Reserva({ route, navigation }) {
  const { trilha }  = route.params;
  const { user }    = useAuth();

  const [data, setData]         = useState("");
  const [horario, setHorario]   = useState("");
  const [pessoas, setPessoas]   = useState("");
  const [enviando, setEnviando] = useState(false);

  async function confirmar() {
    const erros = validarReserva({ data, horario, pessoas });
    if (erros.length > 0) {
      Alert.alert("Campos inválidos", erros.join("\n"));
      return;
    }

    setEnviando(true);
    try {
      await addDoc(collection(db, "reservas"), {
        userId:     user.uid,
        nome:       user.nome     ?? "",
        telefone:   user.telefone ?? "",
        trilha:     trilha.nome,
        local:      trilha.local,
        imagemURL:  trilha.imagemURL ?? "",
        // ✅ FEATURE: GeoPoint copiado diretamente do objeto trilha.
        // null como fallback para trilhas antigas sem coordenadas.
        localizacao: trilha.localizacao ?? null,
        data:       data.trim(),
        horario:    horario.trim(),
        pessoas:    parseInt(pessoas, 10),
        status:     "Confirmada",
        createdAt:  serverTimestamp(),
      });

      Alert.alert("Sucesso", "Reserva confirmada!", [
        { text: "OK", onPress: () => navigation.navigate("Minhas Reservas") },
      ]);
    } catch (error) {
      console.error("Erro ao reservar:", error);
      Alert.alert("Erro", "Não foi possível confirmar a reserva.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Image source={{ uri: trilha.imagemURL }} style={styles.image} />
        <View style={styles.cardContent}>
          <Text style={styles.title}>{trilha.nome}</Text>
          <Text style={styles.info}>📍 {trilha.local}</Text>
        </View>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Data da reserva</Text>
        <TextInput
          placeholder="DD/MM/AAAA"
          style={styles.input}
          value={data}
          onChangeText={setData}
        />

        <Text style={styles.label}>Horário</Text>
        <TextInput
          placeholder="HH:MM"
          style={styles.input}
          value={horario}
          onChangeText={setHorario}
        />

        <Text style={styles.label}>Número de pessoas</Text>
        <TextInput
          placeholder="Ex: 2"
          keyboardType="numeric"
          style={styles.input}
          value={pessoas}
          onChangeText={setPessoas}
        />

        <TouchableOpacity
          style={[styles.button, enviando && styles.buttonDisabled]}
          onPress={confirmar}
          disabled={enviando}
        >
          <Text style={styles.buttonText}>
            {enviando ? "Confirmando..." : "Confirmar Reserva"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: "#f5f5f5" },
  card:           { margin: 15, backgroundColor: "#fff", borderRadius: 15, overflow: "hidden", elevation: 3 },
  image:          { width: "100%", height: 180 },
  cardContent:    { padding: 12 },
  title:          { fontSize: 20, fontWeight: "bold", marginBottom: 5 },
  info:           { color: "#555" },
  form:           { padding: 15 },
  label:          { fontSize: 14, fontWeight: "600", marginBottom: 5, marginTop: 10 },
  input:          { backgroundColor: "#fff", padding: 12, borderRadius: 10, borderWidth: 1, borderColor: "#ddd" },
  button:         { backgroundColor: "#2e7d32", padding: 15, borderRadius: 12, marginTop: 20, alignItems: "center" },
  buttonDisabled: { backgroundColor: "#81c784" },
  buttonText:     { color: "#fff", fontWeight: "bold", fontSize: 16 },
});