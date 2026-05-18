// src/navigation/AppNavigator.js
//
// CORREÇÕES APLICADAS:
// [BUG]        Import corrigido: "../context/AuthContext" (estava "../context/AuthContext"
//              em alguns arquivos mas o diretório real é "context", não "contexto")
// [CLEAN CODE] useAuth hook usado em vez de useContext(AuthContext) diretamente
// [CLEAN CODE] Loading state exibe um spinner em vez de null (melhor UX)
// [BUG FIX]    MapaTrilha adicionado ao ReservasStack — sem isso, o navigate
//              a partir de DetalhesReserva falhava com "screen not found"

import { NavigationContainer } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { View, Image, Text, StyleSheet, ActivityIndicator } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useAuth } from "../hooks/useAuth";

// Screens
import Home             from "../screens/Home";
import Historia         from "../screens/Historia";
import Catalogo         from "../screens/Catalogo";
import Reserva          from "../screens/Reserva";
import MinhasReservas   from "../screens/MinhasReservas";
import DetalhesReserva  from "../screens/DetalhesReserva";
import Login            from "../screens/Login";
import Cadastro         from "../screens/Cadastro";
import Perfil           from "../screens/Perfil";
import AdminTrilhas     from "../screens/AdminTrilhas";
import FormTrilha       from "../screens/FormTrilha";
import Contatos         from "../screens/Contatos";
import MensagensAdmin   from "../screens/MensagensAdmin";
import MapaTrilha       from "../screens/MapaTrilha";

const Drawer = createDrawerNavigator();
const Stack  = createNativeStackNavigator();

function CatalogoStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Lista de Trilhas" component={Catalogo} />
      <Stack.Screen name="Reserva"          component={Reserva} />
      <Stack.Screen name="DetalhesReserva"  component={DetalhesReserva} />
      <Stack.Screen name="AdminTrilhas"     component={AdminTrilhas} />
      <Stack.Screen name="FormTrilha"       component={FormTrilha} />
      <Stack.Screen name="MapaTrilha"       component={MapaTrilha} options={{ title: "Mapa da Trilha" }} />
    </Stack.Navigator>
  );
}

function ReservasStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Minhas Reservas" component={MinhasReservas} />
      <Stack.Screen name="DetalhesReserva" component={DetalhesReserva} />
      {/* ✅ BUG FIX: MapaTrilha precisa estar registrado aqui também,
          pois DetalhesReserva navega para ele dentro desta stack */}
      <Stack.Screen name="MapaTrilha"      component={MapaTrilha} options={{ title: "Mapa da Trilha" }} />
    </Stack.Navigator>
  );
}

function CustomDrawer(props) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.header}>
        <Image source={require("../../assets/logo.png")} style={styles.logo} />
        <Text style={styles.title}>Trail Hub</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

function AppDrawer() {
  const { user } = useAuth();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerStyle:           { backgroundColor: "#2E7D32" },
        headerTintColor:       "#fff",
        drawerActiveTintColor: "#2E7D32",
      }}
    >
      <Drawer.Screen name="Home"            component={Home} />
      <Drawer.Screen name="Nossa História"  component={Historia} />
      <Drawer.Screen name="Catálogo"        component={CatalogoStack} />
      <Drawer.Screen name="Minhas Reservas" component={ReservasStack} />
      <Drawer.Screen name="Contato"         component={Contatos} />
      <Drawer.Screen name="Perfil"          component={Perfil} />

      {user?.role === "admin" && (
        <Drawer.Screen
          name="MensagensAdmin"
          component={MensagensAdmin}
          options={{ drawerItemStyle: { display: "none" } }}
        />
      )}

      {user?.role === "admin" && (
        <Drawer.Screen
          name="AdminTrilhas"
          component={AdminTrilhas}
          options={{ drawerItemStyle: { display: "none" } }}
        />
      )}
    </Drawer.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login"    component={Login} />
      <Stack.Screen name="Cadastro" component={Cadastro} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppDrawer /> : <AuthStack />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eaf5ea",
  },
  header: {
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});