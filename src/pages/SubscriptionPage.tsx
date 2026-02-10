import { motion } from "framer-motion";
import { Check, Sparkles, Crown, Zap, Smartphone, Copy, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import AppLayout from "@/components/AppLayout";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
  const [paypalLoading, setPaypalLoading] = useState("");
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);
  const [walletMethod, setWalletMethod] = useState("yape");
  const [copied, setCopied] = useState(false);

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

  const openWalletDialog = (method) => {
    setWalletMethod(method);
    setWalletDialogOpen(true);
    setCopied(false);
  };

  const walletNumber = "+51 924 464 410";

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(walletNumber);
      setCopied(true);
      toast.success("Numero copiado");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("No se pudo copiar");
    }
  };

  const handleSubscribe = async (planId) => {
    try {
      setPaypalLoading(planId);
      const response = await apiFetch("/paypal/create-subscription", {
        method: "POST",
        body: JSON.stringify({ planCode: planId }),
      });
      if (response?.approvalUrl) {
        window.location.href = response.approvalUrl;
      } else {
        toast.error("No se pudo iniciar el pago");
      }
    } catch (error) {
      toast.error("No se pudo iniciar el pago");
    } finally {
      setPaypalLoading("");
    }
  };

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
                  disabled={isCurrent || paypalLoading === plan.id}
                  onClick={() => {
                    if (!isCurrent) {
                      handleSubscribe(plan.id);
                    }
                  }}
                >
                  {isCurrent
                    ? "Tu Plan Actual"
                    : paypalLoading === plan.id
                    ? "Redirigiendo..."
                    : `Actualizar a ${plan.name}`}
                </button>

                {!isCurrent && (
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 rounded-lg border border-border/40 bg-secondary/40 px-3 py-2 text-muted-foreground hover:bg-secondary/60"
                      onClick={() => openWalletDialog("yape")}
                    >
                      <Smartphone className="h-4 w-4" />
                      Pagar con Yape
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 rounded-lg border border-border/40 bg-secondary/40 px-3 py-2 text-muted-foreground hover:bg-secondary/60"
                      onClick={() => openWalletDialog("plin")}
                    >
                      <Smartphone className="h-4 w-4" />
                      Pagar con Plin
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </motion.div>
      </motion.div>

      <Dialog open={walletDialogOpen} onOpenChange={setWalletDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pagar con {walletMethod === "yape" ? "Yape" : "Plin"}</DialogTitle>
            <DialogDescription>
              Este pago es manual (no recurrente). Envia el monto y luego confirma con soporte.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl border border-border/40 bg-secondary/40 p-4">
            <p className="text-xs text-muted-foreground">Numero:</p>
            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="text-lg font-semibold text-foreground">{walletNumber}</span>
              <button
                className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/20"
                onClick={handleCopyNumber}
              >
                {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copiado" : "Copiar"}
              </button>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Luego de pagar, escribe al{" "}
            <a
              className="text-primary font-semibold hover:underline"
              href="https://wa.me/51924464410?text=Hola%20equipo%20de%20Afiliados%20PRO%2C%20ya%20realice%20el%20pago%20por%20Yape%2FPlin.%20Por%20favor%20activar%20mi%20plan."
              target="_blank"
              rel="noreferrer"
            >
              soporte
            </a>{" "}
            para activar tu plan.
          </p>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
