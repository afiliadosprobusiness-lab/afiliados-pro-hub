const normalizeEmail = (value) => value.trim().toLowerCase();

export const getAdminEmails = () =>
  (import.meta.env.VITE_ADMIN_EMAILS || "")
    .split(",")
    .map(normalizeEmail)
    .filter(Boolean);

export const isAdminEmail = (email) => {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
};
