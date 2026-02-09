import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Eye, EyeOff, UserPlus, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referrerCode, setReferrerCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, fullName, referrerCode);
      }
      navigate("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Ocurrio un error";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setSubmitting(true);
    try {
      await signInWithGoogle();
      navigate("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Ocurrio un error";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 glow-emerald">
            <Zap className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Afiliados<span className="text-primary">PRO</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Tu plataforma de afiliados inteligente
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-6 sm:p-8">
          {/* Tabs */}
          <div className="mb-6 flex rounded-lg bg-secondary/50 p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${
                isLogin
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Iniciar Sesion
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 rounded-md py-2 text-sm font-medium transition-all ${
                !isLogin
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-foreground/80">Nombre Completo</Label>
                <Input
                  id="fullName"
                  placeholder="Juan Perez"
                  className="bg-secondary/50 border-border/50 focus:border-primary"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/80">Correo Electronico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                className="bg-secondary/50 border-border/50 focus:border-primary"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground/80">Contrasena</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  className="bg-secondary/50 border-border/50 focus:border-primary pr-10"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="referrerId" className="text-foreground/80">
                  <span className="flex items-center gap-1.5">
                    <UserPlus className="h-3.5 w-3.5" />
                    Codigo de Referido (Opcional)
                  </span>
                </Label>
                <Input
                  id="referrerId"
                  placeholder="ID del referidor"
                  className="bg-secondary/50 border-border/50 focus:border-primary"
                  value={referrerCode}
                  onChange={(event) => setReferrerCode(event.target.value)}
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-emerald"
              disabled={submitting}
            >
              {submitting ? "Procesando..." : isLogin ? "Iniciar Sesion" : "Crear Cuenta"}
            </Button>
          </form>

          <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            o
            <span className="h-px flex-1 bg-border" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full border-border/60"
            onClick={handleGoogle}
            disabled={submitting}
          >
            <Chrome className="mr-2 h-4 w-4" />
            Continuar con Google
          </Button>

          {isLogin && (
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Olvidaste tu contrasena?{" "}
              <button className="text-primary hover:underline">Recuperar</button>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
