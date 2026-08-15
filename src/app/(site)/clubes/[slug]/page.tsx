import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EmptyState } from "@/components/empty-state";
import { KitCard } from "@/components/kit-card";
import { KitTypeFilter } from "@/components/kit-type-filter";
import { PageHeader } from "@/components/page-header";
import { SeasonSelector } from "@/components/season-selector";
import { getClubBySlug, getClubKits, getClubSeasons } from "@/lib/data/clubs";
import { isKitType } from "@/lib/kit-types";

export async function generateMetadata({
  params,
}: PageProps<"/clubes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const club = await getClubBySlug(slug);
  if (!club) return {};

  return {
    title: club.name,
    description: `Escudo, dados e uniformes do ${club.name} catalogados no Arquivo 11.`,
  };
}

export default async function ClubPage({
  params,
  searchParams,
}: PageProps<"/clubes/[slug]">) {
  const { slug } = await params;
  const { tipo } = await searchParams;
  const activeType = typeof tipo === "string" && isKitType(tipo) ? tipo : undefined;

  const club = await getClubBySlug(slug);
  if (!club) notFound();

  const [seasons, kits] = await Promise.all([
    getClubSeasons(club.id),
    getClubKits(club.id, activeType),
  ]);

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: "Início", href: "/" }, { label: "Clubes", href: "/clubes" }, { label: club.name }]}
        eyebrow={club.country.name}
        title={club.name}
        description={club.fullName}
      />

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="flex flex-col gap-6 rounded-md border border-line bg-paper-raised p-6 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center">
            {club.crestUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={club.crestUrl} alt={club.name} className="h-full w-full object-contain" />
            ) : (
              <span className="font-display text-3xl font-semibold text-ink-faint">
                {club.name.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <dl className="grid flex-1 grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <Info label="Nome completo" value={club.fullName} />
            <Info label="País" value={club.country.name} />
            <Info label="Cidade" value={club.city ?? "—"} />
            <Info label="Fundação" value={club.foundedYear ? String(club.foundedYear) : "—"} />
          </dl>
        </div>

        {seasons.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-faint">
              Temporadas
            </h2>
            <SeasonSelector basePath={`/clubes/${club.slug}`} seasons={seasons} />
          </div>
        )}

        <div className="mt-8">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Uniformes
          </h2>
          <KitTypeFilter basePath={`/clubes/${club.slug}`} activeType={activeType} />
        </div>

        {kits.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {kits.map((kit) => (
              <KitCard key={kit.id} kit={kit} />
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <EmptyState
              title="Nenhum uniforme encontrado"
              description="Este clube ainda não tem uniformes cadastrados para esse filtro."
            />
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-ink-faint">{label}</dt>
      <dd className="mt-0.5 font-medium text-ink">{value}</dd>
    </div>
  );
}
