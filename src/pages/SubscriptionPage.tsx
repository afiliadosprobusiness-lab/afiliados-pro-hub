import { motion } from "framer-motion";
import { Check, Sparkles, Crown, Zap } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const plans = [
  {
    name: "Básico",
    price: "50",
    icon: Zap,
    description: "Ideal para comenzar con tus herramientas y generar tus primeras comisiones.",
    features: [
      "Acceso a 3 Apps (ContApp, Fast Page, Lead Widget)",
      "Comisión Nivel 1: 50%",
      "Soporte por email",
      "Panel de afiliados básico",
    ],
    commission: "50%",
    cta: "Plan Actual",
    current: false,
    variant: "default" as const,
  },
  {
    name: "Pro",
    price: "75",
    icon: Sparkles,
    description: "Desbloquea el siguiente nivel de comisiones y maximiza tu red.",
    features: [
      "Todo en Básico",
      "Comisión Nivel 2: 20% (Total: 70%)",
      "Reportes avanzados",
      "Soporte prioritario",
      "Badge exclusivo de Pro",
    ],
    commission: "70%",
    cta: "Tu Plan Actual",
    current: true,
    variant: "emerald" as const,
  },
  {
    name: "Elite",
    price: "99",
    icon: Crown,
    description: "Acceso VIP. Desbloquea los 4 niveles y maximiza tus ingresos pasivos.",
    features: [
      "Todo en Pro",
      "Comisión Nivel 3: 10%",
      "Comisión Nivel 4: 5% (Total: 85%)",
      "Acceso VIP a nuevas herramientas",
      "Soporte 1:1 personalizado",
      "Webinars exclusivos",
    ],
    commission: "85%",
    cta: "Actualizar a Elite",
    current: false,
    variant: "gold" as const,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function SubscriptionPage() {
  return (
    <AppLayout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item} className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            Elige tu Plan
          </h1>
          <p className="mt-2 text-muted-foreground">
            Mientras más alto tu plan, más niveles de comisiones desbloqueas
          </p>
        </motion.div>

        {/* Plans Grid */}
        <motion.div
          variants={item}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`glass-card relative flex flex-col p-6 ${
                plan.variant === "emerald"
                  ? "border-primary/40 glow-emerald"
                  : plan.variant === "gold"
                  ? "border-accent/30 glow-gold"
                  : ""
              }`}
            >
              {plan.current && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    Tu Plan
                  </span>
                </div>
              )}

              {plan.variant === "gold" && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                    Recomendado
                  </span>
                </div>
              )}

              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                plan.variant === "emerald"
                  ? "bg-primary/10 text-primary"
                  : plan.variant === "gold"
                  ? "bg-accent/10 text-accent"
                  : "bg-secondary text-muted-foreground"
              }`}>
                <plan.icon className="h-6 w-6" />
              </div>

              <h3 className="mt-4 font-display text-xl font-bold text-foreground">
                Plan {plan.name}
              </h3>

              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-sm text-muted-foreground">S/</span>
                <span className={`font-display text-4xl font-bold ${
                  plan.variant === "emerald"
                    ? "text-primary"
                    : plan.variant === "gold"
                    ? "text-accent"
                    : "text-foreground"
                }`}>
                  {plan.price}
                </span>
                <span className="text-sm text-muted-foreground">/mes</span>
              </div>

              <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>

              <div className="mt-2 rounded-lg bg-secondary/50 px-3 py-2">
                <span className="text-xs text-muted-foreground">Potencial de comisión: </span>
                <span className={`text-sm font-bold ${
                  plan.variant === "emerald"
                    ? "text-primary"
                    : plan.variant === "gold"
                    ? "text-accent"
                    : "text-foreground"
                }`}>
                  {plan.commission}
                </span>
              </div>

              <ul className="mt-5 flex-1 space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className={`mt-0.5 h-4 w-4 shrink-0 ${
                      plan.variant === "emerald"
                        ? "text-primary"
                        : plan.variant === "gold"
                        ? "text-accent"
                        : "text-muted-foreground"
                    }`} />
                    <span className="text-foreground/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`mt-6 w-full rounded-lg py-3 text-sm font-semibold transition-all ${
                  plan.current
                    ? "bg-primary/10 text-primary cursor-default"
                    : plan.variant === "gold"
                    ? "bg-accent text-accent-foreground hover:bg-accent/90 glow-gold"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
                disabled={plan.current}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
