import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CountryForm } from "@/components/admin/country-form";
import { FormError } from "@/components/admin/form-error";
import { updateCountry } from "@/lib/actions/countries";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Editar país" };

export default async function EditCountryPage({
  params,
  searchParams,
}: PageProps<"/admin/paises/[id]/editar">) {
  const { id } = await params;
  const { erro } = await searchParams;

  const country = await prisma.country.findUnique({ where: { id } });
  if (!country) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <AdminPageHeader title={`Editar ${country.name}`} />
      <div className="mt-6">
        <FormError message={typeof erro === "string" ? erro : undefined} />
        <CountryForm action={updateCountry.bind(null, id)} country={country} submitLabel="Salvar alterações" />
      </div>
    </div>
  );
}
