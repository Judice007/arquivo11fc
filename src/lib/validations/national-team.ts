import { z } from "zod";

const optionalUrl = z.union([z.literal(""), z.string().trim().url("URL inválida.")]).optional();

export const nationalTeamSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome da seleção."),
  countryId: z.string().trim().min(1, "Selecione um país."),
  crestUrl: optionalUrl,
});

export type NationalTeamInput = z.infer<typeof nationalTeamSchema>;

export function parseNationalTeamForm(formData: FormData) {
  return nationalTeamSchema.parse({
    name: formData.get("name"),
    countryId: formData.get("countryId"),
    crestUrl: formData.get("crestUrl") || undefined,
  });
}
