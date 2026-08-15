import type { Country } from "@/generated/prisma/client";
import { CONTINENTS } from "@/lib/continents";

export function CountryForm({
  action,
  country,
  submitLabel = "Salvar",
}: {
  action: (formData: FormData) => void;
  country?: Country;
  submitLabel?: string;
}) {
  return (
    <form action={action} className="flex max-w-lg flex-col gap-4">
      <label className="field-label">
        Nome
        <input type="text" name="name" defaultValue={country?.name} required className="field-input" />
      </label>

      <label className="field-label">
        Continente
        <select name="continent" defaultValue={country?.continent ?? ""} required className="field-select">
          <option value="" disabled>
            Selecione
          </option>
          {CONTINENTS.map((continent) => (
            <option key={continent} value={continent}>
              {continent}
            </option>
          ))}
        </select>
      </label>

      <label className="field-label">
        URL da bandeira (opcional)
        <input type="url" name="flagUrl" defaultValue={country?.flagUrl ?? ""} className="field-input" />
      </label>

      <button type="submit" className="btn-primary mt-2 self-start">
        {submitLabel}
      </button>
    </form>
  );
}
