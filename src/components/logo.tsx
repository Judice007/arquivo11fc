import Link from "next/link";

// Logo tipográfico: "ARQUIVO" em tinta, "11" em verde. Sem ícone (bola, chuteira,
// escudo) por decisão de identidade visual — ver docs/PROJECT_SPEC.md. Isolado
// neste componente para ser fácil de trocar por uma marca definitiva depois.
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`font-display text-2xl font-bold uppercase leading-none tracking-tight text-ink ${className}`}
    >
      Arquivo <span className="text-accent">11</span>
    </Link>
  );
}
