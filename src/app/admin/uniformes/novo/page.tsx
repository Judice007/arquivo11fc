import type { Metadata } from "next";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { FormError } from "@/components/admin/form-error";
import { KitForm } from "@/components/admin/kit-form";
import { createKit } from "@/lib/actions/kits";
import { getClubs } from "@/lib/data/clubs";
import { getCompetitions } from "@/lib/data/competitions";
import { getManufacturers } from "@/lib/data/manufacturers";
import { getNationalTeams } from "@/lib/data/national-teams";
import { getSponsors } from "@/lib/data/sponsors";

export const metadata: Metadata = { title: "Adicionar uniforme" };

export default async function NewKitPage({
  searchParams,
}: PageProps<"/admin/uniformes/novo">) {
  const { erro } = await searchParams;

  const [clubs, nationalTeams, manufacturers, sponsors, competitions] = await Promise.all([
    getClubs(),
    getNationalTeams(),
    getManufacturers(),
    getSponsors(),
    getCompetitions(),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <AdminPageHeader title="Adicionar uniforme" />
      <div className="mt-6">
        <FormError message={typeof erro === "string" ? erro : undefined} />
        <KitForm
          action={createKit}
          clubs={clubs}
          nationalTeams={nationalTeams}
          manufacturers={manufacturers}
          sponsors={sponsors}
          competitions={competitions}
          submitLabel="Adicionar uniforme"
        />
      </div>
    </div>
  );
}
