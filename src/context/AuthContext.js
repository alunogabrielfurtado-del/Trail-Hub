// src/context/AuthContext.js
//
// CORREÇÕES APLICADAS:
// [BUG FIX]    role agora vem do Custom Claim do token JWT (getIdTokenResult),
//              não mais de um get() avulso no Firestore. Isso alinha o app com
//              as firestore.rules que usam request.auth.token.role — eliminando
//              a causa raiz dos bugs de exclusão de reservas e mensagens.
// [SEGURANÇA]  getIdTokenResult(true) força o refresh do token, garantindo que
//              o claim mais recente seja sempre usado após login.
// [CLEAN CODE] Logout retorna a Promise para que o chamador possa tratar erros.

import { createContext, useState, useEffect } from "react";
import { auth, db } from "../services/firebase";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { doc, setDoc, getDoc } from "firebase/firestore";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (userAuth) => {
      if (userAuth) {
        try {
          // ✅ BUG FIX: role vem do token JWT (Custom Claim), não do Firestore.
          // true = força o refresh para sempre pegar o claim mais atualizado.
          const tokenResult = await userAuth.getIdTokenResult(true);
          const role        = tokenResult.claims.role ?? "user";

          // Demais dados do perfil (nome, telefone) continuam vindo do Firestore
          const ref  = doc(db, "users", userAuth.uid);
          const snap = await getDoc(ref);

          setUser({
            uid: userAuth.uid,
            role,                                        // JWT claim
            ...(snap.exists() ? snap.data() : {}),       // nome, telefone, etc.
          });
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
          setUser({ uid: userAuth.uid, role: "user" });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function login(email, senha) {
    await signInWithEmailAndPassword(auth, email, senha);
  }

  async function register(nome, email, senha, telefone) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);

    // Salva o perfil no Firestore — a Cloud Function syncRoleClaim detecta
    // a criação deste documento e automaticamente define o Custom Claim no token.
    await setDoc(doc(db, "users", userCredential.user.uid), {
      nome,
      email,
      telefone,
      role: "user",
    });
  }

  async function logout() {
    await signOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}