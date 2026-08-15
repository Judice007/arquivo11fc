import type { Metadata } from "next";
import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { EmptyState } from "@/components/empty-state";
import { getCompetitions } from "@/lib/data/competitions";

export const metadata: Metadata = { title: "Competições" };

export default async function AdminCompetitionsPage() {
  const competitions = await getCompetitions();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <AdminPageHeader title="Competições" addHref="/admin/competicoes/novo" />

      {competitions.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="Nenhuma competição cadastrada ainda" />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-md border border-line bg-paper-raised">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-faint">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {competitions.map((competition) => (
                <tr key={competition.id}>
                  <td className="px-4 py-3 font-medium text-ink">{competition.name}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/competicoes/${competition.id}/editar`}
                      className="text-sm font-medium text-accent hover:underline"
                    >
                      Editar
                    </Link>
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
