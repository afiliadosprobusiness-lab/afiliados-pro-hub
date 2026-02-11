import { auth } from "@/lib/firebase";

const fallbackBackendUrl = "https://afiliados-pro-hub-backend-866073833887.us-central1.run.app";
const baseUrl = (import.meta.env.VITE_BACKEND_URL || fallbackBackendUrl).replace(/\/$/, "");

const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No authenticated user");
  }
  return user.getIdToken();
};

export const apiFetch = async (path, options = {}) => {
  if (!baseUrl) {
    throw new Error("Missing backend URL");
  }

  const token = await getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }

  return response.json();
};

export const apiFetchPublic = async (path, options = {}) => {
  if (!baseUrl) {
    throw new Error("Missing backend URL");
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }

  return response.json();
};
