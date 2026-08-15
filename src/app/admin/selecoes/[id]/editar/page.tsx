import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { FormError } from "@/components/admin/form-error";
import { NationalTeamForm } from "@/components/admin/national-team-form";
import { updateNationalTeam } from "@/lib/actions/national-teams";
import { getCountries } from "@/lib/data/countries";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Editar seleção" };

export default async function EditNationalTeamPage({
  params,
  searchParams,
}: PageProps<"/admin/selecoes/[id]/editar">) {
  const { id } = await params;
  const { erro } = await searchParams;

  const [nationalTeam, countries] = await Promise.all([
    prisma.nationalTeam.findUnique({ where: { id } }),
    getCountries(),
  ]);
  if (!nationalTeam) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <AdminPageHeader title={`Editar ${nationalTeam.name}`} />
      <div className="mt-6">
        <FormError message={typeof erro === "string" ? erro : undefined} />
        <NationalTeamForm
          action={updateNationalTeam.bind(null, id)}
          nationalTeam={nationalTeam}
          countries={countries}
          submitLabel="Salvar alterações"
        />
      </div>
    </div>
  );
}
