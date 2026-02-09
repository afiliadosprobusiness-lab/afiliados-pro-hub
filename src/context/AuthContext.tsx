import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { apiFetch } from "@/lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    await apiFetch("/users/bootstrap", {
      method: "POST",
      body: JSON.stringify({}),
    });
    return credential.user;
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const credential = await signInWithPopup(auth, provider);
    await apiFetch("/users/bootstrap", {
      method: "POST",
      body: JSON.stringify({}),
    });
    return credential.user;
  };

  const signUp = async (email, password, fullName, referrerCode) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    if (fullName) {
      await updateProfile(credential.user, { displayName: fullName });
    }
    await apiFetch("/users/bootstrap", {
      method: "POST",
      body: JSON.stringify({ fullName, referrerCode }),
    });
    return credential.user;
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const value = useMemo(
    () => ({ user, loading, signIn, signInWithGoogle, signUp, signOut }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
