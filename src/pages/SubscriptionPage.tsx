import { motion } from "framer-motion";
import { Check, Sparkles, Crown, Zap } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import AppLayout from "@/components/AppLayout";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const iconMap = {
  basic: Zap,
  pro: Sparkles,
  elite: Crown,
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function SubscriptionPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [loading, user, navigate]);

  const subscriptionQuery = useQuery({
    queryKey: ["subscription"],
    queryFn: () => apiFetch("/subscription"),
    enabled: !!user,
  });

  useEffect(() => {
    if (subscriptionQuery.error) {
      toast.error("No se pudo cargar los planes");
    }
  }, [subscriptionQuery.error]);

  const plans = subscriptionQuery.data?.plans ?? [];
  const currentPlan = subscriptionQuery.data?.currentPlan ?? "basic";

  return (
    <AppLayout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item} className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            Elige tu Plan
          </h1>
          <p className="mt-2 text-muted-foreground">
            Mientras mas alto tu plan, mas niveles de comisiones desbloqueas
          </p>
        </motion.div>

        {/* Plans Grid */}
        <motion.div
          variants={item}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {plans.map((plan) => {
            const Icon = iconMap[plan.id] || Zap;
            const isCurrent = currentPlan === plan.id;
            return (
              <div
                key={plan.id}
                className={`glass-card relative flex flex-col p-6 ${
                  plan.id === "pro"
                    ? "border-primary/40 glow-emerald"
                    : plan.id === "elite"
                    ? "border-accent/30 glow-gold"
                    : ""
                }`}
              >
                {isCurrent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                      Tu Plan
                    </span>
                  </div>
                )}

                {plan.id === "elite" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                      Recomendado
                    </span>
                  </div>
                )}

                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                  plan.id === "pro"
                    ? "bg-primary/10 text-primary"
                    : plan.id === "elite"
                    ? "bg-accent/10 text-accent"
                    : "bg-secondary text-muted-foreground"
                }`}>
                  <Icon className="h-6 w-6" />
                </div>

                <h3 className="mt-4 font-display text-xl font-bold text-foreground">
                  Plan {plan.name}
                </h3>

                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-sm text-muted-foreground">S/</span>
                  <span className={`font-display text-4xl font-bold ${
                    plan.id === "pro"
                      ? "text-primary"
                      : plan.id === "elite"
                      ? "text-accent"
                      : "text-foreground"
                  }`}>
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">/mes</span>
                </div>

                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>

                <div className="mt-2 rounded-lg bg-secondary/50 px-3 py-2">
                  <span className="text-xs text-muted-foreground">Potencial de comision: </span>
                  <span className={`text-sm font-bold ${
                    plan.id === "pro"
                      ? "text-primary"
                      : plan.id === "elite"
                      ? "text-accent"
                      : "text-foreground"
                  }`}>
                    {plan.commission}%
                  </span>
                </div>

                <ul className="mt-5 flex-1 space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${
                        plan.id === "pro"
                          ? "text-primary"
                          : plan.id === "elite"
                          ? "text-accent"
                          : "text-muted-foreground"
                      }`} />
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`mt-6 w-full rounded-lg py-3 text-sm font-semibold transition-all ${
                    isCurrent
                      ? "bg-primary/10 text-primary cursor-default"
                      : plan.id === "elite"
                      ? "bg-accent text-accent-foreground hover:bg-accent/90 glow-gold"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                  disabled={isCurrent}
                >
                  {isCurrent ? "Tu Plan Actual" : `Actualizar a ${plan.name}`}
                </button>
              </div>
            );
          })}
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
