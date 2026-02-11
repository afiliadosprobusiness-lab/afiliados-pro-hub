import { initializeApp } from "firebase/app";
import { browserLocalPersistence, getAuth, setPersistence } from "firebase/auth";

const fallbackFirebaseConfig = {
  apiKey: "AIzaSyD5QG-K9-GDq3FkOIV2pqKk2UDvuqYaD7Y",
  authDomain: "afiliados-pro-fe361.firebaseapp.com",
  projectId: "afiliados-pro-fe361",
  storageBucket: "afiliados-pro-fe361.firebasestorage.app",
  messagingSenderId: "820933542671",
  appId: "1:820933542671:web:df72c4f86030cf3d7bb47a",
};

const expectedProjectId = fallbackFirebaseConfig.projectId;
const hasExpectedEnvProject =
  (import.meta.env.VITE_FIREBASE_PROJECT_ID || "").trim() === expectedProjectId;

const firebaseConfig = {
  apiKey: hasExpectedEnvProject ? import.meta.env.VITE_FIREBASE_API_KEY : fallbackFirebaseConfig.apiKey,
  authDomain: hasExpectedEnvProject
    ? import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
    : fallbackFirebaseConfig.authDomain,
  projectId: hasExpectedEnvProject
    ? import.meta.env.VITE_FIREBASE_PROJECT_ID
    : fallbackFirebaseConfig.projectId,
  storageBucket: hasExpectedEnvProject
    ? import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
    : fallbackFirebaseConfig.storageBucket,
  messagingSenderId: hasExpectedEnvProject
    ? import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID
    : fallbackFirebaseConfig.messagingSenderId,
  appId: hasExpectedEnvProject ? import.meta.env.VITE_FIREBASE_APP_ID : fallbackFirebaseConfig.appId,
};

if (!firebaseConfig.apiKey) {
  throw new Error("Missing Firebase API key");
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence).catch(() => {
  // Fallback to default persistence if it fails.
});
