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
const BOOTSTRAP_KEY_PREFIX = "afp_bootstrap_user_";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const logoutTimer = useRef(null);
  const bootstrapTimer = useRef(null);
  const bootstrapInFlight = useRef(false);

  const clearLogoutTimer = () => {
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
      logoutTimer.current = null;
    }
  };

  const clearBootstrapTimer = () => {
    if (bootstrapTimer.current) {
      clearTimeout(bootstrapTimer.current);
      bootstrapTimer.current = null;
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

  const bootstrapUser = async (currentUser, attempt = 0) => {
    if (!currentUser || bootstrapInFlight.current) return;
    bootstrapInFlight.current = true;

    try {
      await apiFetch("/users/bootstrap", {
        method: "POST",
        body: JSON.stringify({}),
      });
      localStorage.setItem(`${BOOTSTRAP_KEY_PREFIX}${currentUser.uid}`, String(Date.now()));
      clearBootstrapTimer();
    } catch (error) {
      if (attempt < 2) {
        const delay = 2000 * (attempt + 1);
        clearBootstrapTimer();
        bootstrapTimer.current = setTimeout(() => {
          bootstrapUser(currentUser, attempt + 1);
        }, delay);
      }
    } finally {
      bootstrapInFlight.current = false;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      clearLogoutTimer();
      clearBootstrapTimer();

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

        const bootstrapKey = `${BOOTSTRAP_KEY_PREFIX}${currentUser.uid}`;
        if (!localStorage.getItem(bootstrapKey)) {
          bootstrapUser(currentUser, 0);
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
    await bootstrapUser(credential.user, 0);
    return credential.user;
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    const credential = await signInWithPopup(auth, provider);
    touchSession();
    await bootstrapUser(credential.user, 0);
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
    localStorage.setItem(`${BOOTSTRAP_KEY_PREFIX}${credential.user.uid}`, String(Date.now()));
    return credential.user;
  };

  const signOut = async () => {
    clearLogoutTimer();
    clearBootstrapTimer();
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
