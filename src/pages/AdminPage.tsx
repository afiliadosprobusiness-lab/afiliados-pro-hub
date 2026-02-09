import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const planOptions = [
  { value: "basic", label: "Basico" },
  { value: "pro", label: "Pro" },
  { value: "elite", label: "Elite" },
];

export default function AdminPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [drafts, setDrafts] = useState({});

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [loading, user, navigate]);

  const usersQuery = useQuery({
    queryKey: ["admin-users"],
    queryFn: () => apiFetch("/admin/users"),
    enabled: !!user,
    retry: false,
  });

  useEffect(() => {
    if (usersQuery.error) {
      const message = usersQuery.error instanceof Error ? usersQuery.error.message : "Sin acceso";
      toast.error(message);
    }
  }, [usersQuery.error]);

  const users = usersQuery.data?.users ?? [];

  const filtered = useMemo(() => {
    if (!search) return users;
    const query = search.toLowerCase();
    return users.filter((u) => {
      return (
        (u.email || "").toLowerCase().includes(query) ||
        (u.fullName || "").toLowerCase().includes(query) ||
        (u.referralCode || "").toLowerCase().includes(query)
      );
    });
  }, [search, users]);

  const handleDraftChange = (uid, patch) => {
    setDrafts((prev) => ({
      ...prev,
      [uid]: {
        ...(prev[uid] || {}),
        ...patch,
      },
    }));
  };

  const handleSave = async (uid) => {
    const payload = drafts[uid];
    if (!payload) return;
    try {
      await apiFetch(`/admin/users/${uid}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      toast.success("Usuario actualizado");
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[uid];
        return next;
      });
      await usersQuery.refetch();
    } catch (error) {
      toast.error("No se pudo actualizar");
    }
  };

  const isLoading = loading || usersQuery.isLoading;

  return (
    <AppLayout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item}>
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            Superadmin
          </h1>
          <p className="mt-1 text-muted-foreground">
            Gestiona usuarios, planes y estado de acceso.
          </p>
        </motion.div>

        <motion.div variants={item} className="glass-card p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Input
              placeholder="Buscar por correo, nombre o codigo"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="sm:max-w-sm"
            />
            <div className="text-xs text-muted-foreground">
              {filtered.length} usuarios
            </div>
          </div>
        </motion.div>

        {isLoading && (
          <motion.div variants={item} className="glass-card p-4 text-sm text-muted-foreground">
            Cargando usuarios...
          </motion.div>
        )}

        {!isLoading && !filtered.length && (
          <motion.div variants={item} className="glass-card p-4 text-sm text-muted-foreground">
            No hay usuarios para mostrar.
          </motion.div>
        )}

        <motion.div variants={item} className="space-y-4">
          {filtered.map((u) => {
            const draft = drafts[u.uid] || {};
            const planValue = draft.plan ?? u.plan ?? "basic";
            const disabledValue = typeof draft.disabled === "boolean" ? draft.disabled : !!u.disabled;
            const hasChanges = !!drafts[u.uid];

            return (
              <div key={u.uid} className="glass-card p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{u.fullName || "Sin nombre"}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                    <p className="text-xs text-muted-foreground">Codigo: {u.referralCode || "-"}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Plan</span>
                      <select
                        className="rounded-md border border-border bg-background px-2 py-1 text-xs"
                        value={planValue}
                        onChange={(event) => handleDraftChange(u.uid, { plan: event.target.value })}
                      >
                        {planOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <label className="flex items-center gap-2 text-xs text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={!disabledValue}
                        onChange={(event) => handleDraftChange(u.uid, { disabled: !event.target.checked })}
                      />
                      Activo
                    </label>

                    <Button
                      size="sm"
                      variant={hasChanges ? "default" : "outline"}
                      disabled={!hasChanges}
                      onClick={() => handleSave(u.uid)}
                    >
                      Guardar
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
