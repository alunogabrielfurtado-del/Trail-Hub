// src/screens/Cadastro.js
//
// CORREÇÕES APLICADAS:
// [SEGURANÇA]  Validação de email e telefone antes de chamar Firebase
// [SEGURANÇA]  Senha mínima de 6 caracteres verificada no cliente também
// [CLEAN CODE] useAuth hook em vez de useContext(AuthContext)
// [CLEAN CODE] Alert.alert substituindo alert() global (padrão React Native)

import { useState } from "react";
import {
  View, TextInput, StyleSheet, Text,
  TouchableOpacity, KeyboardAvoidingView, Platform, Alert,
} from "react-native";

import { useAuth } from "../hooks/useAuth";
import { validarEmail, validarTelefone } from "../utils/validacao";

export default function Cadastro() {
  const { register } = useAuth();

  const [nome, setNome]         = useState("");
  const [email, setEmail]       = useState("");
  const [senha, setSenha]       = useState("");
  const [telefone, setTelefone] = useState("");
  const [forcaSenha, setForcaSenha] = useState(0);

  function calcularForcaSenha(password) {
    let forca = 0;
    if (password.length >= 6)           forca++;
    if (/[A-Z]/.test(password))         forca++;
    if (/[0-9]/.test(password))         forca++;
    if (/[^A-Za-z0-9]/.test(password))  forca++;
    setForcaSenha(forca);
  }

  // ✅ SEGURANÇA: validações no cliente antes de qualquer chamada ao Firebase
  function validarCampos() {
    if (!nome.trim() || !email.trim() || !senha || !telefone.trim()) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return false;
    }
    if (!validarEmail(email)) {
      Alert.alert("Atenção", "Email inválido.");
      return false;
    }
    if (senha.length < 6) {
      Alert.alert("Atenção", "A senha deve ter pelo menos 6 caracteres.");
      return false;
    }
    if (!validarTelefone(telefone)) {
      Alert.alert("Atenção", "Telefone inválido. Use o formato (XX) 9XXXX-XXXX.");
      return false;
    }
    return true;
  }

  async function handleCadastro() {
    if (!validarCampos()) return;

    try {
      await register(nome.trim(), email.trim(), senha, telefone.trim());
      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
    } catch (error) {
      console.error("Erro no cadastro:", error);

      const mensagens = {
        "auth/email-already-in-use": "Este e-mail já está cadastrado.",
        "auth/invalid-email":        "E-mail inválido.",
        "auth/weak-password":        "A senha deve ter pelo menos 6 caracteres.",
      };

      Alert.alert("Erro", mensagens[error.code] ?? "Não foi possível realizar o cadastro.");
    }
  }

  function textoForca() {
    if (forcaSenha <= 1) return "Senha fraca";
    if (forcaSenha <= 3) return "Senha média";
    return "Senha forte";
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <Text style={styles.title}>🌿 Trail Hub</Text>
        <Text style={styles.subtitle}>Crie sua conta e comece a explorar</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          placeholder="Seu nome completo"
          style={styles.input}
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Seu email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          placeholder="Crie uma senha"
          style={styles.input}
          secureTextEntry
          value={senha}
          onChangeText={(text) => {
            setSenha(text);
            calcularForcaSenha(text);
          }}
        />

        <View style={styles.strengthContainer}>
          <View
            style={[
              styles.strengthBar,
              forcaSenha >= 1 && styles.weak,
              forcaSenha >= 2 && styles.medium,
              forcaSenha >= 4 && styles.strong,
            ]}
          />
          <Text style={styles.strengthText}>{textoForca()}</Text>
        </View>

        <Text style={styles.label}>Telefone</Text>
        <TextInput
          placeholder="(XX) 9XXXX-XXXX"
          style={styles.input}
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
        />

        <TouchableOpacity style={styles.button} onPress={handleCadastro}>
          <Text style={styles.buttonText}>Criar conta</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:         { flex: 1, backgroundColor: "#eaf5ea", justifyContent: "center", padding: 20 },
  header:            { alignItems: "center", marginBottom: 20 },
  title:             { fontSize: 30, fontWeight: "bold", color: "#2E7D32" },
  subtitle:          { color: "#666", marginTop: 5, textAlign: "center" },
  card:              { backgroundColor: "#fff", borderRadius: 20, padding: 20, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  label:             { fontSize: 13, fontWeight: "600", marginTop: 10, marginBottom: 5 },
  input:             { backgroundColor: "#f9f9f9", borderWidth: 1, borderColor: "#ddd", borderRadius: 12, padding: 12 },
  button:            { backgroundColor: "#2E7D32", padding: 15, borderRadius: 12, marginTop: 15, alignItems: "center" },
  buttonText:        { color: "#fff", fontWeight: "bold", fontSize: 16 },
  strengthContainer: { marginTop: 8, marginBottom: 10 },
  strengthBar:       { height: 6, width: "100%", backgroundColor: "#ddd", borderRadius: 5 },
  weak:              { backgroundColor: "#e53935" },
  medium:            { backgroundColor: "#fb8c00" },
  strong:            { backgroundColor: "#43a047" },
  strengthText:      { marginTop: 5, fontSize: 12, color: "#555" },
});
