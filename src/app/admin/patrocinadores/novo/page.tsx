import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { FormError } from "@/components/admin/form-error";
import { SponsorForm } from "@/components/admin/sponsor-form";
import { createSponsor } from "@/lib/actions/sponsors";

export const metadata: Metadata = { title: "Adicionar patrocinador" };

export default async function NewSponsorPage({
  searchParams,
}: PageProps<"/admin/patrocinadores/novo">) {
  const { erro } = await searchParams;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <AdminPageHeader title="Adicionar patrocinador" />
      <div className="mt-6">
        <FormError message={typeof erro === "string" ? erro : undefined} />
        <SponsorForm action={createSponsor} submitLabel="Adicionar patrocinador" />
      </div>
    </div>
  );
}
