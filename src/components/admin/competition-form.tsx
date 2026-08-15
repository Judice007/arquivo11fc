import type { Competition, Country } from "@/generated/prisma/client";

export function CompetitionForm({
  action,
  competition,
  countries,
  submitLabel = "Salvar",
}: {
  action: (formData: FormData) => void;
  competition?: Competition;
  countries: Country[];
  submitLabel?: string;
}) {
  return (
    <form action={action} className="flex max-w-lg flex-col gap-4">
      <label className="field-label">
        Nome
        <input type="text" name="name" defaultValue={competition?.name} required className="field-input" />
      </label>

      <label className="field-label">
        País (opcional — deixe em branco para competições internacionais)
        <select name="countryId" defaultValue={competition?.countryId ?? ""} className="field-select">
          <option value="">—</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
      </label>

      <button type="submit" className="btn-primary mt-2 self-start">
        {submitLabel}
      </button>
    </form>
  );
}
