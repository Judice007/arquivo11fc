import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { SearchBar } from "@/components/search-bar";
import { globalSearch } from "@/lib/data/search";
import { formatSeason } from "@/lib/season";

export const metadata: Metadata = {
  title: "Busca",
  robots: { index: false },
};

export default async function SearchPage({ searchParams }: PageProps<"/busca">) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q : "";
  const results = await globalSearch(query);

  const hasResults =
    results.clubs.length > 0 || results.nationalTeams.length > 0 || results.manufacturers.length > 0 || results.season;

  return (
    <div>
      <PageHeader
        eyebrow="Arquivo 11"
        title="Busca"
        breadcrumbs={[{ label: "Início", href: "/" }, { label: "Busca" }]}
      />

      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
        <SearchBar size="lg" defaultValue={query} />

        {!query ? (
          <p className="mt-8 text-sm text-ink-muted">Digite um clube, seleção, temporada ou fabricante.</p>
        ) : hasResults ? (
          <div className="mt-8 flex flex-col gap-8">
            {results.clubs.length > 0 && (
              <ResultGroup title="Clubes">
                {results.clubs.map((club) => (
                  <ResultLink key={club.id} href={`/clubes/${club.slug}`} label={club.name} sub={club.country?.name} />
                ))}
              </ResultGroup>
            )}

            {results.nationalTeams.length > 0 && (
              <ResultGroup title="Seleções">
                {results.nationalTeams.map((team) => (
                  <ResultLink key={team.id} href={`/selecoes/${team.slug}`} label={team.name} sub={team.country?.name} />
                ))}
              </ResultGroup>
            )}

            {results.manufacturers.length > 0 && (
              <ResultGroup title="Marcas">
                {results.manufacturers.map((manufacturer) => (
                  <ResultLink key={manufacturer.id} href={`/marcas/${manufacturer.slug}`} label={manufacturer.name} />
                ))}
              </ResultGroup>
            )}

            {results.season && (
              <ResultGroup title="Temporada">
                <ResultLink
                  href={`/temporadas/${results.season.seasonStart}`}
                  label={formatSeason(results.season.seasonStart, results.season.seasonEnd)}
                />
              </ResultGroup>
            )}
          </div>
        ) : (
          <div className="mt-8">
            <EmptyState title={`Nada encontrado para "${query}"`} description="Tente outro clube, seleção, temporada ou fabricante." />
          </div>
        )}
      </div>
    </div>
  );
}

function ResultGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-faint">{title}</h2>
      <ul className="flex flex-col divide-y divide-line rounded-md border border-line bg-paper-raised">
        {children}
      </ul>
    </div>
  );
}

function ResultLink({ href, label, sub }: { href: string; label: string; sub?: string }) {
  return (
    <li>
      <Link href={href} className="flex items-center justify-between px-4 py-3 hover:bg-paper-muted">
        <span className="font-medium text-ink">{label}</span>
        {sub && <span className="text-sm text-ink-faint">{sub}</span>}
      </Link>
    </li>
  );
}
