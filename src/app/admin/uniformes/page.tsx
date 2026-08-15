import type { Metadata } from "next";
import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { EmptyState } from "@/components/empty-state";
import { deleteKit } from "@/lib/actions/kits";
import { getKitsForAdmin } from "@/lib/data/kits";
import { kitTypeLabel } from "@/lib/kit-types";
import { formatSeason } from "@/lib/season";

export const metadata: Metadata = { title: "Uniformes" };

export default async function AdminKitsPage() {
  const kits = await getKitsForAdmin();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <AdminPageHeader
        title="Uniformes"
        description={`${kits.length} cadastrados (exibindo os mais recentes primeiro).`}
        addHref="/admin/uniformes/novo"
      />

      {kits.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="Nenhum uniforme cadastrado ainda" />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-md border border-line bg-paper-raised">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-faint">
              <tr>
                <th className="px-4 py-3">Clube/Seleção</th>
                <th className="px-4 py-3">Temporada</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Fabricante</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {kits.map((kit) => (
                <tr key={kit.id}>
                  <td className="px-4 py-3 font-medium text-ink">{kit.club?.name ?? kit.nationalTeam?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-muted">{formatSeason(kit.seasonStart, kit.seasonEnd)}</td>
                  <td className="px-4 py-3 text-ink-muted">{kitTypeLabel(kit.type)}</td>
                  <td className="px-4 py-3 text-ink-muted">{kit.manufacturer?.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-4">
                      <Link href={`/admin/uniformes/${kit.id}/editar`} className="text-sm font-medium text-accent hover:underline">
                        Editar
                      </Link>
                      <DeleteButton action={deleteKit.bind(null, kit.id)} />
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
