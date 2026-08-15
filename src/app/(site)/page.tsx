import Link from "next/link";

import { ClubCard } from "@/components/club-card";
import { DecadeCard } from "@/components/decade-card";
import { EmptyState } from "@/components/empty-state";
import { KitCard, type KitCardKit } from "@/components/kit-card";
import { ManufacturerCard } from "@/components/manufacturer-card";
import { RandomKitButton } from "@/components/random-kit-button";
import { SearchBar } from "@/components/search-bar";
import { SectionHeader } from "@/components/section-header";
import { archiveTag } from "@/lib/archive-tag";
import { getFeaturedClubs } from "@/lib/data/clubs";
import { getHeroKits, getRecentKits } from "@/lib/data/kits";
import { getManufacturersWithKitCount } from "@/lib/data/manufacturers";
import { kitTypeLabel } from "@/lib/kit-types";
import { formatSeason } from "@/lib/season";

const DECADES = [
  { label: "2020s", representativeYear: 2020 },
  { label: "2010s", representativeYear: 2010 },
  { label: "2000s", representativeYear: 2000 },
  { label: "1990s", representativeYear: 1990 },
  { label: "1980s", representativeYear: 1980 },
];

const HERO_LABELS = {
  searched: "Mais buscado",
  recent: "Mais recente",
  viewed: "Mais visualizado",
} as const;

export default async function HomePage() {
  const [clubs, recentKits, manufacturers, heroKitsByRanking] = await Promise.all([
    getFeaturedClubs(8),
    getRecentKits(8),
    getManufacturersWithKitCount(7),
    getHeroKits(),
  ]);

  const heroKitEntries: { kit: KitCardKit | null; label: string }[] = [
    { kit: heroKitsByRanking.searched, label: HERO_LABELS.searched },
    { kit: heroKitsByRanking.recent, label: HERO_LABELS.recent },
    { kit: heroKitsByRanking.viewed, label: HERO_LABELS.viewed },
  ];
  const heroKits = heroKitEntries.filter(
    (entry): entry is { kit: KitCardKit; label: string } => entry.kit !== null,
  );

  return (
    <div className="flex flex-col gap-section pb-section">
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-4 py-14 md:grid-cols-2 md:gap-12 md:px-8 md:py-20">
          <div className="flex flex-col gap-6">
            <h1 className="font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight text-ink sm:text-6xl lg:text-7xl">
              A história do futebol vestida em camisas.
            </h1>
            <p className="max-w-md text-base leading-relaxed text-ink-muted">
              Um arquivo digital que celebra a memória do futebol através de seus uniformes mais
              marcantes. Explore, relembre e descubra camisas que contam histórias dentro e fora de
              campo.
            </p>
            <SearchBar size="lg" className="w-full max-w-md" />
          </div>

          {heroKits.length > 0 && (
            <>
              <div className="hidden items-end justify-center md:flex">
                {heroKits.map(({ kit, label }, index) => (
                  <div
                    key={kit.id}
                    className={
                      index === 1
                        ? "relative z-10 w-48 -translate-y-4 shadow-card-hover lg:w-56"
                        : `relative w-36 lg:w-44 ${index === 0 ? "-mr-8" : "-ml-8"}`
                    }
                  >
                    <HeroKitTile kit={kit} label={label} />
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3 md:hidden">
                {heroKits.map(({ kit, label }) => (
                  <HeroKitTile key={kit.id} kit={kit} label={label} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-4 md:px-8">
        <SectionHeader title="Clubes em destaque" href="/clubes" />
        {clubs.length > 0 ? (
          <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
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

      <section className="mx-auto w-full max-w-[1440px] px-4 md:px-8">
        <SectionHeader title="Uniformes recentes" description="Os últimos uniformes adicionados ao arquivo." />
        {recentKits.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
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

      <section className="mx-auto w-full max-w-[1440px] px-4 md:px-8">
        <SectionHeader title="Volte no tempo" description="Explore uniformes por década." />
        <div className="mt-6 flex flex-wrap gap-3">
          {DECADES.map((decade) => (
            <DecadeCard
              key={decade.label}
              decadeLabel={decade.label}
              href={`/temporadas/${decade.representativeYear}`}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1440px] px-4 md:px-8">
        <SectionHeader title="Explore por fabricante" href="/marcas" />
        {manufacturers.length > 0 ? (
          <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-7">
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

      <section className="mx-auto w-full max-w-[1440px] px-4 md:px-8">
        <div className="flex flex-col items-center gap-5 rounded-lg border border-line bg-paper-raised px-6 py-10 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
              <ShirtQuestionIcon />
            </span>
            <div>
              <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-ink">
                Descubra uma camisa
              </h2>
              <p className="mt-1 max-w-sm text-sm text-ink-muted">
                Deixe a sorte escolher por você. Descubra um uniforme aleatório do nosso acervo.
              </p>
            </div>
          </div>
          <RandomKitButton />
        </div>
      </section>
    </div>
  );
}

function HeroKitTile({ kit, label }: { kit: KitCardKit; label: string }) {
  const owner = kit.club ?? kit.nationalTeam;
  const tag = owner ? archiveTag({ type: kit.type, seasonStart: kit.seasonStart, country: owner.country }) : null;
  const ownerName = owner?.name ?? "";

  return (
    <Link
      href={`/uniformes/${kit.slug}`}
      className="block overflow-hidden rounded-lg border border-line bg-paper-raised transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <div className="relative flex aspect-[3/4] items-center justify-center bg-paper-muted">
        <span className="absolute left-1.5 top-1.5 z-10 rounded-full bg-ink/80 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-paper">
          {label}
        </span>
        {kit.mainImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={kit.mainImageUrl}
            alt={`${ownerName} — ${kitTypeLabel(kit.type)} ${formatSeason(kit.seasonStart, kit.seasonEnd)}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="px-2 text-center text-[10px] text-ink-faint">Sem imagem</span>
        )}
        {kit.mainImageUrl && kit.mainImageSourceType === "DIGITAL_RECREATION" && (
          <span className="absolute right-1.5 top-1.5 rounded-full bg-paper-raised/90 px-1.5 py-0.5 text-[9px] font-medium text-ink-muted">
            Recriação digital
          </span>
        )}
      </div>
      <div className="border-t border-line px-2.5 py-1.5 text-center">
        <p className="truncate text-xs font-medium text-ink">{ownerName}</p>
        <p className="truncate text-[10px] text-ink-muted">
          {kitTypeLabel(kit.type)} · {formatSeason(kit.seasonStart, kit.seasonEnd)}
        </p>
        {tag && <p className="mt-0.5 truncate text-[9px] uppercase tracking-wide text-ink-faint">{tag}</p>}
      </div>
    </Link>
  );
}

function ShirtQuestionIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path
        d="M8 4 4 7l2 3 2-1.2V19a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V8.8L18 10l2-3-4-3-2 1.5h-4L8 4Z"
        strokeLinejoin="round"
      />
      <path d="M12 12.5v-.3c0-.6.4-.9.9-1.2.5-.3.9-.6.9-1.2 0-.7-.6-1.2-1.4-1.2s-1.4.5-1.4 1.2" strokeLinecap="round" />
      <circle cx="12" cy="15.2" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
