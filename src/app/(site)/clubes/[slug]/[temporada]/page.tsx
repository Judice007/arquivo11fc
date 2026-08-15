import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EmptyState } from "@/components/empty-state";
import { KitCard } from "@/components/kit-card";
import { PageHeader } from "@/components/page-header";
import { SeasonSelector } from "@/components/season-selector";
import { getClubBySlug, getClubSeasonKits, getClubSeasons } from "@/lib/data/clubs";
import { KIT_TYPES, type KitType } from "@/lib/kit-types";
import { formatSeason, parseSeasonSlug } from "@/lib/season";

export async function generateMetadata({
  params,
}: PageProps<"/clubes/[slug]/[temporada]">): Promise<Metadata> {
  const { slug, temporada } = await params;
  const club = await getClubBySlug(slug);
  const season = parseSeasonSlug(temporada);
  if (!club || !season) return {};

  const label = formatSeason(season.seasonStart, season.seasonEnd);
  return {
    title: `${club.name} ${label} Uniformes`,
    description: `Todos os uniformes do ${club.name} na temporada ${label}, catalogados no Arquivo 11.`,
  };
}

export default async function ClubSeasonPage({
  params,
}: PageProps<"/clubes/[slug]/[temporada]">) {
  const { slug, temporada } = await params;
  const season = parseSeasonSlug(temporada);
  if (!season) notFound();

  const club = await getClubBySlug(slug);
  if (!club) notFound();

  const [kits, seasons] = await Promise.all([
    getClubSeasonKits(club.id, season.seasonStart, season.seasonEnd),
    getClubSeasons(club.id),
  ]);

  const sortedKits = [...kits].sort(
    (a, b) => KIT_TYPES.indexOf(a.type as KitType) - KIT_TYPES.indexOf(b.type as KitType),
  );
  const seasonLabel = formatSeason(season.seasonStart, season.seasonEnd);

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Início", href: "/" },
          { label: "Clubes", href: "/clubes" },
          { label: club.name, href: `/clubes/${club.slug}` },
          { label: seasonLabel },
        ]}
        eyebrow={club.name}
        title={`${club.name} — ${seasonLabel}`}
        description="Todos os uniformes catalogados para esta temporada."
      />

      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8">
        {seasons.length > 1 && (
          <div className="mb-8">
            <SeasonSelector basePath={`/clubes/${club.slug}`} seasons={seasons} activeSeason={season} />
          </div>
        )}

        {sortedKits.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {sortedKits.map((kit) => (
              <KitCard key={kit.id} kit={kit} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nenhum uniforme cadastrado nesta temporada"
            description="Volte para a página do clube para ver outras temporadas."
          />
        )}
      </div>
    </div>
  );
}
