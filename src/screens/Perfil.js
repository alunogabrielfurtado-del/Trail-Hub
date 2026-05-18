// src/screens/Perfil.js
//
// CORREÇÕES APLICADAS:
// [CLEAN CODE] useAuth hook em vez de useContext direto
// [CLEAN CODE] Alert.alert substituindo alert() global
// [CLEAN CODE] Logout com tratamento de erro

import { useState, useEffect } from "react";
import {
  View, Text, TextInput, StyleSheet,
  TouchableOpacity, ActivityIndicator, Alert,
} from "react-native";

import { useAuth } from "../hooks/useAuth";
import { db } from "../services/firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function Perfil({ navigation }) {
  const { user, logout } = useAuth();

  const [nome, setNome]         = useState("");
  const [telefone, setTelefone] = useState("");
  const [loading, setLoading]   = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (user) {
      setNome(user.nome ?? "");
      setTelefone(user.telefone ?? "");
      setLoading(false);
    }
  }, [user]);

  async function salvar() {
    if (!nome.trim()) {
      Alert.alert("Atenção", "O nome não pode ficar em branco.");
      return;
    }

    setSalvando(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        nome:     nome.trim(),
        telefone: telefone.trim(),
      });
      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
      Alert.alert("Erro", "Não foi possível atualizar o perfil.");
    } finally {
      setSalvando(false);
    }
  }

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error("Erro ao sair:", error);
      Alert.alert("Erro", "Não foi possível sair da conta.");
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text style={{ marginTop: 10 }}>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {nome?.charAt(0)?.toUpperCase() ?? "U"}
          </Text>
        </View>
        <Text style={styles.title}>Meu Perfil</Text>
        <Text style={styles.subtitle}>Gerencie suas informações</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <TextInput value={nome} onChangeText={setNome} style={styles.input} placeholder="Seu nome" />

        <Text style={styles.label}>Telefone</Text>
        <TextInput value={telefone} onChangeText={setTelefone} style={styles.input} placeholder="Seu telefone" keyboardType="phone-pad" />

        <TouchableOpacity
          style={[styles.saveButton, salvando && styles.buttonDisabled]}
          onPress={salvar}
          disabled={salvando}
        >
          <Text style={styles.saveText}>
            {salvando ? "Salvando..." : "Salvar alterações"}
          </Text>
        </TouchableOpacity>

        {user?.role === "admin" && (
          <TouchableOpacity
            style={styles.adminButton}
            onPress={() => navigation.navigate("MensagensAdmin")}
          >
            <Text style={styles.adminText}>Mensagens dos usuários</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: "#f5f5f5" },
  center:         { flex: 1, justifyContent: "center", alignItems: "center" },
  header:         { alignItems: "center", paddingVertical: 25, backgroundColor: "#2e7d32" },
  avatar:         { width: 70, height: 70, borderRadius: 35, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", marginBottom: 10 },
  avatarText:     { fontSize: 28, fontWeight: "bold", color: "#2e7d32" },
  title:          { fontSize: 20, fontWeight: "bold", color: "#fff" },
  subtitle:       { fontSize: 12, color: "#e0e0e0", marginTop: 3 },
  card:           { backgroundColor: "#fff", margin: 15, padding: 15, borderRadius: 15, elevation: 3 },
  label:          { fontSize: 13, fontWeight: "600", marginTop: 10, marginBottom: 5 },
  input:          { backgroundColor: "#f9f9f9", borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12 },
  saveButton:     { backgroundColor: "#2e7d32", padding: 15, borderRadius: 12, marginTop: 20, alignItems: "center" },
  buttonDisabled: { backgroundColor: "#81c784" },
  saveText:       { color: "#fff", fontWeight: "bold" },
  adminButton:    { backgroundColor: "#1565c0", padding: 15, borderRadius: 12, marginTop: 10, alignItems: "center" },
  adminText:      { color: "#fff", fontWeight: "bold" },
  logoutButton:   { backgroundColor: "#d32f2f", padding: 15, borderRadius: 12, marginTop: 10, alignItems: "center" },
  logoutText:     { color: "#fff", fontWeight: "bold" },
});
