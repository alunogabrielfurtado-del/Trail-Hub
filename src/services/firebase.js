import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import Constants from "expo-constants";
 
const extra = Constants.expoConfig?.extra ?? {};
 
const firebaseConfig = {
  apiKey:            extra.firebaseApiKey,
  authDomain:        extra.firebaseAuthDomain,
  projectId:         extra.firebaseProjectId,
  storageBucket:     extra.firebaseStorageBucket,
  messagingSenderId: extra.firebaseMessagingSenderId,
  appId:             extra.firebaseAppId,
};
 
const app = initializeApp(firebaseConfig);
 
const auth = Platform.OS === "web"
  ? getAuth(app)
  : initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
 
export { auth };
export const db      = getFirestore(app);
export const storage = getStorage(app);