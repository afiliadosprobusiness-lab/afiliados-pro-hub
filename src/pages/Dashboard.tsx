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
  ArrowUpRight,
} from "lucide-react";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";

const stats = [
  {
    title: "Ganancias Totales",
    value: "S/ 2,450.00",
    change: "+12.5%",
    icon: DollarSign,
    variant: "emerald" as const,
  },
  {
    title: "Saldo Disponible",
    value: "S/ 1,280.00",
    change: "Retirable",
    icon: Wallet,
    variant: "gold" as const,
  },
  {
    title: "Plan Actual",
    value: "Pro",
    change: "Activo",
    icon: Shield,
    variant: "default" as const,
  },
  {
    title: "Red Total",
    value: "47",
    change: "+3 esta semana",
    icon: Users,
    variant: "default" as const,
  },
];

const recentActivity = [
  { name: "María García", action: "se registró en tu red", time: "Hace 2 min", level: "Nivel 1" },
  { name: "Carlos López", action: "activó Plan Pro", time: "Hace 15 min", level: "Nivel 1" },
  { name: "Ana Martínez", action: "se registró en tu red", time: "Hace 1 hora", level: "Nivel 2" },
  { name: "Pedro Ruiz", action: "pagó suscripción", time: "Hace 3 horas", level: "Nivel 1" },
  { name: "Laura Díaz", action: "se registró en tu red", time: "Hace 5 horas", level: "Nivel 3" },
];

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
  const [copied, setCopied] = useState(false);
  const referralLink = "afiliadospro.com/ref/USR_7X9K2";

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${referralLink}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppLayout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        {/* Header */}
        <motion.div variants={item}>
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            Bienvenido de vuelta 👋
          </h1>
          <p className="mt-1 text-muted-foreground">
            Aquí tienes un resumen de tu actividad
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
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
                  <stat.icon className="h-4 w-4" />
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
          ))}
        </motion.div>

        {/* Referral Link */}
        <motion.div variants={item} className="glass-card p-5">
          <h2 className="mb-3 font-display text-lg font-semibold text-foreground">
            Tu Link de Referido
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-lg border border-border/50 bg-secondary/50 px-4 py-2.5">
              <span className="text-sm text-muted-foreground">https://</span>
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
            {recentActivity.map((activity, i) => (
              <div
                key={i}
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
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
