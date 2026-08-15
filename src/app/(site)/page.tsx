import Link from "next/link";

import { ClubCard } from "@/components/club-card";
import { EmptyState } from "@/components/empty-state";
import { KitCard } from "@/components/kit-card";
import { ManufacturerCard } from "@/components/manufacturer-card";
import { RandomKitButton } from "@/components/random-kit-button";
import { SearchBar } from "@/components/search-bar";
import { SectionHeader } from "@/components/section-header";
import { getFeaturedClubs } from "@/lib/data/clubs";
import { getRecentKits } from "@/lib/data/kits";
import { getManufacturersWithKitCount } from "@/lib/data/manufacturers";

const DECADES = [
  { label: "2020s", representativeYear: 2020 },
  { label: "2010s", representativeYear: 2010 },
  { label: "2000s", representativeYear: 2000 },
  { label: "1990s", representativeYear: 1990 },
  { label: "1980s", representativeYear: 1980 },
];

export default async function HomePage() {
  const [clubs, recentKits, manufacturers] = await Promise.all([
    getFeaturedClubs(8),
    getRecentKits(8),
    getManufacturersWithKitCount(7),
  ]);

  return (
    <div className="flex flex-col gap-section pb-section">
      <section className="border-b border-line bg-paper-raised">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 py-16 text-center md:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brass">
            Arquivo visual de uniformes de futebol
          </p>
          <h1 className="font-display text-5xl font-bold uppercase leading-none tracking-tight text-ink md:text-7xl">
            Arquivo 11
          </h1>
          <p className="max-w-xl text-lg text-ink-muted">
            A história do futebol contada através de seus uniformes.
          </p>
          <SearchBar size="lg" className="w-full max-w-lg" />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <SectionHeader title="Clubes em destaque" href="/clubes" />
        {clubs.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {clubs.map((club) => (
              <ClubCard key={club.id} club={club} />
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <EmptyState title="Nenhum clube cadastrado ainda" />
          </div>
        )}
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <SectionHeader title="Uniformes recentes" description="Os últimos uniformes adicionados ao arquivo." />
        {recentKits.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {recentKits.map((kit) => (
              <KitCard key={kit.id} kit={kit} />
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <EmptyState title="Nenhum uniforme cadastrado ainda" />
          </div>
        )}
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <SectionHeader title="Volte no tempo" description="Explore uniformes por década." />
        <div className="mt-6 flex flex-wrap gap-3">
          {DECADES.map((decade) => (
            <Link
              key={decade.label}
              href={`/temporadas/${decade.representativeYear}`}
              className="flex-1 min-w-[7rem] rounded-md border border-line bg-paper-raised px-6 py-6 text-center font-display text-2xl font-semibold text-ink shadow-card transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent hover:shadow-card-hover"
            >
              {decade.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <SectionHeader title="Explore por fabricante" href="/marcas" />
        {manufacturers.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {manufacturers.map((manufacturer) => (
              <ManufacturerCard key={manufacturer.id} manufacturer={manufacturer} />
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <EmptyState title="Nenhum fabricante cadastrado ainda" />
          </div>
        )}
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div className="flex flex-col items-center gap-4 rounded-lg border border-line bg-accent-soft px-6 py-12 text-center">
          <h2 className="font-display text-2xl font-semibold uppercase tracking-tight text-ink">
            Descubra uma camisa
          </h2>
          <p className="max-w-md text-sm text-ink-muted">
            Não sabe por onde começar? Deixe o arquivo escolher um uniforme por você.
          </p>
          <RandomKitButton />
        </div>
      </section>
    </div>
  );
}
