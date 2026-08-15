import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { FormError } from "@/components/admin/form-error";
import { NationalTeamForm } from "@/components/admin/national-team-form";
import { createNationalTeam } from "@/lib/actions/national-teams";
import { getCountries } from "@/lib/data/countries";

export const metadata: Metadata = { title: "Adicionar seleção" };

export default async function NewNationalTeamPage({
  searchParams,
}: PageProps<"/admin/selecoes/novo">) {
  const { erro } = await searchParams;
  const countries = await getCountries();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <AdminPageHeader title="Adicionar seleção" />
      <div className="mt-6">
        <FormError message={typeof erro === "string" ? erro : undefined} />
        <NationalTeamForm action={createNationalTeam} countries={countries} submitLabel="Adicionar seleção" />
      </div>
    </div>
  );
}
