import type { Country, Manufacturer } from "@/generated/prisma/client";

export function ManufacturerForm({
  action,
  manufacturer,
  countries,
  submitLabel = "Salvar",
}: {
  action: (formData: FormData) => void;
  manufacturer?: Manufacturer;
  countries: Country[];
  submitLabel?: string;
}) {
  return (
    <form action={action} className="flex max-w-lg flex-col gap-4">
      <label className="field-label">
        Nome
        <input type="text" name="name" defaultValue={manufacturer?.name} required className="field-input" />
      </label>

      <label className="field-label">
        País de origem (opcional)
        <select name="countryId" defaultValue={manufacturer?.countryId ?? ""} className="field-select">
          <option value="">—</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
      </label>

      <label className="field-label">
        URL do logo (opcional)
        <input type="url" name="logoUrl" defaultValue={manufacturer?.logoUrl ?? ""} className="field-input" />
      </label>

      <button type="submit" className="btn-primary mt-2 self-start">
        {submitLabel}
      </button>
    </form>
  );
}
