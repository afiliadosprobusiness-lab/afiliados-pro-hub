# Afiliados PRO (Frontend) — Project Context

## Objetivo de negocio
Afiliados PRO es el motor de distribución: permite a afiliados promocionar un bundle de herramientas (ContApp, Fast Page, Lead Widget) mediante enlaces de referido, ver su red (hasta 4 niveles), y gestionar suscripciones/pagos para desbloquear comisiones y niveles.

## Tech Stack
- App: React 18 + TypeScript + Vite
- UI: TailwindCSS + shadcn/ui (Radix UI) + lucide-react
- Routing: react-router-dom
- Data fetching/cache: @tanstack/react-query
- Animación: framer-motion
- Auth/DB: Firebase (Web SDK: Auth + Firestore)
- Deploy: Vercel (frontend)

## Arquitectura (decisiones clave)
- Separación estricta:
  - Frontend (este repo): UI, navegación, estados, render.
  - Backend (`afiliados-pro-hub-backend`): lógica sensible, webhooks PayPal/Culqi, cálculos, escritura segura en Firestore, validación.
- Autenticación:
  - Se usa Firebase Auth en el frontend.
  - Las llamadas al backend se hacen con Firebase ID Token (bearer) para autorizar al usuario.
- Secrets:
  - Nunca viven en Vercel ni en el frontend.
  - Solo variables `VITE_*` públicas en Vercel; secretos van en Cloud Run.

## Reglas UI/UX
- Mobile-first: no scroll horizontal, componentes fluidos (`max-w-*`, `min-w-0`, `truncate` cuando aplique).
- Estados obligatorios: `loading`, `empty`, `error`, `disabled`, `success` (toasts).
- Accesibilidad:
  - Botones para acciones, links para navegación.
  - `focus-visible` con ring; no eliminar outline sin reemplazo.
- Consistencia visual:
  - Reutilizar `src/components/ui/*` (shadcn).
  - Evitar estilos inline salvo necesidad.
- Landing:
  - Incluye sección de testimonios en carrusel (Embla via `src/components/ui/carousel.tsx`).
  - Hero con título corto y directo, destacando keywords de conversión (sin inventario y hasta 85% de comisión).
  - Testimonios con foto por persona usando `Avatar` (`src/components/ui/avatar.tsx`) y fallback a iniciales.
  - Sección FAQ en acordeon (`src/components/landing/FaqSection.tsx`) ubicada al final de la landing, despues del CTA final y antes del footer.

## Convenciones de código
- TypeScript estricto (evitar `any`).
- Imports con alias `@/` (mantener consistencia).
- Lógica de API centralizada en `src/lib/api.ts` (reintentos, errores) y helpers; no duplicar fetch.
- Componentes:
  - Mantener páginas delgadas; extraer subcomponentes cuando crezcan.
  - Evitar leer `window`/`document` durante render (usar `useEffect` o guards).

## Integraciones y configuración
- Backend URL: via `VITE_BACKEND_URL` (o equivalente según repo).
- Admin/Superadmin:
  - UI de superadmin existe; el acceso se controla por email permitido y por backend.
