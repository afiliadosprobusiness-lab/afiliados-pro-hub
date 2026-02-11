import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  EmailAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { toast } from "sonner";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import { auth } from "@/lib/firebase";

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

const mapAuthError = (error: unknown) => {
  const code = (error as { code?: string })?.code || "";
  if (code === "auth/email-already-in-use") return "El correo ya esta en uso.";
  if (code === "auth/invalid-email") return "Correo invalido.";
  if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
    return "La contrasena actual es incorrecta.";
  }
  if (code === "auth/requires-recent-login") return "Vuelve a iniciar sesion e intenta de nuevo.";
  if (code === "auth/weak-password") return "La nueva contrasena es muy debil.";
  return "No se pudo actualizar la configuracion.";
};

const requiresPasswordProvider = (providerIds: string[]) => providerIds.includes("password");
const requiresGoogleProvider = (providerIds: string[]) => providerIds.includes("google.com");

export default function SettingsPage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePassword, setProfilePassword] = useState("");
  const [passwordCurrent, setPasswordCurrent] = useState("");
  const [passwordNew, setPasswordNew] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFullName(user.displayName || "");
    setEmail(user.email || "");
  }, [user]);

  const providerIds = useMemo(
    () => (auth.currentUser?.providerData || []).map((provider) => provider.providerId),
    [user]
  );

  const reauthenticate = async (currentPassword: string) => {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("No authenticated user");

    if (requiresPasswordProvider(providerIds)) {
      if (!currentPassword) throw new Error("Ingresa tu contrasena actual.");
      const credential = EmailAuthProvider.credential(currentUser.email || "", currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
      return;
    }

    if (requiresGoogleProvider(providerIds)) {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await reauthenticateWithPopup(currentUser, provider);
    }
  };

  const handleProfileSave = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const hasNameChange = trimmedName !== (currentUser.displayName || "");
    const hasEmailChange = trimmedEmail !== (currentUser.email || "");

    if (!hasNameChange && !hasEmailChange) {
      toast.message("No hay cambios para guardar.");
      return;
    }

    try {
      setSavingProfile(true);

      if (hasEmailChange) {
        await reauthenticate(profilePassword);
        await updateEmail(currentUser, trimmedEmail);
      }

      if (hasNameChange) {
        await updateProfile(currentUser, { displayName: trimmedName });
      }

      await apiFetch("/me", {
        method: "PATCH",
        body: JSON.stringify({ fullName: trimmedName, email: trimmedEmail }),
      });

      setProfilePassword("");
      toast.success("Perfil actualizado.");
    } catch (error) {
      const message = error instanceof Error && error.message.includes("contrasena actual")
        ? error.message
        : mapAuthError(error);
      toast.error(message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    if (!passwordNew || passwordNew.length < 8) {
      toast.error("La nueva contrasena debe tener al menos 8 caracteres.");
      return;
    }

    if (passwordNew !== passwordConfirm) {
      toast.error("La confirmacion de contrasena no coincide.");
      return;
    }

    try {
      setSavingPassword(true);
      await reauthenticate(passwordCurrent);
      await updatePassword(currentUser, passwordNew);
      setPasswordCurrent("");
      setPasswordNew("");
      setPasswordConfirm("");
      toast.success("Contrasena actualizada.");
    } catch (error) {
      const message = error instanceof Error && error.message.includes("contrasena actual")
        ? error.message
        : mapAuthError(error);
      toast.error(message);
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <AppLayout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item}>
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            Configuracion
          </h1>
          <p className="mt-1 text-muted-foreground">
            Administra tu perfil, correo y contrasena.
          </p>
        </motion.div>

        <motion.div variants={item} className="glass-card space-y-4 p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">Perfil</h2>
          <div className="space-y-2">
            <Label htmlFor="fullName">Nombre</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Tu nombre"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Correo</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="tu@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profilePassword">Contrasena actual (solo si cambias correo)</Label>
            <Input
              id="profilePassword"
              type="password"
              value={profilePassword}
              onChange={(event) => setProfilePassword(event.target.value)}
              placeholder="********"
            />
          </div>
          <Button onClick={handleProfileSave} disabled={savingProfile}>
            {savingProfile ? "Guardando..." : "Guardar perfil"}
          </Button>
        </motion.div>

        <motion.div variants={item} className="glass-card space-y-4 p-5">
          <h2 className="font-display text-lg font-semibold text-foreground">Seguridad</h2>
          <div className="space-y-2">
            <Label htmlFor="passwordCurrent">Contrasena actual</Label>
            <Input
              id="passwordCurrent"
              type="password"
              value={passwordCurrent}
              onChange={(event) => setPasswordCurrent(event.target.value)}
              placeholder="********"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="passwordNew">Nueva contrasena</Label>
            <Input
              id="passwordNew"
              type="password"
              value={passwordNew}
              onChange={(event) => setPasswordNew(event.target.value)}
              placeholder="Minimo 8 caracteres"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="passwordConfirm">Confirmar nueva contrasena</Label>
            <Input
              id="passwordConfirm"
              type="password"
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
              placeholder="********"
            />
          </div>
          <Button onClick={handlePasswordSave} disabled={savingPassword}>
            {savingPassword ? "Actualizando..." : "Actualizar contrasena"}
          </Button>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
