import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EmptyState } from "@/components/empty-state";
import { KitCard } from "@/components/kit-card";
import { KitTypeFilter } from "@/components/kit-type-filter";
import { PageHeader } from "@/components/page-header";
import { SeasonSelector } from "@/components/season-selector";
import { getNationalTeamBySlug, getNationalTeamKits, getNationalTeamSeasons } from "@/lib/data/national-teams";
import { isKitType } from "@/lib/kit-types";

export async function generateMetadata({
  params,
}: PageProps<"/selecoes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const team = await getNationalTeamBySlug(slug);
  if (!team) return {};

  return {
    title: team.name,
    description: `Escudo, dados e uniformes da seleção ${team.name} catalogados no Arquivo 11.`,
  };
}

export default async function NationalTeamPage({
  params,
  searchParams,
}: PageProps<"/selecoes/[slug]">) {
  const { slug } = await params;
  const { tipo } = await searchParams;
  const activeType = typeof tipo === "string" && isKitType(tipo) ? tipo : undefined;

  const team = await getNationalTeamBySlug(slug);
  if (!team) notFound();

  const [seasons, kits] = await Promise.all([
    getNationalTeamSeasons(team.id),
    getNationalTeamKits(team.id, activeType),
  ]);

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Início", href: "/" },
          { label: "Seleções", href: "/selecoes" },
          { label: team.name },
        ]}
        eyebrow={team.country.name}
        title={team.name}
      />

      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8">
        <div className="flex items-center gap-6 rounded-md border border-line bg-paper-raised p-6">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center">
            {team.crestUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={team.crestUrl} alt={team.name} className="h-full w-full object-contain" />
            ) : (
              <span className="font-display text-3xl font-semibold text-ink-faint">
                {team.name.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-ink-faint">País</p>
            <p className="font-medium text-ink">{team.country.name}</p>
          </div>
        </div>

        {seasons.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-faint">Temporadas</h2>
            <SeasonSelector basePath={`/selecoes/${team.slug}`} seasons={seasons} />
          </div>
        )}

        <div className="mt-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-faint">Uniformes</h2>
          <KitTypeFilter basePath={`/selecoes/${team.slug}`} activeType={activeType} />
        </div>

        {kits.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {kits.map((kit) => (
              <KitCard key={kit.id} kit={kit} />
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <EmptyState title="Nenhum uniforme cadastrado" />
          </div>
        )}
      </div>
    </div>
  );
}
