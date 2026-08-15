import type { Metadata } from "next";
import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { EmptyState } from "@/components/empty-state";
import { deleteNationalTeam } from "@/lib/actions/national-teams";
import { getNationalTeams } from "@/lib/data/national-teams";

export const metadata: Metadata = { title: "Seleções" };

export default async function AdminNationalTeamsPage() {
  const nationalTeams = await getNationalTeams();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <AdminPageHeader title="Seleções" addHref="/admin/selecoes/novo" />

      {nationalTeams.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="Nenhuma seleção cadastrada ainda" />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-md border border-line bg-paper-raised">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-faint">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">País</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {nationalTeams.map((team) => (
                <tr key={team.id}>
                  <td className="px-4 py-3 font-medium text-ink">{team.name}</td>
                  <td className="px-4 py-3 text-ink-muted">{team.country.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-4">
                      <Link href={`/admin/selecoes/${team.id}/editar`} className="text-sm font-medium text-accent hover:underline">
                        Editar
                      </Link>
                      <DeleteButton action={deleteNationalTeam.bind(null, team.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
