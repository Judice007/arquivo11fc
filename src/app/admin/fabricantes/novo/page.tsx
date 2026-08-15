import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { FormError } from "@/components/admin/form-error";
import { ManufacturerForm } from "@/components/admin/manufacturer-form";
import { createManufacturer } from "@/lib/actions/manufacturers";
import { getCountries } from "@/lib/data/countries";

export const metadata: Metadata = { title: "Adicionar fabricante" };

export default async function NewManufacturerPage({
  searchParams,
}: PageProps<"/admin/fabricantes/novo">) {
  const { erro } = await searchParams;
  const countries = await getCountries();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <AdminPageHeader title="Adicionar fabricante" />
      <div className="mt-6">
        <FormError message={typeof erro === "string" ? erro : undefined} />
        <ManufacturerForm action={createManufacturer} countries={countries} submitLabel="Adicionar fabricante" />
      </div>
    </div>
  );
}
