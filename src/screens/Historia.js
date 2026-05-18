import React from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  Image,
  View
} from "react-native";

import colors from "../styles/colors";

export default function Historia() {
  return (
    <ScrollView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>🌿 Nossa História</Text>
        <Text style={styles.subtitle}>
          Conheça o propósito do Trail Hub
        </Text>
      </View>

      {/* CARD 1 */}
      <View style={styles.card}>
        <Image
          source={require("../../assets/historia1.jpg")}
          style={styles.img}
        />

        <Text style={styles.text}>
          O Trail Hub surgiu em 2026 como um projeto acadêmico com o objetivo de unir tecnologia e aventura, criando uma plataforma digital voltada para ecoturismo e trilhas.
        </Text>

        <Text style={styles.text}>
          A ideia nasceu da dificuldade de encontrar trilhas confiáveis, informações de segurança e formas organizadas de reserva.
        </Text>
      </View>

      {/* CARD 2 */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🎯 Nossa missão</Text>

        <Text style={styles.text}>
          Conectar pessoas à natureza por meio da tecnologia, facilitando o acesso a trilhas de forma segura, organizada e acessível.
        </Text>

        <Text style={styles.text}>
          O Trail Hub não é apenas um aplicativo, mas uma plataforma que incentiva exploração, descoberta e experiências inesquecíveis.
        </Text>
      </View>

      {/* CARD 3 */}
      <View style={styles.card}>
        <Image
          source={require("../../assets/historia2.jpg")}
          style={styles.img}
        />

        <Text style={styles.text}>
          Nosso objetivo é tornar o ecoturismo mais acessível e incentivar um contato mais consciente com a natureza.
        </Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15
  },

  header: {
    marginBottom: 15
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center"
  },

  subtitle: {
    textAlign: "center",
    color: "#666",
    marginTop: 5,
    fontSize: 14
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 3
  },

  img: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 12
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333"
  },

  text: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
    textAlign: "justify",
    marginBottom: 10
  }
});