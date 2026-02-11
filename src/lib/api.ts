import { auth } from "@/lib/firebase";

const fallbackBackendUrl = "https://afiliados-pro-hub-backend-jkalpx2fqa-uc.a.run.app";
const baseUrl = (import.meta.env.VITE_BACKEND_URL || fallbackBackendUrl).replace(/\/$/, "");
const API_RETRIES = 2;
const RETRY_DELAY_MS = 500;

const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No authenticated user");
  }
  return user.getIdToken();
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithRetry = async (url: string, options: RequestInit, retries = API_RETRIES): Promise<Response> => {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, options);
      if (response.status !== 503 || attempt === retries) {
        return response;
      }
      await wait(RETRY_DELAY_MS * (attempt + 1));
      continue;
    } catch (error) {
      lastError = error;
      if (attempt === retries) {
        throw error;
      }
      await wait(RETRY_DELAY_MS * (attempt + 1));
    }
  }
  throw lastError || new Error("Request failed");
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

  const response = await fetchWithRetry(`${baseUrl}${path}`, {
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

  const response = await fetchWithRetry(`${baseUrl}${path}`, {
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
