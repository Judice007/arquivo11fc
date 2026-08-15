import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CountryForm } from "@/components/admin/country-form";
import { FormError } from "@/components/admin/form-error";
import { createCountry } from "@/lib/actions/countries";

export const metadata: Metadata = { title: "Adicionar país" };

export default async function NewCountryPage({
  searchParams,
}: PageProps<"/admin/paises/novo">) {
  const { erro } = await searchParams;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <AdminPageHeader title="Adicionar país" />
      <div className="mt-6">
        <FormError message={typeof erro === "string" ? erro : undefined} />
        <CountryForm action={createCountry} submitLabel="Adicionar país" />
      </div>
    </div>
  );
}
