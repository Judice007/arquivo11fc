import type { Metadata } from "next";

import { EmptyState } from "@/components/empty-state";
import { ManufacturerCard } from "@/components/manufacturer-card";
import { PageHeader } from "@/components/page-header";
import { getManufacturers } from "@/lib/data/manufacturers";

export const metadata: Metadata = {
  title: "Marcas",
  description: "Fabricantes de material esportivo catalogados no Arquivo 11.",
};

export default async function ManufacturersPage() {
  const manufacturers = await getManufacturers();

  return (
    <div>
      <PageHeader
        eyebrow="Arquivo 11"
        title="Marcas"
        description="Fabricantes de material esportivo presentes no arquivo."
        breadcrumbs={[{ label: "Início", href: "/" }, { label: "Marcas" }]}
      />

      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8">
        {manufacturers.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {manufacturers.map((manufacturer) => (
              <ManufacturerCard key={manufacturer.id} manufacturer={manufacturer} />
            ))}
          </div>
        ) : (
          <EmptyState title="Nenhum fabricante cadastrado ainda" />
        )}
      </div>
    </div>
  );
}
