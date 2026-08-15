import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ClubForm } from "@/components/admin/club-form";
import { FormError } from "@/components/admin/form-error";
import { updateClub } from "@/lib/actions/clubs";
import { getCountries } from "@/lib/data/countries";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Editar clube" };

export default async function EditClubPage({
  params,
  searchParams,
}: PageProps<"/admin/clubes/[id]/editar">) {
  const { id } = await params;
  const { erro } = await searchParams;

  const [club, countries] = await Promise.all([
    prisma.club.findUnique({ where: { id } }),
    getCountries(),
  ]);
  if (!club) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <AdminPageHeader title={`Editar ${club.name}`} />
      <div className="mt-6">
        <FormError message={typeof erro === "string" ? erro : undefined} />
        <ClubForm action={updateClub.bind(null, id)} club={club} countries={countries} submitLabel="Salvar alterações" />
      </div>
    </div>
  );
}
