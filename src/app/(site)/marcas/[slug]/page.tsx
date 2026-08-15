import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { EmptyState } from "@/components/empty-state";
import { KitCard } from "@/components/kit-card";
import { PageHeader } from "@/components/page-header";
import { getManufacturerBySlug, getManufacturerKits } from "@/lib/data/manufacturers";

export async function generateMetadata({
  params,
}: PageProps<"/marcas/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const manufacturer = await getManufacturerBySlug(slug);
  if (!manufacturer) return {};

  return {
    title: manufacturer.name,
    description: `Uniformes fabricados pela ${manufacturer.name} catalogados no Arquivo 11.`,
  };
}

export default async function ManufacturerPage({
  params,
}: PageProps<"/marcas/[slug]">) {
  const { slug } = await params;
  const manufacturer = await getManufacturerBySlug(slug);
  if (!manufacturer) notFound();

  const kits = await getManufacturerKits(manufacturer.id);

  return (
    <div>
      <PageHeader
        breadcrumbs={[{ label: "Início", href: "/" }, { label: "Marcas", href: "/marcas" }, { label: manufacturer.name }]}
        eyebrow="Fabricante"
        title={manufacturer.name}
        description={`${kits.length} ${kits.length === 1 ? "uniforme catalogado" : "uniformes catalogados"}.`}
      />

      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8">
        {kits.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {kits.map((kit) => (
              <KitCard key={kit.id} kit={kit} />
            ))}
          </div>
        ) : (
          <EmptyState title="Nenhum uniforme cadastrado para esta marca ainda" />
        )}
      </div>
    </div>
  );
}
