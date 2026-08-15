import { z } from "zod";

const optionalUrl = z.union([z.literal(""), z.string().trim().url("URL inválida.")]).optional();

export const clubSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do clube."),
  fullName: z.string().trim().min(1, "Informe o nome completo do clube."),
  countryId: z.string().trim().min(1, "Selecione um país."),
  city: z.string().trim().optional(),
  foundedYear: z
    .union([z.literal(""), z.coerce.number().int().min(1850).max(2100)])
    .optional(),
  crestUrl: optionalUrl,
});

export type ClubInput = z.infer<typeof clubSchema>;

export function parseClubForm(formData: FormData) {
  return clubSchema.parse({
    name: formData.get("name"),
    fullName: formData.get("fullName"),
    countryId: formData.get("countryId"),
    city: formData.get("city") || undefined,
    foundedYear: formData.get("foundedYear") || undefined,
    crestUrl: formData.get("crestUrl") || undefined,
  });
}
