import type { Club, Country } from "@/generated/prisma/client";

export function ClubForm({
  action,
  club,
  countries,
  submitLabel = "Salvar",
}: {
  action: (formData: FormData) => void;
  club?: Club;
  countries: Country[];
  submitLabel?: string;
}) {
  return (
    <form action={action} className="flex max-w-lg flex-col gap-4">
      <label className="field-label">
        Nome
        <input type="text" name="name" defaultValue={club?.name} required className="field-input" />
      </label>

      <label className="field-label">
        Nome completo
        <input type="text" name="fullName" defaultValue={club?.fullName} required className="field-input" />
      </label>

      <label className="field-label">
        País
        <select name="countryId" defaultValue={club?.countryId ?? ""} required className="field-select">
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
        Cidade (opcional)
        <input type="text" name="city" defaultValue={club?.city ?? ""} className="field-input" />
      </label>

      <label className="field-label">
        Ano de fundação (opcional)
        <input
          type="number"
          name="foundedYear"
          defaultValue={club?.foundedYear ?? ""}
          min={1850}
          max={2100}
          className="field-input"
        />
      </label>

      <label className="field-label">
        URL do escudo (opcional)
        <input type="url" name="crestUrl" defaultValue={club?.crestUrl ?? ""} className="field-input" />
      </label>

      <button type="submit" className="btn-primary mt-2 self-start">
        {submitLabel}
      </button>
    </form>
  );
}
