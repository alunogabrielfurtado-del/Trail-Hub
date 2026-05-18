// src/screens/Login.js
//
// CORREÇÕES APLICADAS:
// [SEGURANÇA]  Validação básica de email antes da chamada ao Firebase
// [CLEAN CODE] useAuth hook em vez de useContext direto
// [CLEAN CODE] value controlado nos TextInputs (estado ligado ao input)

import { useState } from "react";
import {
  View, TextInput, StyleSheet, Text,
  TouchableOpacity, KeyboardAvoidingView, Platform,
} from "react-native";

import { useAuth } from "../hooks/useAuth";
import { validarEmail } from "../utils/validacao";

export default function Login({ navigation }) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro]   = useState("");

  async function handleLogin() {
    setErro("");

    // ✅ SEGURANÇA: validação antes de chamar o Firebase
    if (!email.trim() || !senha) {
      setErro("Preencha e-mail e senha.");
      return;
    }
    if (!validarEmail(email)) {
      setErro("E-mail inválido.");
      return;
    }

    try {
      await login(email.trim(), senha);
    } catch (error) {
      console.error("Erro no login:", error);

      const mensagens = {
        "auth/invalid-credential":  "E-mail ou senha inválidos.",
        "auth/user-not-found":      "Usuário não cadastrado.",
        "auth/wrong-password":      "Senha incorreta.",
        "auth/too-many-requests":   "Muitas tentativas. Tente novamente mais tarde.",
      };

      setErro(mensagens[error.code] ?? "Erro ao fazer login.");
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <Text style={styles.title}>🌿 Trail Hub</Text>
        <Text style={styles.subtitle}>Bem-vindo de volta</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Digite seu email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          placeholder="Digite sua senha"
          secureTextEntry
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
        />

        {erro !== "" && <Text style={styles.error}>{erro}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <Text style={styles.link} onPress={() => navigation.navigate("Cadastro")}>
          Não tem conta?{" "}
          <Text style={{ fontWeight: "bold" }}>Criar agora</Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: "#eaf5ea", justifyContent: "center", padding: 20 },
  header:     { alignItems: "center", marginBottom: 20 },
  title:      { fontSize: 30, fontWeight: "bold", color: "#2E7D32" },
  subtitle:   { color: "#666", marginTop: 5 },
  card:       { backgroundColor: "#fff", borderRadius: 20, padding: 20, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  label:      { fontSize: 13, fontWeight: "600", marginTop: 10, marginBottom: 5 },
  input:      { backgroundColor: "#f9f9f9", borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 12 },
  button:     { backgroundColor: "#2E7D32", padding: 15, borderRadius: 12, marginTop: 15, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  error:      { color: "#d32f2f", marginTop: 10, textAlign: "center", fontWeight: "500" },
  link:       { marginTop: 15, textAlign: "center", color: "#2E7D32" },
});
