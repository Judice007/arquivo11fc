import type { Metadata } from "next";
import Link from "next/link";

import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Painel" };

const SECTIONS = [
  { key: "clubs", label: "Clubes", href: "/admin/clubes" },
  { key: "nationalTeams", label: "Seleções", href: "/admin/selecoes" },
  { key: "kits", label: "Uniformes", href: "/admin/uniformes" },
  { key: "manufacturers", label: "Fabricantes", href: "/admin/fabricantes" },
  { key: "sponsors", label: "Patrocinadores", href: "/admin/patrocinadores" },
  { key: "countries", label: "Países", href: "/admin/paises" },
  { key: "competitions", label: "Competições", href: "/admin/competicoes" },
] as const;

export default async function AdminDashboardPage() {
  const [clubs, nationalTeams, kits, manufacturers, sponsors, countries, competitions] = await Promise.all([
    prisma.club.count(),
    prisma.nationalTeam.count(),
    prisma.kit.count(),
    prisma.manufacturer.count(),
    prisma.sponsor.count(),
    prisma.country.count(),
    prisma.competition.count(),
  ]);

  const counts: Record<(typeof SECTIONS)[number]["key"], number> = {
    clubs,
    nationalTeams,
    kits,
    manufacturers,
    sponsors,
    countries,
    competitions,
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <h1 className="text-2xl font-semibold text-ink">Painel administrativo</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Cadastre e gerencie os dados do Arquivo 11 — nada precisa ser editado direto no código.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {SECTIONS.map((section) => (
          <Link
            key={section.key}
            href={section.href}
            className="flex flex-col gap-1 rounded-md border border-line bg-paper-raised p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
          >
            <span className="text-3xl font-semibold text-ink">{counts[section.key]}</span>
            <span className="text-sm font-medium text-ink-muted">{section.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
