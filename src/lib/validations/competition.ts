import { z } from "zod";

export const competitionSchema = z.object({
  name: z.string().trim().min(1, "Informe o nome da competição."),
  countryId: z.string().trim().optional(),
});

export type CompetitionInput = z.infer<typeof competitionSchema>;

export function parseCompetitionForm(formData: FormData) {
  return competitionSchema.parse({
    name: formData.get("name"),
    countryId: formData.get("countryId") || undefined,
  });
}
