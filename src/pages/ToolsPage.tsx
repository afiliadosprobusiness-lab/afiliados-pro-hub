import { motion } from "framer-motion";
import {
  Calculator,
  Layout,
  MessageSquare,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import AppLayout from "@/components/AppLayout";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const iconMap = {
  contapp: Calculator,
  fastpage: Layout,
  leadwidget: MessageSquare,
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function ToolsPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [loading, user, navigate]);

  const toolsQuery = useQuery({
    queryKey: ["tools"],
    queryFn: () => apiFetch("/tools"),
    enabled: !!user,
  });

  useEffect(() => {
    if (toolsQuery.error) {
      toast.error("No se pudo cargar las herramientas");
    }
  }, [toolsQuery.error]);

  const tools = toolsQuery.data?.tools ?? [];

  return (
    <AppLayout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item}>
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            Mis Herramientas
          </h1>
          <p className="mt-1 text-muted-foreground">
            Accede a tus Micro-SaaS incluidos en tu suscripcion
          </p>
        </motion.div>

        {/* Alert Banner */}
        <motion.div
          variants={item}
          className="flex items-start gap-3 rounded-xl border border-accent/20 bg-accent/5 p-4"
        >
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <div>
            <p className="text-sm font-medium text-accent">Importante</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Tu suscripcion activa estas herramientas automaticamente si usas el mismo
              correo de Google/Firebase.
            </p>
          </div>
        </motion.div>

        {/* Tools Grid */}
        <motion.div variants={item} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
            const Icon = iconMap[tool.id] || MessageSquare;
            return (
              <div key={tool.id} className="glass-card-hover flex flex-col p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      tool.color === "emerald"
                        ? "bg-primary/10 text-primary"
                        : tool.color === "blue"
                        ? "bg-blue-500/10 text-blue-400"
                        : "bg-purple-500/10 text-purple-400"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        tool.status === "active" ? "bg-primary animate-pulse-glow" : "bg-destructive"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium ${
                        tool.status === "active" ? "text-primary" : "text-destructive"
                      }`}
                    >
                      {tool.status === "active" ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="mt-4 font-display text-xl font-bold text-foreground">
                  {tool.name}
                </h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">
                  {tool.description}
                </p>

                {/* Action */}
                <button
                  className={`mt-5 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all ${
                    tool.status === "active"
                      ? "bg-primary/10 text-primary hover:bg-primary/20"
                      : "bg-secondary text-muted-foreground cursor-not-allowed opacity-60"
                  }`}
                  disabled={tool.status === "inactive"}
                >
                  <ExternalLink className="h-4 w-4" />
                  {tool.status === "active" ? "Acceder" : "Requiere suscripcion"}
                </button>
              </div>
            );
          })}
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
