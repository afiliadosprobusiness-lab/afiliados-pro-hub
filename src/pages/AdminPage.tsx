import { motion } from "framer-motion";
import { MoreVertical, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

  const handleUpdateUser = async (uid, payload) => {
    try {
      await apiFetch(`/admin/users/${uid}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      toast.success("Usuario actualizado");
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

  const planLabel = (plan) => {
    if (plan === "elite") return "Elite";
    if (plan === "pro") return "Pro";
    return "Basico";
  };

  const statusLabel = (status, disabled) => {
    if (status === "TRIAL") return "Trial";
    if (status === "SUSPENDED") return "Suspendido";
    if (status === "ACTIVE") return "Activo";
    return disabled ? "Suspendido" : "Activo";
  };

  const MenuItem = ({ title, subtitle }) => (
    <div className="flex flex-col">
      <span className="text-sm font-medium">{title}</span>
      <span className="text-xs text-muted-foreground">{subtitle}</span>
    </div>
  );

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
            const currentPlan = u.plan || "basic";
            const currentStatus = u.status || null;
            return (
              <div key={u.uid} className="glass-card p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">{u.fullName || "Sin nombre"}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span>Codigo: {u.referralCode || "-"}</span>
                      <span>Plan: {planLabel(currentPlan)}</span>
                      <span>Estado: {statusLabel(currentStatus, isDisabled)}</span>
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline">
                              <MoreVertical className="mr-2 h-4 w-4" />
                              Acciones
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-80">
                            <DropdownMenuLabel>Acciones de usuario</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onSelect={() => handleUpdateUser(u.uid, { plan: "pro", status: "ACTIVE", disabled: false })}
                            >
                              <MenuItem
                                title="Activar plan PRO"
                                subtitle="Pasa el estado a Activo y asigna PRO."
                              />
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => handleUpdateUser(u.uid, { plan: "elite", status: "ACTIVE", disabled: false })}
                            >
                              <MenuItem
                                title="Activar plan ELITE"
                                subtitle="Pasa el estado a Activo y asigna ELITE."
                              />
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => handleUpdateUser(u.uid, { plan: "basic", status: "ACTIVE", disabled: false })}
                            >
                              <MenuItem
                                title="Activar plan BASICO"
                                subtitle="Pasa el estado a Activo y asigna BASICO."
                              />
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem onSelect={() => handleUpdateUser(u.uid, { plan: "pro" })}>
                              <MenuItem
                                title="Cambiar plan a PRO (sin tocar estado)"
                                subtitle="Solo cambia el plan. No cambia Activo/Suspendido/Trial."
                              />
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleUpdateUser(u.uid, { plan: "elite" })}>
                              <MenuItem
                                title="Cambiar plan a ELITE (sin tocar estado)"
                                subtitle="Solo cambia el plan. No cambia Activo/Suspendido/Trial."
                              />
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleUpdateUser(u.uid, { plan: "basic" })}>
                              <MenuItem
                                title="Cambiar plan a BASICO (sin tocar estado)"
                                subtitle="Solo cambia el plan. No cambia Activo/Suspendido/Trial."
                              />
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem onSelect={() => handleUpdateUser(u.uid, { status: "TRIAL", disabled: false })}>
                              <MenuItem
                                title="Marcar como Trial"
                                subtitle="Cambia el estado a Trial. El plan queda igual."
                              />
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onSelect={() => handleUpdateUser(u.uid, { status: "SUSPENDED", disabled: true })}
                            >
                              <MenuItem
                                title="Suspender acceso"
                                subtitle="Bloquea el acceso sin eliminar la cuenta."
                              />
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onSelect={() => handleDelete(u.uid)}
                            >
                              <div className="flex items-center gap-2">
                                <Trash2 className="h-4 w-4" />
                                <MenuItem title="Eliminar usuario" subtitle="Esta accion no se puede deshacer." />
                              </div>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
