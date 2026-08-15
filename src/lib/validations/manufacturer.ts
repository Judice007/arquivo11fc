import { z } from "zod";

const optionalUrl = z.union([z.literal(""), z.string().trim().url("URL inválida.")]).optional();

export const manufacturerSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do fabricante."),
  countryId: z.string().trim().optional(),
  logoUrl: optionalUrl,
});

export type ManufacturerInput = z.infer<typeof manufacturerSchema>;

export function parseManufacturerForm(formData: FormData) {
  return manufacturerSchema.parse({
    name: formData.get("name"),
    countryId: formData.get("countryId") || undefined,
    logoUrl: formData.get("logoUrl") || undefined,
  });
}
