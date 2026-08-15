import type { Metadata } from "next";
import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { DuplicateButton } from "@/components/admin/duplicate-button";
import { EmptyState } from "@/components/empty-state";
import { deleteKit, duplicateKit } from "@/lib/actions/kits";
import { getClubs } from "@/lib/data/clubs";
import { getKitsForAdmin } from "@/lib/data/kits";
import { getNationalTeams } from "@/lib/data/national-teams";
import { KIT_STATUSES, KIT_STATUS_LABELS_PT } from "@/lib/kit-status";
import { KIT_TYPES, kitTypeLabel } from "@/lib/kit-types";
import { formatSeason } from "@/lib/season";

export const metadata: Metadata = { title: "Uniformes" };

function firstValue(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value || undefined;
}

export default async function AdminKitsPage({
  searchParams,
}: PageProps<"/admin/uniformes">) {
  const params = await searchParams;
  const owner = firstValue(params.owner);
  const type = firstValue(params.tipo);
  const status = firstValue(params.status);
  const seasonYearRaw = firstValue(params.temporada);
  const search = firstValue(params.busca);
  const seasonYear = seasonYearRaw ? Number(seasonYearRaw) : undefined;

  const [ownerType, ownerId] = owner?.includes(":") ? owner.split(":") : [undefined, undefined];

  const [kits, clubs, nationalTeams] = await Promise.all([
    getKitsForAdmin({
      ownerType: ownerType === "club" || ownerType === "nationalTeam" ? ownerType : undefined,
      ownerId,
      type,
      status,
      seasonYear: seasonYear && Number.isFinite(seasonYear) ? seasonYear : undefined,
      search,
    }),
    getClubs(),
    getNationalTeams(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6">
      <AdminPageHeader
        title="Uniformes"
        description={`${kits.length} encontrados (mais atualizados primeiro).`}
        addHref="/admin/uniformes/novo"
      />

      <form method="get" className="mt-6 flex flex-wrap items-end gap-3 rounded-md border border-line bg-paper-raised p-4">
        <Field label="Clube/seleção">
          <select name="owner" defaultValue={owner ?? ""} className="field-select">
            <option value="">Todos</option>
            <optgroup label="Clubes">
              {clubs.map((club) => (
                <option key={club.id} value={`club:${club.id}`}>
                  {club.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Seleções">
              {nationalTeams.map((team) => (
                <option key={team.id} value={`nationalTeam:${team.id}`}>
                  {team.name}
                </option>
              ))}
            </optgroup>
          </select>
        </Field>

        <Field label="Tipo">
          <select name="tipo" defaultValue={type ?? ""} className="field-select">
            <option value="">Todos</option>
            {KIT_TYPES.map((t) => (
              <option key={t} value={t}>
                {kitTypeLabel(t)}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Status">
          <select name="status" defaultValue={status ?? ""} className="field-select">
            <option value="">Todos</option>
            {KIT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {KIT_STATUS_LABELS_PT[s]}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Temporada (ano)">
          <input type="number" name="temporada" defaultValue={seasonYearRaw ?? ""} placeholder="2025" className="field-input" />
        </Field>

        <Field label="Busca (clube/slug)">
          <input type="text" name="busca" defaultValue={search ?? ""} placeholder="flamengo" className="field-input" />
        </Field>

        <button type="submit" className="btn-primary">
          Filtrar
        </button>
        {(owner || type || status || seasonYearRaw || search) && (
          <Link href="/admin/uniformes" className="btn-secondary">
            Limpar
          </Link>
        )}
      </form>

      {kits.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="Nenhum uniforme encontrado" description="Tente remover algum filtro." />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-md border border-line bg-paper-raised">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-ink-faint">
              <tr>
                <th className="px-4 py-3" />
                <th className="px-4 py-3">Clube/Seleção</th>
                <th className="px-4 py-3">Temporada</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Fabricante</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Atualizado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {kits.map((kit) => (
                <tr key={kit.id}>
                  <td className="px-4 py-2">
                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md border border-line bg-paper-muted">
                      {kit.mainImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={kit.mainImageUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <span className="text-[9px] text-ink-faint">Sem img.</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-ink">{kit.club?.name ?? kit.nationalTeam?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-muted">{formatSeason(kit.seasonStart, kit.seasonEnd)}</td>
                  <td className="px-4 py-3 text-ink-muted">{kitTypeLabel(kit.type)}</td>
                  <td className="px-4 py-3 text-ink-muted">{kit.manufacturer?.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        kit.status === "PUBLISHED" ? "bg-accent-soft text-accent" : "bg-paper-muted text-ink-muted"
                      }`}
                    >
                      {KIT_STATUS_LABELS_PT[kit.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-faint">
                    {new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(kit.updatedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <Link href={`/admin/uniformes/${kit.id}/editar`} className="text-sm font-medium text-accent hover:underline">
                        Editar
                      </Link>
                      <DuplicateButton action={duplicateKit.bind(null, kit.id)} />
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="field-label">
      {label}
      {children}
    </label>
  );
}
