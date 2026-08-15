import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ClubForm } from "@/components/admin/club-form";
import { FormError } from "@/components/admin/form-error";
import { createClub } from "@/lib/actions/clubs";
import { getCountries } from "@/lib/data/countries";

export const metadata: Metadata = { title: "Adicionar clube" };

export default async function NewClubPage({
  searchParams,
}: PageProps<"/admin/clubes/novo">) {
  const { erro } = await searchParams;
  const countries = await getCountries();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <AdminPageHeader title="Adicionar clube" />
      <div className="mt-6">
        <FormError message={typeof erro === "string" ? erro : undefined} />
        <ClubForm action={createClub} countries={countries} submitLabel="Adicionar clube" />
      </div>
    </div>
  );
}
