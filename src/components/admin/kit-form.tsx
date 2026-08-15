import type {
  Club,
  Competition,
  Kit,
  KitCompetition,
  KitImage,
  Manufacturer,
  NationalTeam,
  Sponsor,
} from "@/generated/prisma/client";
import { KIT_TYPES, kitTypeLabel } from "@/lib/kit-types";
import { formatSeason } from "@/lib/season";

export type KitWithRelations = Kit & {
  images: KitImage[];
  competitions: (KitCompetition & { competition: Competition })[];
};

export function KitForm({
  action,
  kit,
  clubs,
  nationalTeams,
  manufacturers,
  sponsors,
  competitions,
  submitLabel = "Salvar",
}: {
  action: (formData: FormData) => void;
  kit?: KitWithRelations;
  clubs: Club[];
  nationalTeams: NationalTeam[];
  manufacturers: Manufacturer[];
  sponsors: Sponsor[];
  competitions: Competition[];
  submitLabel?: string;
}) {
  const ownerValue = kit ? (kit.clubId ? `club:${kit.clubId}` : `nationalTeam:${kit.nationalTeamId}`) : "";
  const selectedCompetitionIds = new Set(kit?.competitions.map((c) => c.competitionId) ?? []);
  const galleryText = (kit?.images ?? []).map((image) => `${image.type}|${image.imageUrl}`).join("\n");

  return (
    <form action={action} className="flex max-w-2xl flex-col gap-6">
      <fieldset className="flex flex-col gap-4 rounded-md border border-line bg-paper-raised p-4">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Time e temporada
        </legend>

        <label className="field-label">
          Clube ou seleção
          <select name="owner" defaultValue={ownerValue} required className="field-select">
            <option value="" disabled>
              Selecione
            </option>
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
        </label>

        <label className="field-label">
          Temporada
          <input
            type="text"
            name="seasonLabel"
            defaultValue={kit ? formatSeason(kit.seasonStart, kit.seasonEnd) : ""}
            placeholder='"2025" ou "2025/26"'
            required
            className="field-input"
          />
        </label>

        <label className="field-label">
          Tipo
          <select name="type" defaultValue={kit?.type ?? ""} required className="field-select">
            <option value="" disabled>
              Selecione
            </option>
            {KIT_TYPES.map((type) => (
              <option key={type} value={type}>
                {kitTypeLabel(type)}
              </option>
            ))}
          </select>
        </label>
      </fieldset>

      <fieldset className="flex flex-col gap-4 rounded-md border border-line bg-paper-raised p-4">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Fabricante e patrocínio
        </legend>

        <label className="field-label">
          Fabricante (opcional)
          <select name="manufacturerId" defaultValue={kit?.manufacturerId ?? ""} className="field-select">
            <option value="">—</option>
            {manufacturers.map((manufacturer) => (
              <option key={manufacturer.id} value={manufacturer.id}>
                {manufacturer.name}
              </option>
            ))}
          </select>
        </label>

        <label className="field-label">
          Patrocinador principal (opcional)
          <select name="mainSponsorId" defaultValue={kit?.mainSponsorId ?? ""} className="field-select">
            <option value="">—</option>
            {sponsors.map((sponsor) => (
              <option key={sponsor.id} value={sponsor.id}>
                {sponsor.name}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-xs font-medium text-ink-muted">Competições (opcional)</legend>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {competitions.map((competition) => (
              <label key={competition.id} className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  name="competitionIds"
                  value={competition.id}
                  defaultChecked={selectedCompetitionIds.has(competition.id)}
                  className="h-4 w-4 rounded border-line-strong accent-accent"
                />
                {competition.name}
              </label>
            ))}
          </div>
        </fieldset>
      </fieldset>

      <fieldset className="flex flex-col gap-4 rounded-md border border-line bg-paper-raised p-4">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">Cores</legend>

        <div className="grid grid-cols-2 gap-4">
          <label className="field-label">
            Cor principal (opcional)
            <input
              type="text"
              name="primaryColor"
              defaultValue={kit?.primaryColor ?? ""}
              placeholder="#C8102E"
              className="field-input"
            />
          </label>
          <label className="field-label">
            Cor secundária (opcional)
            <input
              type="text"
              name="secondaryColor"
              defaultValue={kit?.secondaryColor ?? ""}
              placeholder="#000000"
              className="field-input"
            />
          </label>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4 rounded-md border border-line bg-paper-raised p-4">
        <legend className="px-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Imagens e créditos
        </legend>

        <label className="field-label">
          URL da imagem principal
          <input
            type="url"
            name="mainImageUrl"
            defaultValue={kit?.mainImageUrl ?? ""}
            className="field-input"
          />
        </label>

        <label className="field-label">
          Galeria (opcional) — uma imagem por linha, no formato TIPO|URL
          <textarea
            name="galleryText"
            defaultValue={galleryText}
            rows={4}
            placeholder={"FRENTE|https://...\nCOSTAS|https://..."}
            className="field-textarea font-mono text-xs"
          />
          <span className="font-normal normal-case text-ink-faint">
            Tipos aceitos: FRENTE, COSTAS, DETALHE, OUTRA.
          </span>
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="field-label">
            Fonte da imagem (URL, opcional)
            <input type="url" name="sourceUrl" defaultValue={kit?.sourceUrl ?? ""} className="field-input" />
          </label>
          <label className="field-label">
            Fotógrafo (opcional)
            <input type="text" name="photographer" defaultValue={kit?.photographer ?? ""} className="field-input" />
          </label>
          <label className="field-label">
            Crédito da imagem (opcional)
            <input type="text" name="imageCredit" defaultValue={kit?.imageCredit ?? ""} className="field-input" />
          </label>
          <label className="field-label">
            Licença (opcional)
            <input type="text" name="imageLicense" defaultValue={kit?.imageLicense ?? ""} className="field-input" />
          </label>
        </div>
      </fieldset>

      <label className="field-label">
        Descrição / história (opcional)
        <textarea name="description" defaultValue={kit?.description ?? ""} rows={4} className="field-textarea" />
      </label>

      <button type="submit" className="btn-primary self-start">
        {submitLabel}
      </button>
    </form>
  );
}
