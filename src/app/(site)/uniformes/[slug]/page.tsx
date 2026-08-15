import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { KitCard } from "@/components/kit-card";
import { PageHeader } from "@/components/page-header";
import { SectionHeader } from "@/components/section-header";
import { archiveTag } from "@/lib/archive-tag";
import { getKitBySlug, getOtherKitsSameSeason, kitOwner } from "@/lib/data/kits";
import { kitTypeLabel } from "@/lib/kit-types";
import { formatSeason } from "@/lib/season";

export async function generateMetadata({
  params,
}: PageProps<"/uniformes/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const kit = await getKitBySlug(slug);
  if (!kit) return {};

  const owner = kitOwner(kit);
  const season = formatSeason(kit.seasonStart, kit.seasonEnd);

  return {
    title: `${owner.name} ${kitTypeLabel(kit.type)} ${season}`,
    description: kit.description ?? `Uniforme ${kitTypeLabel(kit.type)} do ${owner.name} na temporada ${season}.`,
    openGraph: kit.mainImageUrl ? { images: [{ url: kit.mainImageUrl }] } : undefined,
  };
}

export default async function KitPage({ params }: PageProps<"/uniformes/[slug]">) {
  const { slug } = await params;
  const kit = await getKitBySlug(slug);
  if (!kit) notFound();

  const owner = kitOwner(kit);
  const ownerHref = owner.kind === "club" ? `/clubes/${owner.slug}` : `/selecoes/${owner.slug}`;
  const season = formatSeason(kit.seasonStart, kit.seasonEnd);
  const otherKits = await getOtherKitsSameSeason(kit);
  const ownerCountry = kit.club?.country ?? kit.nationalTeam?.country ?? null;
  const tag = ownerCountry ? archiveTag({ type: kit.type, seasonStart: kit.seasonStart, country: ownerCountry }) : null;

  const hasAcervo = Boolean(kit.mainImageUrl || kit.backImageUrl);
  const hasReference = Boolean(kit.sourceUrl || kit.sourceOwner || kit.imageCredit || kit.photographer || kit.imageLicense);

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Início", href: "/" },
          owner.kind === "club" ? { label: "Clubes", href: "/clubes" } : { label: "Seleções", href: "/selecoes" },
          { label: owner.name, href: ownerHref },
          { label: `${kitTypeLabel(kit.type)} ${season}` },
        ]}
        title={`${owner.name} — ${kitTypeLabel(kit.type)} ${season}`}
      />

      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-8 md:grid-cols-[3fr_2fr] md:px-8">
        <div>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Imagens do acervo
          </h2>

          {hasAcervo ? (
            <div className="grid grid-cols-2 gap-3">
              <AcervoImage label="Frente" url={kit.mainImageUrl} alt={`${owner.name} — ${kitTypeLabel(kit.type)} ${season} (frente)`} />
              <AcervoImage label="Costas" url={kit.backImageUrl} alt={`${owner.name} — ${kitTypeLabel(kit.type)} ${season} (costas)`} />
            </div>
          ) : (
            <div className="flex aspect-[4/5] items-center justify-center rounded-md border border-dashed border-line bg-paper-muted">
              <span className="max-w-[16rem] px-4 text-center text-sm text-ink-faint">
                Ainda sem imagem padronizada do acervo para este uniforme.
              </span>
            </div>
          )}

          {kit.images.length > 0 && (
            <div className="mt-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                Ângulos adicionais
              </h3>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {kit.images.map((image) => (
                  <div
                    key={image.id}
                    className="flex aspect-square items-center justify-center overflow-hidden rounded-md border border-line bg-paper-muted"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image.imageUrl} alt={image.type} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <dl className="grid grid-cols-2 gap-4 rounded-md border border-line bg-paper-raised p-5 text-sm">
            <Info label="Clube/Seleção" value={owner.name} />
            <Info label="Temporada" value={season} />
            <Info label="Tipo" value={kitTypeLabel(kit.type)} />
            <Info label="Fabricante" value={kit.manufacturer?.name ?? "—"} />
            <Info label="Patrocinador" value={kit.mainSponsor?.name ?? "—"} />
            <Info
              label="Competições"
              value={kit.competitions.length > 0 ? kit.competitions.map((c) => c.competition.name).join(", ") : "—"}
            />
          </dl>

          <div className="flex gap-4">
            <ColorSwatch label="Cor principal" color={kit.primaryColor} />
            <ColorSwatch label="Cor secundária" color={kit.secondaryColor} />
          </div>

          {tag && <p className="text-xs uppercase tracking-wide text-ink-faint">{tag}</p>}

          {kit.description && (
            <div>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                Sobre este uniforme
              </h2>
              <p className="text-sm leading-relaxed text-ink-muted">{kit.description}</p>
            </div>
          )}

          {hasReference && (
            <div className="rounded-md border border-line bg-paper-muted p-4">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                Fontes e referências
              </h2>
              <dl className="flex flex-col gap-2 text-sm">
                {kit.sourceOwner && <Info label="Titular/origem" value={kit.sourceOwner} />}
                {kit.imageCredit && <Info label="Crédito" value={kit.imageCredit} />}
                {kit.photographer && <Info label="Fotógrafo" value={kit.photographer} />}
                {kit.imageLicense && <Info label="Observação de uso" value={kit.imageLicense} />}
              </dl>
              {kit.sourceUrl && (
                <a
                  href={kit.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm font-medium text-accent underline hover:text-accent-strong"
                >
                  Ver URL oficial →
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {otherKits.length > 0 && (
        <div className="mx-auto max-w-[1440px] px-4 pb-16 md:px-8">
          <SectionHeader title="Outros uniformes desta temporada" />
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {otherKits.map((other) => (
              <KitCard key={other.id} kit={other} />
            ))}
          </div>
        </div>
      )}

      {/*
        "Uniformes relacionados" (por cor, fabricante, época, etc.) fica para uma fase
        futura — ver docs/PROJECT_SPEC.md. getOtherKitsSameSeason cobre o requisito
        atual do MVP; uma função equivalente pode ser adicionada em src/lib/data/kits.ts
        quando esse recurso for priorizado.
      */}
    </div>
  );
}

function AcervoImage({ label, url, alt }: { label: string; url: string | null; alt: string }) {
  return (
    <div>
      <div className="flex aspect-[4/5] items-center justify-center overflow-hidden rounded-md border border-line bg-paper-muted">
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <span className="px-2 text-center text-xs text-ink-faint">Pendente</span>
        )}
      </div>
      <p className="mt-1.5 text-center text-xs uppercase tracking-wide text-ink-faint">{label}</p>
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

function ColorSwatch({ label, color }: { label: string; color: string | null }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="h-8 w-8 shrink-0 rounded-full border border-line-strong"
        style={{ backgroundColor: color ?? "transparent" }}
        aria-hidden="true"
      />
      <div>
        <p className="text-xs uppercase tracking-wide text-ink-faint">{label}</p>
        <p className="text-sm font-medium text-ink">{color ?? "—"}</p>
      </div>
    </div>
  );
}
