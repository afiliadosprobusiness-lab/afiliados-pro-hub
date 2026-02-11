import { motion } from "framer-motion";
import {
  DollarSign,
  Wallet,
  Shield,
  Users,
  Copy,
  Check,
  TrendingUp,
  UserPlus,
  ChevronRight,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AppLayout from "@/components/AppLayout";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const statIcons = {
  "Ganancias Totales": DollarSign,
  "Saldo Disponible": Wallet,
  "Plan Actual": Shield,
  "Red Total": Users,
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [loading, user, navigate]);

  const dashboardQuery = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => apiFetch("/dashboard"),
    enabled: !!user,
  });

  const meQuery = useQuery({
    queryKey: ["me"],
    queryFn: () => apiFetch("/me"),
    enabled: !!user,
  });

  useEffect(() => {
    if (dashboardQuery.error) {
      toast.error("No se pudo cargar el dashboard");
    }
  }, [dashboardQuery.error]);

  const stats = dashboardQuery.data?.stats ?? [];
  const recentActivity = dashboardQuery.data?.recentActivity ?? [];
  const referralCode = meQuery.data?.user?.referralCode || "";
  const baseUrl = window.location.origin.replace(/\/$/, "");
  const referralLink = referralCode ? `${baseUrl}/ref/${referralCode}` : `${baseUrl}/ref/`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isLoading = loading || dashboardQuery.isLoading || meQuery.isLoading;

  const activityItems = useMemo(() => {
    if (!recentActivity.length) return [];
    return recentActivity;
  }, [recentActivity]);

  return (
    <AppLayout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {/* Header */}
        <motion.div variants={item}>
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            Bienvenido de vuelta
          </h1>
          <p className="mt-1 text-muted-foreground">
            Aqui tienes un resumen de tu actividad
          </p>
        </motion.div>

        {isLoading && (
          <motion.div variants={item} className="glass-card p-5 text-sm text-muted-foreground">
            Cargando datos...
          </motion.div>
        )}

        {/* Stats Grid */}
        <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = statIcons[stat.title] || DollarSign;
            return (
              <div
                key={stat.title}
                className={`glass-card-hover p-5 ${
                  stat.variant === "emerald"
                    ? "border-primary/20"
                    : stat.variant === "gold"
                    ? "border-accent/20"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {stat.title}
                  </span>
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      stat.variant === "emerald"
                        ? "bg-primary/10 text-primary"
                        : stat.variant === "gold"
                        ? "bg-accent/10 text-accent"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <p
                  className={`mt-3 font-display text-2xl font-bold ${
                    stat.variant === "emerald"
                      ? "text-primary"
                      : stat.variant === "gold"
                      ? "text-accent"
                      : "text-foreground"
                  }`}
                >
                  {stat.value}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  {stat.variant === "emerald" && (
                    <TrendingUp className="h-3 w-3 text-primary" />
                  )}
                  {stat.change}
                </p>
              </div>
            );
          })}
        </motion.div>

        {/* Referral Link */}
        <motion.div variants={item} className="glass-card p-5">
          <h2 className="mb-3 font-display text-lg font-semibold text-foreground">
            Tu Link de Referido
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-lg border border-border/50 bg-secondary/50 px-4 py-2.5">
              <span className="text-sm font-medium text-foreground">{referralLink}</span>
            </div>
            <button
              onClick={handleCopy}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:bg-primary/90 glow-emerald"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Comparte este link para ganar comisiones por cada registro
          </p>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={item} className="glass-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Actividad Reciente
            </h2>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
              <span className="text-xs text-primary">En vivo</span>
            </div>
          </div>
          <div className="space-y-3">
            {!activityItems.length && (
              <div className="rounded-lg border border-border/50 bg-secondary/30 p-3 text-sm text-muted-foreground">
                Aun no hay actividad registrada.
              </div>
            )}
            {activityItems.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-secondary/50"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <UserPlus className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <span className="font-medium">{activity.name}</span>{" "}
                    <span className="text-muted-foreground">{activity.action}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  {activity.level}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
