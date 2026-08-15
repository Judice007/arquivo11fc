import type { Metadata } from "next";
import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { EmptyState } from "@/components/empty-state";
import { getCountries } from "@/lib/data/countries";

export const metadata: Metadata = { title: "Países" };

export default async function AdminCountriesPage() {
  const countries = await getCountries();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
      <AdminPageHeader title="Países" addHref="/admin/paises/novo" />

      {countries.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="Nenhum país cadastrado ainda" />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-md border border-line bg-paper-raised">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-faint">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Continente</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {countries.map((country) => (
                <tr key={country.id}>
                  <td className="px-4 py-3 font-medium text-ink">{country.name}</td>
                  <td className="px-4 py-3 text-ink-muted">{country.continent}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/paises/${country.id}/editar`} className="text-sm font-medium text-accent hover:underline">
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
