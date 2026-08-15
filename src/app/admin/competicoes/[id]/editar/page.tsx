import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CompetitionForm } from "@/components/admin/competition-form";
import { FormError } from "@/components/admin/form-error";
import { updateCompetition } from "@/lib/actions/competitions";
import { getCountries } from "@/lib/data/countries";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Editar competição" };

export default async function EditCompetitionPage({
  params,
  searchParams,
}: PageProps<"/admin/competicoes/[id]/editar">) {
  const { id } = await params;
  const { erro } = await searchParams;

  const [competition, countries] = await Promise.all([
    prisma.competition.findUnique({ where: { id } }),
    getCountries(),
  ]);
  if (!competition) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <AdminPageHeader title={`Editar ${competition.name}`} />
      <div className="mt-6">
        <FormError message={typeof erro === "string" ? erro : undefined} />
        <CompetitionForm
          action={updateCompetition.bind(null, id)}
          competition={competition}
          countries={countries}
          submitLabel="Salvar alterações"
        />
      </div>
    </div>
  );
}
