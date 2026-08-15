import type { Metadata } from "next";
import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { EmptyState } from "@/components/empty-state";
import { deleteClub } from "@/lib/actions/clubs";
import { getClubs } from "@/lib/data/clubs";

export const metadata: Metadata = { title: "Clubes" };

export default async function AdminClubsPage() {
  const clubs = await getClubs();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <AdminPageHeader title="Clubes" addHref="/admin/clubes/novo" />

      {clubs.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="Nenhum clube cadastrado ainda" />
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
              {clubs.map((club) => (
                <tr key={club.id}>
                  <td className="px-4 py-3 font-medium text-ink">{club.name}</td>
                  <td className="px-4 py-3 text-ink-muted">{club.country.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-4">
                      <Link href={`/admin/clubes/${club.id}/editar`} className="text-sm font-medium text-accent hover:underline">
                        Editar
                      </Link>
                      <DeleteButton
                        action={deleteClub.bind(null, club.id)}
                        confirmMessage={`Excluir ${club.name}? Todos os uniformes cadastrados para este clube serão excluídos junto.`}
                      />
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
