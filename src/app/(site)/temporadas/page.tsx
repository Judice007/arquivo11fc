import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { getAvailableSeasonYears } from "@/lib/data/kits";

export const metadata: Metadata = {
  title: "Temporadas",
  description: "Navegue pelo arquivo ano a ano.",
};

export default async function SeasonsPage() {
  const years = await getAvailableSeasonYears();

  return (
    <div>
      <PageHeader
        eyebrow="Arquivo 11"
        title="Temporadas"
        description="Navegue pelo arquivo ano a ano."
        breadcrumbs={[{ label: "Início", href: "/" }, { label: "Temporadas" }]}
      />

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        {years.length > 0 ? (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {years.map((year) => (
              <Link
                key={year}
                href={`/temporadas/${year}`}
                className="rounded-md border border-line bg-paper-raised px-4 py-4 text-center font-display text-lg font-semibold text-ink shadow-card transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent hover:shadow-card-hover"
              >
                {year}
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState title="Nenhuma temporada cadastrada ainda" />
        )}
      </div>
    </div>
  );
}
