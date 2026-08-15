import type { Sponsor } from "@/generated/prisma/client";

export function SponsorForm({
  action,
  sponsor,
  submitLabel = "Salvar",
}: {
  action: (formData: FormData) => void;
  sponsor?: Sponsor;
  submitLabel?: string;
}) {
  return (
    <form action={action} className="flex max-w-lg flex-col gap-4">
      <label className="field-label">
        Nome
        <input type="text" name="name" defaultValue={sponsor?.name} required className="field-input" />
      </label>

      <label className="field-label">
        URL do logo (opcional)
        <input type="url" name="logoUrl" defaultValue={sponsor?.logoUrl ?? ""} className="field-input" />
      </label>

      <button type="submit" className="btn-primary mt-2 self-start">
        {submitLabel}
      </button>
    </form>
  );
}
