import { z } from "zod";

import { CONTINENTS } from "@/lib/continents";

export const countrySchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do país."),
  continent: z.enum(CONTINENTS, { message: "Selecione um continente válido." }),
  flagUrl: z.union([z.literal(""), z.string().trim().url("URL da bandeira inválida.")]).optional(),
});

export type CountryInput = z.infer<typeof countrySchema>;

export function parseCountryForm(formData: FormData) {
  return countrySchema.parse({
    name: formData.get("name"),
    continent: formData.get("continent"),
    flagUrl: formData.get("flagUrl") || undefined,
  });
}
