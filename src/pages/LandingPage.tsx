import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Zap,
  Calculator,
  Layout,
  MessageSquare,
  ArrowRight,
  Check,
  Crown,
  Sparkles,
  TrendingUp,
  Users,
  Shield,
  ChevronRight,
} from "lucide-react";
import EmberParticles from "@/components/EmberParticles";
import LightningEffect from "@/components/LightningEffect";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const tools = [
  {
    name: "ContApp",
    desc: "Contabilidad inteligente para freelancers y PYMEs. Automatiza facturas, impuestos y reportes.",
    icon: Calculator,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    name: "Fast Page",
    desc: "Crea landing pages profesionales en minutos. Drag & Drop, templates optimizados para conversión.",
    icon: Layout,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    name: "Lead Widget",
    desc: "Captura leads desde cualquier web o red social. Chatbots, formularios y seguimiento automático.",
    icon: MessageSquare,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
];

const levels = [
  { level: 1, pct: 50, plan: "Básico", w: "100%" },
  { level: 2, pct: 20, plan: "Pro", w: "75%" },
  { level: 3, pct: 10, plan: "Elite", w: "50%" },
  { level: 4, pct: 5, plan: "Elite", w: "30%" },
];

const plans = [
  {
    name: "Básico",
    price: "50",
    icon: Zap,
    features: [
      "Acceso a 3 Apps completas",
      "Comisión Nivel 1: 50%",
      "Panel de afiliados",
      "Soporte por email",
    ],
    commission: "50%",
    variant: "default" as const,
  },
  {
    name: "Pro",
    price: "75",
    icon: Sparkles,
    features: [
      "Todo en Básico",
      "Comisión Nivel 2: 20%",
      "Potencial total: 70%",
      "Reportes avanzados",
      "Soporte prioritario",
    ],
    commission: "70%",
    variant: "emerald" as const,
  },
  {
    name: "Elite",
    price: "99",
    icon: Crown,
    features: [
      "Todo en Pro",
      "Comisión Nivel 3: 10%",
      "Comisión Nivel 4: 5%",
      "Potencial total: 85%",
      "Acceso VIP",
      "Soporte 1:1",
    ],
    commission: "85%",
    variant: "gold" as const,
  },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <LightningEffect />

      {/* ========= HERO ========= */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 py-20 text-center">
        {/* Fire base glow */}
        <div className="fire-base-glow" />
        <EmberParticles count={35} />

        {/* Background radials */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-orange-500/5 blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-accent/5 blur-[100px]" />
        </div>

        {/* Navbar */}
        <motion.nav
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="fixed inset-x-0 top-0 z-40 border-b border-border/30 bg-background/60 backdrop-blur-xl"
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight">
                Afiliados<span className="text-primary">PRO</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/auth"
                className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/auth"
                className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 cta-glow"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </motion.nav>

        {/* Hero content */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="relative z-10 mx-auto max-w-4xl"
        >
          <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">La revolución de los afiliados SaaS</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Domina el Mercado SaaS.{" "}
            <span className="text-gradient-emerald">3 Herramientas Poderosas.</span>{" "}
            <span className="text-gradient-gold">Un Solo Imperio.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          >
            El primer ecosistema &ldquo;Todo en Uno&rdquo; que te paga hasta el{" "}
            <span className="font-semibold text-accent">85% en comisiones</span> de red.
            Únete a la revolución de Afiliados PRO.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/auth"
              className="group flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-bold text-primary-foreground transition-all hover:bg-primary/90 cta-glow"
            >
              EMPEZAR AHORA
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#arsenal"
              className="flex items-center gap-2 rounded-xl border border-border/50 px-6 py-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Ver Herramientas
              <ChevronRight className="h-4 w-4" />
            </a>
          </motion.div>

          {/* Social proof */}
          <motion.div variants={fadeUp} className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span><span className="font-semibold text-foreground">2,400+</span> afiliados activos</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              <span><span className="font-semibold text-foreground">S/ 1.2M</span> pagados en comisiones</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>Pagos garantizados</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ========= ARSENAL SECTION ========= */}
      <section id="arsenal" className="relative px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-14 text-center"
          >
            <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              3 HERRAMIENTAS INCLUIDAS
            </span>
            <h2 className="font-display text-3xl font-bold sm:text-4xl md:text-5xl">
              Tu <span className="text-gradient-emerald">Arsenal Digital</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Tres Micro-SaaS de alto impacto incluidos en tu suscripción. Sin costo extra.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool, i) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card-hover group p-7"
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${tool.bg} transition-transform duration-300 group-hover:scale-110`}>
                  <tool.icon className={`h-7 w-7 ${tool.color}`} />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-foreground">
                  {tool.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {tool.desc}
                </p>
                <div className="mt-5 flex items-center gap-1.5 text-sm font-medium text-primary">
                  <span>Incluido en tu plan</span>
                  <Check className="h-4 w-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========= COMPENSATION SECTION ========= */}
      <section className="relative px-4 py-24">
        {/* Subtle bg glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-[150px]" />

        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <span className="mb-3 inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
              PLAN DE COMPENSACIÓN
            </span>
            <h2 className="font-display text-3xl font-bold sm:text-4xl md:text-5xl">
              Compensación <span className="text-gradient-gold">Explosiva</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              4 niveles de comisiones. Hasta el 85% de potencial de ingresos con el Plan Elite.
            </p>
          </motion.div>

          <div className="space-y-4">
            {levels.map((lvl, i) => (
              <motion.div
                key={lvl.level}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card flex items-center gap-4 p-5"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 font-display text-lg font-bold text-accent">
                  N{lvl.level}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-lg font-bold text-foreground">
                      Nivel {lvl.level} — {lvl.pct}%
                    </span>
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      Plan {lvl.plan}+
                    </span>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-secondary">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: lvl.w }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.15 }}
                      className="h-full rounded-full bg-gradient-to-r from-accent to-accent/60"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========= PRICING SECTION ========= */}
      <section className="relative px-4 py-24">
        <EmberParticles count={15} />
        <div className="fire-base-glow" />

        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              PLANES Y PRECIOS
            </span>
            <h2 className="font-display text-3xl font-bold sm:text-4xl md:text-5xl">
              Elige tu <span className="text-gradient-emerald">Nivel de Poder</span>
            </h2>
          </motion.div>

          <div className="relative z-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className={`glass-card relative flex flex-col p-7 ${
                  plan.variant === "emerald"
                    ? "border-primary/30 glow-emerald"
                    : plan.variant === "gold"
                    ? "border-accent/40 gold-fire-card"
                    : ""
                }`}
              >
                {plan.variant === "emerald" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                      Popular
                    </span>
                  </div>
                )}
                {plan.variant === "gold" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                      ⚡ Máximo Poder
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

                <div className="mt-3 rounded-lg bg-secondary/50 px-3 py-2">
                  <span className="text-xs text-muted-foreground">Potencial: </span>
                  <span className={`text-sm font-bold ${
                    plan.variant === "gold" ? "text-accent" : plan.variant === "emerald" ? "text-primary" : "text-foreground"
                  }`}>
                    {plan.commission}
                  </span>
                </div>

                <ul className="mt-5 flex-1 space-y-3">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${
                        plan.variant === "gold"
                          ? "text-accent"
                          : plan.variant === "emerald"
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`} />
                      <span className="text-foreground/80">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/auth"
                  className={`mt-6 flex w-full items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-all ${
                    plan.variant === "gold"
                      ? "bg-accent text-accent-foreground hover:bg-accent/90 glow-gold"
                      : plan.variant === "emerald"
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 cta-glow"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  Empezar con {plan.name}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========= FINAL CTA ========= */}
      <section className="relative px-4 py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 mx-auto max-w-2xl text-center"
        >
          <h2 className="font-display text-3xl font-bold sm:text-4xl md:text-5xl">
            ¿Listo para construir tu{" "}
            <span className="text-gradient-gold">imperio?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
            Únete a miles de afiliados que ya están generando ingresos pasivos con Afiliados PRO.
          </p>
          <Link
            to="/auth"
            className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-10 py-4 text-lg font-bold text-primary-foreground transition-all hover:bg-primary/90 cta-glow"
          >
            REGÍSTRATE GRATIS
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 px-4 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="font-display text-sm font-bold">
              Afiliados<span className="text-primary">PRO</span>
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 Afiliados PRO. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
