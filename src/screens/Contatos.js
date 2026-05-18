// src/screens/Contatos.js
//
// CORREÇÕES APLICADAS:
// [SEGURANÇA]  Validação de email e campos obrigatórios antes de gravar no Firestore
// [SEGURANÇA]  serverTimestamp() do Firestore substituindo Date.now() (evita manipulação client-side)
// [CLEAN CODE] useAuth hook em vez de useContext direto

import { useState } from "react";
import {
  View, Text, TextInput, StyleSheet,
  TouchableOpacity, ScrollView, Alert,
} from "react-native";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../hooks/useAuth";
import { validarEmail } from "../utils/validacao";

export default function Contatos() {
  const { user } = useAuth();

  const [nome, setNome]         = useState("");
  const [email, setEmail]       = useState("");
  const [assunto, setAssunto]   = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);

  // ✅ SEGURANÇA: valida todos os campos antes de gravar
  function validarCampos() {
    if (!nome.trim() || !email.trim() || !assunto.trim() || !mensagem.trim()) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return false;
    }
    if (!validarEmail(email)) {
      Alert.alert("Atenção", "E-mail inválido.");
      return false;
    }
    if (mensagem.trim().length < 10) {
      Alert.alert("Atenção", "Mensagem muito curta. Escreva ao menos 10 caracteres.");
      return false;
    }
    return true;
  }

  async function enviarMensagem() {
    if (!validarCampos()) return;

    setEnviando(true);
    try {
      await addDoc(collection(db, "mensagens"), {
        nome:      nome.trim(),
        email:     email.trim().toLowerCase(),
        assunto:   assunto.trim(),
        mensagem:  mensagem.trim(),
        userId:    user?.uid ?? null,
        lida:      false,
        // ✅ SEGURANÇA: timestamp gerado pelo servidor, não pelo cliente
        createdAt: serverTimestamp(),
      });

      Alert.alert("Sucesso", "Mensagem enviada com sucesso!");
      setNome("");
      setEmail("");
      setAssunto("");
      setMensagem("");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      Alert.alert("Erro", "Falha ao enviar mensagem. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Central de Suporte</Text>
        <Text style={styles.subtitle}>Estamos aqui para te ajudar</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <TextInput style={styles.input} placeholder="Seu nome" value={nome} onChangeText={setNome} />

        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} placeholder="Seu email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

        <Text style={styles.label}>Assunto</Text>
        <TextInput style={styles.input} placeholder="Assunto da mensagem" value={assunto} onChangeText={setAssunto} />

        <Text style={styles.label}>Mensagem</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Escreva sua mensagem..."
          value={mensagem}
          onChangeText={setMensagem}
          multiline
        />

        <TouchableOpacity
          style={[styles.button, enviando && styles.buttonDisabled]}
          onPress={enviarMensagem}
          disabled={enviando}
        >
          <Text style={styles.buttonText}>
            {enviando ? "Enviando..." : "Enviar Mensagem"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Outros canais</Text>
        <Text style={styles.infoText}>📧 contato@trailhub.com</Text>
        <Text style={styles.infoText}>📞 (24) 99999-9999</Text>
        <Text style={styles.infoText}>💬 WhatsApp disponível</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:      { backgroundColor: "#f5f5f5", flex: 1 },
  header:         { backgroundColor: "#2e7d32", padding: 20, alignItems: "center" },
  title:          { fontSize: 22, fontWeight: "bold", color: "#fff" },
  subtitle:       { color: "#dfeee0", marginTop: 5 },
  card:           { backgroundColor: "#fff", margin: 15, padding: 15, borderRadius: 15, elevation: 3 },
  label:          { fontSize: 13, fontWeight: "600", marginTop: 10, marginBottom: 5, color: "#333" },
  input:          { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12, backgroundColor: "#fafafa" },
  textArea:       { height: 120, textAlignVertical: "top" },
  button:         { backgroundColor: "#2e7d32", padding: 15, borderRadius: 12, marginTop: 15, alignItems: "center" },
  buttonDisabled: { backgroundColor: "#81c784" },
  buttonText:     { color: "#fff", fontWeight: "bold" },
  infoBox:        { margin: 15, padding: 15, backgroundColor: "#fff", borderRadius: 12 },
  infoTitle:      { fontWeight: "bold", marginBottom: 10 },
  infoText:       { color: "#555", marginBottom: 5 },
});
