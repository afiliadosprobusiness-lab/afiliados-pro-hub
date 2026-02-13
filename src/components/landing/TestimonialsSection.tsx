import * as React from "react";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Testimonial = {
  name: string;
  role: string;
  quote: string;
  avatarUrl: string;
  highlight?: string;
};

const TESTIMONIALS: Testimonial[] = [
  {
    name: "María Fernanda",
    role: "Consultora de marketing",
    quote:
      "Me registré, compartí mi enlace y en la primera semana ya estaba cobrando. El panel es claro y las comisiones se ven en tiempo real.",
    avatarUrl: "https://randomuser.me/api/portraits/women/44.jpg",
    highlight: "Primeros ingresos en 7 días",
  },
  {
    name: "Julián Rojas",
    role: "Freelancer (diseño web)",
    quote:
      "Lo mejor es que no vendo humo: recomiendo herramientas que uso con mis clientes. Así comparto sin vergüenza y con confianza.",
    avatarUrl: "https://randomuser.me/api/portraits/men/32.jpg",
    highlight: "Recomendación con confianza",
  },
  {
    name: "Camila Paredes",
    role: "Emprendedora",
    quote:
      "Fast Page me ayudó a mejorar conversiones y AfiliadosPRO me paga mes a mes por mis referidos. Es de las pocas plataformas que cumplen.",
    avatarUrl: "https://randomuser.me/api/portraits/women/68.jpg",
    highlight: "Comisión recurrente",
  },
  {
    name: "Renzo Salazar",
    role: "Agencia (Performance)",
    quote:
      "La red por niveles es un game changer. Escalamos con contenido orgánico y ahora el ingreso es mucho más estable.",
    avatarUrl: "https://randomuser.me/api/portraits/men/75.jpg",
    highlight: "Red hasta 4 niveles",
  },
  {
    name: "Valeria Nuñez",
    role: "Contadora independiente",
    quote:
      "ContApp es brutal para mis clientes y el soporte responde rápido. La experiencia se siente premium y eso facilita recomendar.",
    avatarUrl: "https://randomuser.me/api/portraits/women/52.jpg",
    highlight: "Soporte rápido",
  },
  {
    name: "Diego Herrera",
    role: "Creador de contenido",
    quote:
      "El onboarding es simple. En minutos ya tenía mi link y el material listo. Me encanta que todo sea mobile-first.",
    avatarUrl: "https://randomuser.me/api/portraits/men/41.jpg",
    highlight: "Onboarding rápido",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

function Stars({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-0.5 text-accent", className)} aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-current" />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [snapCount, setSnapCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    const sync = () => {
      setSelectedIndex(api.selectedScrollSnap());
      setSnapCount(api.scrollSnapList().length);
    };

    sync();
    api.on("select", sync);
    api.on("reInit", sync);

    return () => {
      api.off("select", sync);
      api.off("reInit", sync);
    };
  }, [api]);

  return (
    <section className="relative px-4 py-24" id="testimonios" aria-labelledby="testimonios-title">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-10 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <span className="mb-3 inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
            TESTIMONIOS
          </span>
          <h2 id="testimonios-title" className="font-display text-3xl font-bold sm:text-4xl md:text-5xl">
            Historias <span className="text-gradient-gold">reales</span> de afiliados
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Resultados y experiencias de personas que ya monetizan recomendando herramientas que realmente usan.
          </p>
        </div>

        <div className="relative">
          <Carousel
            setApi={(nextApi) => setApi(nextApi)}
            opts={{ align: "start", loop: true }}
            className="mx-auto max-w-6xl"
            aria-label="Carrusel de testimonios"
          >
            <CarouselContent className="-ml-4">
              {TESTIMONIALS.map((t) => (
                <CarouselItem key={t.name} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className="glass-card-hover h-full">
                    <CardContent className="flex h-full flex-col p-7">
                      <div className="flex items-start justify-between gap-3">
                        <Stars />
                        {t.highlight ? (
                          <Badge variant="secondary" className="bg-secondary/60 text-foreground/90">
                            {t.highlight}
                          </Badge>
                        ) : null}
                      </div>

                      <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-foreground/80">
                        “{t.quote}”
                      </blockquote>

                      <div className="mt-6 flex items-center gap-3">
                        <Avatar className="h-10 w-10 ring-1 ring-primary/20">
                          <AvatarImage
                            src={t.avatarUrl}
                            alt={`Foto de ${t.name}`}
                            loading="lazy"
                          />
                          <AvatarFallback className="bg-primary/10 font-display text-sm font-bold text-primary">
                            {getInitials(t.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="truncate font-medium text-foreground">{t.name}</div>
                          <div className="truncate text-xs text-muted-foreground">{t.role}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="left-2 top-1/2 -translate-y-1/2 sm:-left-12" />
            <CarouselNext className="right-2 top-1/2 -translate-y-1/2 sm:-right-12" />
          </Carousel>

          <div className="mt-7 flex items-center justify-center gap-2">
            {Array.from({ length: snapCount }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={cn(
                  "h-2.5 w-2.5 rounded-full transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  idx === selectedIndex ? "bg-primary" : "bg-border hover:bg-muted-foreground/40",
                )}
                aria-label={`Ir al testimonio ${idx + 1}`}
                aria-current={idx === selectedIndex ? "true" : undefined}
                onClick={() => api?.scrollTo(idx)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
