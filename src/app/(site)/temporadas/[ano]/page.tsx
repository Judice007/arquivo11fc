import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EmptyState } from "@/components/empty-state";
import { KitCard } from "@/components/kit-card";
import { PageHeader } from "@/components/page-header";
import { getKitsByYear } from "@/lib/data/kits";

export async function generateMetadata({
  params,
}: PageProps<"/temporadas/[ano]">): Promise<Metadata> {
  const { ano } = await params;
  return {
    title: `Temporada ${ano}`,
    description: `Uniformes catalogados no Arquivo 11 associados à temporada ${ano}.`,
  };
}

export default async function SeasonYearPage({
  params,
}: PageProps<"/temporadas/[ano]">) {
  const { ano } = await params;
  const year = Number(ano);
  if (!Number.isInteger(year)) notFound();

  const kits = await getKitsByYear(year);

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: "Início", href: "/" },
          { label: "Temporadas", href: "/temporadas" },
          { label: String(year) },
        ]}
        eyebrow="Temporada"
        title={String(year)}
        description="Uniformes de clubes e seleções associados a esta temporada."
      />

      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8">
        {kits.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {kits.map((kit) => (
              <KitCard key={kit.id} kit={kit} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nenhum uniforme cadastrado para esta temporada"
            description="Experimente outra década em /temporadas."
          />
        )}
      </div>
    </div>
  );
}
