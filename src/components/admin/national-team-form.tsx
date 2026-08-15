import type { Country, NationalTeam } from "@/generated/prisma/client";

export function NationalTeamForm({
  action,
  nationalTeam,
  countries,
  submitLabel = "Salvar",
}: {
  action: (formData: FormData) => void;
  nationalTeam?: NationalTeam;
  countries: Country[];
  submitLabel?: string;
}) {
  return (
    <form action={action} className="flex max-w-lg flex-col gap-4">
      <label className="field-label">
        Nome
        <input type="text" name="name" defaultValue={nationalTeam?.name} required className="field-input" />
      </label>

      <label className="field-label">
        País
        <select name="countryId" defaultValue={nationalTeam?.countryId ?? ""} required className="field-select">
          <option value="" disabled>
            Selecione
          </option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
      </label>

      <label className="field-label">
        URL do escudo (opcional)
        <input type="url" name="crestUrl" defaultValue={nationalTeam?.crestUrl ?? ""} className="field-input" />
      </label>

      <button type="submit" className="btn-primary mt-2 self-start">
        {submitLabel}
      </button>
    </form>
  );
}
