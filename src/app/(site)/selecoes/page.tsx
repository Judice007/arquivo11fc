import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { getNationalTeams } from "@/lib/data/national-teams";

export const metadata: Metadata = {
  title: "Seleções",
  description: "Seleções nacionais catalogadas no Arquivo 11.",
};

export default async function NationalTeamsPage() {
  const nationalTeams = await getNationalTeams();

  return (
    <div>
      <PageHeader
        eyebrow="Arquivo 11"
        title="Seleções"
        description="Continente → País → Temporada → Uniforme."
        breadcrumbs={[{ label: "Início", href: "/" }, { label: "Seleções" }]}
      />

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        {nationalTeams.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {nationalTeams.map((team) => (
              <Link
                key={team.id}
                href={`/selecoes/${team.slug}`}
                className="group flex flex-col items-center gap-3 rounded-md border border-line bg-paper-raised p-5 text-center shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <div className="flex h-16 w-16 items-center justify-center">
                  {team.crestUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={team.crestUrl} alt={team.name} className="h-full w-full object-contain" />
                  ) : (
                    <span className="font-display text-xl font-semibold text-ink-faint">
                      {team.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium text-ink group-hover:text-accent">{team.name}</p>
                  <p className="text-xs text-ink-faint">{team.country.name}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nenhuma seleção cadastrada ainda"
            description="O catálogo de seleções começa vazio no MVP — cadastre a primeira pelo painel administrativo."
            action={
              <Link href="/admin/selecoes" className="btn-secondary">
                Ir para o admin de seleções
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
