import { motion } from "framer-motion";
import { Check, Sparkles, Crown, Zap, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import AppLayout from "@/components/AppLayout";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [walletPlan, setWalletPlan] = useState("basic");
  const [walletMethod, setWalletMethod] = useState("yape");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [walletLoading, setWalletLoading] = useState(false);

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

  const loadCulqiScript = () =>
    new Promise((resolve, reject) => {
      if (window.Culqi) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.culqi.com/js/v4";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error("No se pudo cargar Culqi"));
      document.body.appendChild(script);
    });

  const openWalletDialog = (planId, method) => {
    setWalletPlan(planId);
    setWalletMethod(method);
    setPhoneNumber("");
    setWalletDialogOpen(true);
  };

  const handleWalletPayment = async () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      toast.error("Ingresa un numero valido");
      return;
    }

    try {
      setWalletLoading(true);
      const response = await apiFetch("/culqi/orders", {
        method: "POST",
        body: JSON.stringify({
          plan: walletPlan,
          phone: phoneNumber,
          paymentMethod: walletMethod,
        }),
      });

      await loadCulqiScript();

      window.Culqi.publicKey = response.publicKey;
      window.Culqi.settings({
        title: "Afiliados PRO",
        currency: response.currencyCode || "PEN",
        amount: response.amount,
        order: response.orderId,
      });
      window.Culqi.options({
        lang: "es",
        modal: true,
        paymentMethods: {
          tarjeta: false,
          yape: walletMethod === "yape",
          plin: walletMethod === "plin",
        },
      });

      window.culqi = function () {
        if (window.Culqi?.error) {
          toast.error(window.Culqi.error.user_message || "Pago cancelado");
        } else {
          toast.success("Pago en proceso. En minutos veras tu plan activo.");
        }
      };

      setWalletDialogOpen(false);
      window.Culqi.open();
    } catch (error) {
      toast.error("No se pudo iniciar el pago con billetera");
    } finally {
      setWalletLoading(false);
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
                      onClick={() => openWalletDialog(plan.id, "yape")}
                    >
                      <Smartphone className="h-4 w-4" />
                      Pagar con Yape
                    </button>
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 rounded-lg border border-border/40 bg-secondary/40 px-3 py-2 text-muted-foreground hover:bg-secondary/60"
                      onClick={() => openWalletDialog(plan.id, "plin")}
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
              Ingresa tu numero para generar el QR. Tu plan se activara cuando el pago sea confirmado.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Label htmlFor="phone">Numero de celular</Label>
            <Input
              id="phone"
              placeholder="999999999"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value.replace(/\D/g, ""))}
            />
          </div>
          <DialogFooter>
            <button
              className="w-full rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              onClick={handleWalletPayment}
              disabled={walletLoading}
            >
              {walletLoading ? "Procesando..." : "Generar QR"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
