import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { FormError } from "@/components/admin/form-error";
import { KitForm } from "@/components/admin/kit-form";
import { updateKit } from "@/lib/actions/kits";
import { getClubs } from "@/lib/data/clubs";
import { getCompetitions } from "@/lib/data/competitions";
import { getKitById } from "@/lib/data/kits";
import { getManufacturers } from "@/lib/data/manufacturers";
import { getNationalTeams } from "@/lib/data/national-teams";
import { getSponsors } from "@/lib/data/sponsors";

export const metadata: Metadata = { title: "Editar uniforme" };

export default async function EditKitPage({
  params,
  searchParams,
}: PageProps<"/admin/uniformes/[id]/editar">) {
  const { id } = await params;
  const { erro } = await searchParams;

  const [kit, clubs, nationalTeams, manufacturers, sponsors, competitions] = await Promise.all([
    getKitById(id),
    getClubs(),
    getNationalTeams(),
    getManufacturers(),
    getSponsors(),
    getCompetitions(),
  ]);
  if (!kit) notFound();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <AdminPageHeader title="Editar uniforme" />
      <div className="mt-6">
        <FormError message={typeof erro === "string" ? erro : undefined} />
        <KitForm
          action={updateKit.bind(null, id)}
          kit={kit}
          clubs={clubs}
          nationalTeams={nationalTeams}
          manufacturers={manufacturers}
          sponsors={sponsors}
          competitions={competitions}
          submitLabel="Salvar alterações"
        />
      </div>
    </div>
  );
}
