import AppNavigator from "./src/navigation/AppNavigator";
import { ReservasProvider } from "./src/context/ReservasContext";
import { AuthProvider } from "./src/context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <ReservasProvider>
        <AppNavigator />
      </ReservasProvider>
    </AuthProvider>
  );
}