import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CompetitionForm } from "@/components/admin/competition-form";
import { FormError } from "@/components/admin/form-error";
import { createCompetition } from "@/lib/actions/competitions";
import { getCountries } from "@/lib/data/countries";

export const metadata: Metadata = { title: "Adicionar competição" };

export default async function NewCompetitionPage({
  searchParams,
}: PageProps<"/admin/competicoes/novo">) {
  const { erro } = await searchParams;
  const countries = await getCountries();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <AdminPageHeader title="Adicionar competição" />
      <div className="mt-6">
        <FormError message={typeof erro === "string" ? erro : undefined} />
        <CompetitionForm action={createCompetition} countries={countries} submitLabel="Adicionar competição" />
      </div>
    </div>
  );
}
