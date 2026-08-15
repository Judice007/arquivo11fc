import Link from "next/link";

import type { Club, Country } from "@/generated/prisma/client";

// Escudos vêm de URLs cadastradas livremente no admin (qualquer host), então usamos
// <img> em vez de next/image: o otimizador exigiria uma allowlist de domínios que não
// faz sentido para conteúdo cadastrado por administradores a partir de fontes variadas.
export function ClubCard({ club }: { club: Club & { country: Country } }) {
  return (
    <Link
      href={`/clubes/${club.slug}`}
      className="group flex flex-col items-center gap-3 rounded-lg border border-line bg-paper-raised p-4 text-center transition-all hover:-translate-y-0.5 hover:shadow-card"
    >
      <div className="flex h-14 w-14 items-center justify-center">
        {club.crestUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={club.crestUrl}
            alt={club.name}
            width={56}
            height={56}
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="font-display text-xl font-semibold text-ink-faint">
            {club.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      <p className="text-sm font-medium text-ink group-hover:text-accent">{club.name}</p>
    </Link>
  );
}
