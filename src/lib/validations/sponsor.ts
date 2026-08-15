import { z } from "zod";

const optionalUrl = z.union([z.literal(""), z.string().trim().url("URL inválida.")]).optional();

export const sponsorSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome do patrocinador."),
  logoUrl: optionalUrl,
});

export type SponsorInput = z.infer<typeof sponsorSchema>;

export function parseSponsorForm(formData: FormData) {
  return sponsorSchema.parse({
    name: formData.get("name"),
    logoUrl: formData.get("logoUrl") || undefined,
  });
}
