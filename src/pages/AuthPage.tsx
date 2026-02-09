import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Eye, EyeOff, UserPlus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { isAdminEmail } from "@/lib/admin";

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
        const loggedUser = await signIn(email, password);
        const target = isAdminEmail(loggedUser.email) ? "/admin" : "/dashboard";
        navigate(target);
      } else {
        const loggedUser = await signUp(email, password, fullName, referrerCode);
        const target = isAdminEmail(loggedUser.email) ? "/admin" : "/dashboard";
        navigate(target);
      }
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
      const loggedUser = await signInWithGoogle();
      const target = isAdminEmail(loggedUser.email) ? "/admin" : "/dashboard";
      navigate(target);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Ocurrio un error";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4">
      <Link
        to="/"
        className="absolute left-4 top-4 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </Link>
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
            <svg
              className="mr-2 h-4 w-4"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                fill="#FFC107"
                d="M43.6 20.5H42V20H24v8h11.3C33.9 32.7 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8.1 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c10.5 0 19-8.5 19-19 0-1.3-.1-2.6-.4-4.5z"
              />
              <path
                fill="#FF3D00"
                d="M6.3 14.7l6.6 4.8C14.6 15 18.9 12 24 12c3.1 0 5.9 1.2 8.1 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 16 4 9.1 8.5 6.3 14.7z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.3 0 10.2-2 13.9-5.3l-6.4-5.3c-2 1.5-4.5 2.6-7.5 2.6-5.3 0-9.8-3.4-11.4-8.1l-6.6 5.1C8.9 39.5 15.9 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.4 5.4-6.3 6.8l6.4 5.3C38.7 37.1 42 31.2 42 24c0-1.3-.1-2.6-.4-4.5z"
              />
            </svg>
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
