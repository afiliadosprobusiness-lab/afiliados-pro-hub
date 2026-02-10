import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
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
const SESSION_KEY = "afp_session_started_at";
const SESSION_TTL = 24 * 60 * 60 * 1000;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const logoutTimer = useRef(null);

  const clearLogoutTimer = () => {
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
      logoutTimer.current = null;
    }
  };

  const scheduleAutoLogout = (startedAt) => {
    clearLogoutTimer();
    const elapsed = Date.now() - startedAt;
    const remaining = SESSION_TTL - elapsed;
    if (remaining <= 0) return;
    logoutTimer.current = setTimeout(async () => {
      localStorage.removeItem(SESSION_KEY);
      await firebaseSignOut(auth);
    }, remaining);
  };

  const touchSession = () => {
    const now = Date.now();
    localStorage.setItem(SESSION_KEY, String(now));
    scheduleAutoLogout(now);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      clearLogoutTimer();

      if (currentUser) {
        const startedAt = Number(localStorage.getItem(SESSION_KEY) || 0);
        if (!startedAt) {
          localStorage.setItem(SESSION_KEY, String(Date.now()));
          scheduleAutoLogout(Date.now());
        } else if (Date.now() - startedAt > SESSION_TTL) {
          localStorage.removeItem(SESSION_KEY);
          await firebaseSignOut(auth);
          setUser(null);
          setLoading(false);
          return;
        } else {
          scheduleAutoLogout(startedAt);
        }
      } else {
        localStorage.removeItem(SESSION_KEY);
      }

      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    touchSession();
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
    touchSession();
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
    touchSession();
    await apiFetch("/users/bootstrap", {
      method: "POST",
      body: JSON.stringify({ fullName, referrerCode }),
    });
    return credential.user;
  };

  const signOut = async () => {
    clearLogoutTimer();
    localStorage.removeItem(SESSION_KEY);
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
