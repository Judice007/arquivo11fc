import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { FormError } from "@/components/admin/form-error";
import { SponsorForm } from "@/components/admin/sponsor-form";
import { updateSponsor } from "@/lib/actions/sponsors";
import { prisma } from "@/lib/db";

export const metadata: Metadata = { title: "Editar patrocinador" };

export default async function EditSponsorPage({
  params,
  searchParams,
}: PageProps<"/admin/patrocinadores/[id]/editar">) {
  const { id } = await params;
  const { erro } = await searchParams;

  const sponsor = await prisma.sponsor.findUnique({ where: { id } });
  if (!sponsor) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <AdminPageHeader title={`Editar ${sponsor.name}`} />
      <div className="mt-6">
        <FormError message={typeof erro === "string" ? erro : undefined} />
        <SponsorForm action={updateSponsor.bind(null, id)} sponsor={sponsor} submitLabel="Salvar alterações" />
      </div>
    </div>
  );
}
