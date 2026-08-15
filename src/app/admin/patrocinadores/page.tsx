import type { Metadata } from "next";
import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { EmptyState } from "@/components/empty-state";
import { deleteSponsor } from "@/lib/actions/sponsors";
import { getSponsors } from "@/lib/data/sponsors";

export const metadata: Metadata = { title: "Patrocinadores" };

export default async function AdminSponsorsPage() {
  const sponsors = await getSponsors();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <AdminPageHeader title="Patrocinadores" addHref="/admin/patrocinadores/novo" />

      {sponsors.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="Nenhum patrocinador cadastrado ainda" />
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
              {sponsors.map((sponsor) => (
                <tr key={sponsor.id}>
                  <td className="px-4 py-3 font-medium text-ink">{sponsor.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-4">
                      <Link
                        href={`/admin/patrocinadores/${sponsor.id}/editar`}
                        className="text-sm font-medium text-accent hover:underline"
                      >
                        Editar
                      </Link>
                      <DeleteButton action={deleteSponsor.bind(null, sponsor.id)} />
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
