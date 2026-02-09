import { motion } from "framer-motion";
import { Lock, Unlock, Users, TrendingUp, ChevronRight } from "lucide-react";
import AppLayout from "@/components/AppLayout";
import { Progress } from "@/components/ui/progress";

const levels = [
  { level: 1, commission: 50, unlockPlan: "Básico", unlocked: true, members: 12 },
  { level: 2, commission: 20, unlockPlan: "Pro", unlocked: true, members: 18 },
  { level: 3, commission: 10, unlockPlan: "Elite", unlocked: false, members: 9 },
  { level: 4, commission: 5, unlockPlan: "Elite", unlocked: false, members: 8 },
];

const networkMembers = [
  { name: "María García", plan: "Pro", level: 1, earnings: "S/ 37.50" },
  { name: "Carlos López", plan: "Pro", level: 1, earnings: "S/ 37.50" },
  { name: "Ana Martínez", plan: "Básico", level: 2, earnings: "S/ 10.00" },
  { name: "Pedro Ruiz", plan: "Elite", level: 1, earnings: "S/ 49.50" },
  { name: "Laura Díaz", plan: "Básico", level: 2, earnings: "S/ 10.00" },
  { name: "Roberto Sánchez", plan: "Pro", level: 3, earnings: "S/ 0.00" },
];

const totalPotential = 85;
const currentPotential = 70;

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function NetworkPage() {
  const missedPercentage = totalPotential - currentPotential;

  return (
    <AppLayout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item}>
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            Mi Red
          </h1>
          <p className="mt-1 text-muted-foreground">
            Visualiza tu estructura de comisiones en 4 niveles
          </p>
        </motion.div>

        {/* Commission Tiers */}
        <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {levels.map((lvl) => (
            <div
              key={lvl.level}
              className={`glass-card p-5 ${
                lvl.unlocked ? "border-primary/20" : "border-border/30 opacity-70"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                  Nivel {lvl.level}
                </span>
                {lvl.unlocked ? (
                  <Unlock className="h-4 w-4 text-primary" />
                ) : (
                  <Lock className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <p className={`mt-3 font-display text-3xl font-bold ${
                lvl.unlocked ? "text-primary" : "text-muted-foreground"
              }`}>
                {lvl.commission}%
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {lvl.unlocked ? (
                  <span className="text-primary">Desbloqueado</span>
                ) : (
                  <>Requiere Plan {lvl.unlockPlan}</>
                )}
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                {lvl.members} miembros
              </div>
            </div>
          ))}
        </motion.div>

        {/* Gamification Progress */}
        <motion.div variants={item} className="glass-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">
                Potencial de Ingresos
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Estás aprovechando el {currentPotential}% de tu potencial
              </p>
            </div>
            <div className="flex items-center gap-1 text-accent">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-semibold">+{missedPercentage}% disponible</span>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={currentPotential} className="h-3 bg-secondary" />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>Plan Pro (70%)</span>
            <span className="text-accent">Plan Elite desbloquea 85%</span>
          </div>
        </motion.div>

        {/* Network Members */}
        <motion.div variants={item} className="glass-card overflow-hidden">
          <div className="border-b border-border/50 p-5">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Miembros de tu Red
            </h2>
          </div>
          <div className="divide-y divide-border/30">
            {networkMembers.map((member, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 transition-colors hover:bg-secondary/30"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary">
                  {member.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{member.name}</p>
                  <p className="text-xs text-muted-foreground">Nivel {member.level}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                  member.plan === "Elite"
                    ? "bg-accent/10 text-accent"
                    : member.plan === "Pro"
                    ? "bg-primary/10 text-primary"
                    : "bg-secondary text-muted-foreground"
                }`}>
                  {member.plan}
                </span>
                <span className="shrink-0 text-sm font-medium text-foreground">
                  {member.earnings}
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
