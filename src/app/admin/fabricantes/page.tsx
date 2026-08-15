import type { Metadata } from "next";
import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { EmptyState } from "@/components/empty-state";
import { deleteManufacturer } from "@/lib/actions/manufacturers";
import { getManufacturers } from "@/lib/data/manufacturers";

export const metadata: Metadata = { title: "Fabricantes" };

export default async function AdminManufacturersPage() {
  const manufacturers = await getManufacturers();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <AdminPageHeader title="Fabricantes" addHref="/admin/fabricantes/novo" />

      {manufacturers.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="Nenhum fabricante cadastrado ainda" />
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
              {manufacturers.map((manufacturer) => (
                <tr key={manufacturer.id}>
                  <td className="px-4 py-3 font-medium text-ink">{manufacturer.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-4">
                      <Link
                        href={`/admin/fabricantes/${manufacturer.id}/editar`}
                        className="text-sm font-medium text-accent hover:underline"
                      >
                        Editar
                      </Link>
                      <DeleteButton action={deleteManufacturer.bind(null, manufacturer.id)} />
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
