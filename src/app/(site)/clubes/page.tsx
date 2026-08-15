import type { Metadata } from "next";

import { ClubCard } from "@/components/club-card";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { getClubs, type ClubFilters } from "@/lib/data/clubs";
import { getContinentsWithClubs, getCountriesWithClubs } from "@/lib/data/countries";

export const metadata: Metadata = {
  title: "Clubes",
  description: "Todos os clubes catalogados no Arquivo 11, filtrados por continente e país.",
};

export default async function ClubesPage({
  searchParams,
}: PageProps<"/clubes">) {
  const params = await searchParams;
  const continent = firstValue(params.continente);
  const countrySlug = firstValue(params.pais);
  const query = firstValue(params.q);
  const sort = firstValue(params.ordenar) === "fundacao" ? "fundacao" : "nome";

  const filters: ClubFilters = { continent, countrySlug, query, sort };

  const [clubs, continents, countries] = await Promise.all([
    getClubs(filters),
    getContinentsWithClubs(),
    getCountriesWithClubs(continent),
  ]);

  return (
    <div>
      <PageHeader
        eyebrow="Arquivo 11"
        title="Clubes"
        description="Navegue pelos clubes catalogados, filtrando por continente, país ou nome."
        breadcrumbs={[{ label: "Início", href: "/" }, { label: "Clubes" }]}
      />

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <form method="get" className="flex flex-wrap items-end gap-3 rounded-md border border-line bg-paper-raised p-4">
          <Field label="Continente">
            <select name="continente" defaultValue={continent ?? ""} className="field-select">
              <option value="">Todos</option>
              {continents.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>

          <Field label="País">
            <select name="pais" defaultValue={countrySlug ?? ""} className="field-select">
              <option value="">Todos</option>
              {countries.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Buscar por nome">
            <input
              type="text"
              name="q"
              defaultValue={query ?? ""}
              placeholder="Nome do clube"
              className="field-input"
            />
          </Field>

          <Field label="Ordenar por">
            <select name="ordenar" defaultValue={sort} className="field-select">
              <option value="nome">Nome (A-Z)</option>
              <option value="fundacao">Ano de fundação</option>
            </select>
          </Field>

          <button
            type="submit"
            className="rounded-md bg-ink px-5 py-2 text-sm font-semibold text-paper transition-colors hover:bg-accent-strong"
          >
            Filtrar
          </button>
        </form>

        <p className="mt-6 text-sm text-ink-muted">
          {clubs.length} {clubs.length === 1 ? "clube encontrado" : "clubes encontrados"}
        </p>

        {clubs.length > 0 ? (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {clubs.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        ) : (
          <div className="mt-4">
            <EmptyState
              title="Nenhum clube encontrado"
              description="Tente remover algum filtro ou buscar por outro nome."
            />
          </div>
        )}
      </div>
    </div>
  );
}

function firstValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value || undefined;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="field-label">
      {label}
      {children}
    </label>
  );
}
