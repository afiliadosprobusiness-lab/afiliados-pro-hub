import { useMemo } from "react";

interface Ember {
  id: number;
  left: string;
  size: number;
  duration: string;
  delay: string;
  drift: string;
  variant: "orange" | "gold" | "red";
}

export default function EmberParticles({ count = 30 }: { count?: number }) {
  const embers = useMemo<Ember[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 2 + Math.random() * 5,
      duration: `${3 + Math.random() * 5}s`,
      delay: `${Math.random() * 6}s`,
      drift: `${(Math.random() - 0.5) * 80}px`,
      variant: (["orange", "gold", "red"] as const)[Math.floor(Math.random() * 3)],
    }));
  }, [count]);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-full overflow-hidden">
      {embers.map((e) => (
        <div
          key={e.id}
          className={`ember ember-${e.variant}`}
          style={{
            left: e.left,
            width: e.size,
            height: e.size,
            ["--duration" as string]: e.duration,
            ["--delay" as string]: e.delay,
            ["--drift" as string]: e.drift,
          }}
        />
      ))}
    </div>
  );
}
