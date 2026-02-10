import { motion } from "framer-motion";
import { PauseCircle, PlayCircle, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { isAdminEmail } from "@/lib/admin";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function AdminPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
    if (!loading && user && !isAdminEmail(user.email)) {
      navigate("/dashboard");
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

  const handleToggle = async (uid, disabled) => {
    try {
      await apiFetch(`/admin/users/${uid}`, {
        method: "PATCH",
        body: JSON.stringify({ disabled }),
      });
      toast.success(disabled ? "Usuario suspendido" : "Usuario activado");
      await usersQuery.refetch();
    } catch (error) {
      toast.error("No se pudo actualizar el usuario");
    }
  };

  const handleDelete = async (uid) => {
    const confirmed = window.confirm("Eliminar este usuario? Esta accion no se puede deshacer.");
    if (!confirmed) return;

    try {
      await apiFetch(`/admin/users/${uid}`, { method: "DELETE" });
      toast.success("Usuario eliminado");
      await usersQuery.refetch();
    } catch (error) {
      toast.error("No se pudo eliminar el usuario");
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
            Gestion de usuarios: activar, suspender o eliminar.
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
            const isDisabled = !!u.disabled;
            const isOwner = isAdminEmail(u.email);
            return (
              <div key={u.uid} className="glass-card p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">{u.fullName || "Sin nombre"}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span>Codigo: {u.referralCode || "-"}</span>
                      <span>Estado: {isDisabled ? "Suspendido" : "Activo"}</span>
                      <span>Afiliado por: {u.referredByName || u.referredBy || "-"}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {isOwner ? (
                      <div className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                        Propietario
                      </div>
                    ) : (
                      <>
                        {isDisabled ? (
                          <Button size="sm" onClick={() => handleToggle(u.uid, false)}>
                            <PlayCircle className="mr-2 h-4 w-4" />
                            Activar
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => handleToggle(u.uid, true)}>
                            <PauseCircle className="mr-2 h-4 w-4" />
                            Suspender
                          </Button>
                        )}
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(u.uid)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </Button>
                      </>
                    )}
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
