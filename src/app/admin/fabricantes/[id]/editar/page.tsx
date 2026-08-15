import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { FormError } from "@/components/admin/form-error";
import { ManufacturerForm } from "@/components/admin/manufacturer-form";
import { updateManufacturer } from "@/lib/actions/manufacturers";
import { getCountries } from "@/lib/data/countries";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Editar fabricante" };

export default async function EditManufacturerPage({
  params,
  searchParams,
}: PageProps<"/admin/fabricantes/[id]/editar">) {
  const { id } = await params;
  const { erro } = await searchParams;

  const [manufacturer, countries] = await Promise.all([
    prisma.manufacturer.findUnique({ where: { id } }),
    getCountries(),
  ]);
  if (!manufacturer) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <AdminPageHeader title={`Editar ${manufacturer.name}`} />
      <div className="mt-6">
        <FormError message={typeof erro === "string" ? erro : undefined} />
        <ManufacturerForm
          action={updateManufacturer.bind(null, id)}
          manufacturer={manufacturer}
          countries={countries}
          submitLabel="Salvar alterações"
        />
      </div>
    </div>
  );
}
