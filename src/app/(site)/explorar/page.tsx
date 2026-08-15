import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState } from "@/components/empty-state";
import { ManufacturerCard } from "@/components/manufacturer-card";
import { PageHeader } from "@/components/page-header";
import { RandomKitButton } from "@/components/random-kit-button";
import { SectionHeader } from "@/components/section-header";
import { getAvailableSeasonYears } from "@/lib/data/kits";
import { getManufacturersWithKitCount } from "@/lib/data/manufacturers";
import { decadeLabel } from "@/lib/season";

export const metadata: Metadata = {
  title: "Explorar",
  description: "Explore o Arquivo 11 por década ou por fabricante, ou descubra um uniforme aleatório.",
};

export default async function ExplorePage() {
  const [years, manufacturers] = await Promise.all([
    getAvailableSeasonYears(),
    getManufacturersWithKitCount(),
  ]);

  const decades = Array.from(new Set(years.map(decadeLabel))).sort((a, b) => Number(b.slice(0, 4)) - Number(a.slice(0, 4)));

  return (
    <div>
      <PageHeader
        eyebrow="Arquivo 11"
        title="Explorar"
        description="Descubra o arquivo por década, por fabricante, ou deixe o acaso escolher."
        breadcrumbs={[{ label: "Início", href: "/" }, { label: "Explorar" }]}
      />

      <div className="mx-auto flex max-w-6xl flex-col gap-section px-4 py-8 md:px-6">
        <section>
          <SectionHeader title="Por década" />
          {decades.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {decades.map((decade) => (
                <Link
                  key={decade}
                  href={`/temporadas/${decade.slice(0, 4)}`}
                  className="min-w-[7rem] flex-1 rounded-md border border-line bg-paper-raised px-6 py-6 text-center font-display text-2xl font-semibold text-ink shadow-card transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent hover:shadow-card-hover"
                >
                  {decade}
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-6">
              <EmptyState title="Nenhuma temporada cadastrada ainda" />
            </div>
          )}
        </section>

        <section>
          <SectionHeader title="Por fabricante" />
          {manufacturers.length > 0 ? (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {manufacturers.map((manufacturer) => (
                <ManufacturerCard key={manufacturer.id} manufacturer={manufacturer} />
              ))}
            </div>
          ) : (
            <div className="mt-6">
              <EmptyState title="Nenhum fabricante com uniformes cadastrados ainda" />
            </div>
          )}
        </section>

        <section className="flex flex-col items-center gap-4 rounded-lg border border-line bg-accent-soft px-6 py-12 text-center">
          <h2 className="font-display text-2xl font-semibold uppercase tracking-tight text-ink">
            Descubra uma camisa
          </h2>
          <RandomKitButton />
        </section>
      </div>
    </div>
  );
}
