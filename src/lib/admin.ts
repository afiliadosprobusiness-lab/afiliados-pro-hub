const normalizeEmail = (value) => value.trim().toLowerCase();
const fallbackAdminEmails = "afiliadosprobusiness@gmail.com,admin@afiliadospro.com";

export const getAdminEmails = () => {
  const merged = `${import.meta.env.VITE_ADMIN_EMAILS || ""},${fallbackAdminEmails}`;
  return [...new Set(merged.split(",").map(normalizeEmail).filter(Boolean))];
};

export const isAdminEmail = (email) => {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
};
