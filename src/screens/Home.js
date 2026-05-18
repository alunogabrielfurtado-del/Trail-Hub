import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground
} from "react-native";

import colors from "../styles/colors";

export default function Home() {
  const cards = [
    {
      img: require("../../assets/home1.jpg"),
      text: "Explore trilhas incríveis pelo Brasil"
    },
    {
      img: require("../../assets/home2.jpg"),
      text: "Conecte-se com a natureza"
    },
    {
      img: require("../../assets/home3.jpg"),
      text: "Aventure-se com segurança"
    }
  ];

  return (
    <ScrollView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>🌿 Trail Hub</Text>
        <Text style={styles.subtitle}>
          Descubra sua próxima aventura
        </Text>
      </View>

      {/* CARDS */}
      {cards.map((item, index) => (
        <View key={index} style={styles.card}>

          <ImageBackground
            source={item.img}
            style={styles.image}
            imageStyle={{ borderRadius: 16 }}
          >

            <View style={styles.overlay}>
              <Text style={styles.cardText}>
                {item.text}
              </Text>
            </View>

          </ImageBackground>

        </View>
      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    padding: 15
  },

  header: {
    marginBottom: 20
  },

  title: {
    fontSize: 30,
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
    marginBottom: 18,
    borderRadius: 16,

    // sombra
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4
  },

  image: {
    width: "100%",
    height: 180,
    justifyContent: "flex-end"
  },

  overlay: {
    backgroundColor: "rgba(0,0,0,0.35)",
    padding: 15,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16
  },

  cardText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  }
});