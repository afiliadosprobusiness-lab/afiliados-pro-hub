const normalizeEmail = (value) => value.trim().toLowerCase();
const fallbackAdminEmails = "afiliadosprobusiness@gmail.com";

export const getAdminEmails = () =>
  (import.meta.env.VITE_ADMIN_EMAILS || fallbackAdminEmails)
    .split(",")
    .map(normalizeEmail)
    .filter(Boolean);

export const isAdminEmail = (email) => {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
};
