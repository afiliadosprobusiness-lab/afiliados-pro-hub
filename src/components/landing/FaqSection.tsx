import { motion } from "framer-motion";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type FaqItem = {
  question: string;
  answer: string;
};

const FAQS: FaqItem[] = [
  {
    question: "¿Necesito experiencia previa en ventas para empezar?",
    answer:
      "No. Solo necesitas compartir tu enlace con contenido claro y honesto. La plataforma ya incluye herramientas y recursos para que empieces rapido.",
  },
  {
    question: "¿Como recibo mis comisiones?",
    answer:
      "Las comisiones se registran en tu panel y se pagan de forma recurrente segun las reglas de tu plan y estado de referidos.",
  },
  {
    question: "¿Cuanto puedo ganar como afiliado?",
    answer:
      "Depende de tu plan y del crecimiento de tu red. Puedes llegar hasta 85% de potencial combinando comision directa y niveles.",
  },
  {
    question: "¿Tengo que comprar inventario o atender soporte?",
    answer:
      "No. No manejas inventario ni postventa. Tu foco es recomendar herramientas utiles; nosotros operamos el producto y soporte.",
  },
  {
    question: "¿Puedo usarlo desde celular?",
    answer:
      "Si. El onboarding, panel y materiales estan pensados para un uso mobile-first, para que compartas y hagas seguimiento desde cualquier dispositivo.",
  },
  {
    question: "¿Que pasa si un referido cancela su plan?",
    answer:
      "Cuando un referido cancela o no renueva, deja de generar nuevas comisiones recurrentes. El historial previo se conserva en tu panel.",
  },
];

export default function FaqSection() {
  return (
    <section className="relative px-4 py-24" id="faqs" aria-labelledby="faqs-title">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="mb-12 text-center"
        >
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            FAQS
          </span>
          <h2 id="faqs-title" className="font-display text-3xl font-bold sm:text-4xl md:text-5xl">
            Preguntas <span className="text-gradient-emerald">frecuentes</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Respuestas claras a las dudas mas comunes antes de empezar.
          </p>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-3">
          {FAQS.map((item, idx) => (
            <AccordionItem
              key={item.question}
              value={`faq-${idx + 1}`}
              className="glass-card border-border/40 border-b-0 px-5"
            >
              <AccordionTrigger className="gap-4 py-5 text-left text-base font-semibold text-foreground hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-lg">
                <span className="min-w-0 break-words">{item.question}</span>
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
