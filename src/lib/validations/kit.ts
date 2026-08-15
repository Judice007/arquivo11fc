import { z } from "zod";

import { KIT_IMAGE_TYPES, KIT_TYPES } from "@/lib/kit-types";
import { parseSeasonLabel } from "@/lib/season";

const optionalUrl = z.union([z.literal(""), z.string().trim().url("URL inválida.")]).optional();
const optionalId = z.string().trim().optional();

// O formulário usa um único <select> com optgroups "Clubes"/"Seleções" (sem JS para
// alternar dois campos) e valores no formato "club:<id>" / "nationalTeam:<id>";
// esse regex garante que o valor bruto tem essa forma antes de dividir em ownerType/ownerId.
const OWNER_PATTERN = /^(club|nationalTeam):(.+)$/;

export const kitSchema = z
  .object({
    owner: z.string().trim().regex(OWNER_PATTERN, "Selecione o clube ou a seleção."),
    seasonLabel: z.string().trim().min(4, 'Informe a temporada (ex: "2025" ou "2025/26").'),
    type: z.enum(KIT_TYPES, { message: "Selecione um tipo de uniforme válido." }),
    manufacturerId: optionalId,
    mainSponsorId: optionalId,
    primaryColor: z.string().trim().optional(),
    secondaryColor: z.string().trim().optional(),
    description: z.string().trim().optional(),
    mainImageUrl: optionalUrl,
    sourceUrl: optionalUrl,
    photographer: z.string().trim().optional(),
    imageCredit: z.string().trim().optional(),
    imageLicense: z.string().trim().optional(),
    competitionIds: z.array(z.string()).default([]),
    // Uma imagem de galeria por linha, no formato "TIPO|URL" (ex: "FRENTE|https://...").
    galleryText: z.string().trim().optional(),
  })
  .refine((data) => parseSeasonLabelSafe(data.seasonLabel) !== null, {
    message: 'Temporada inválida. Use "2025" ou "2025/26".',
    path: ["seasonLabel"],
  });

export type KitInput = z.infer<typeof kitSchema>;

function parseSeasonLabelSafe(label: string) {
  try {
    return parseSeasonLabel(label);
  } catch {
    return null;
  }
}

export function parseKitForm(formData: FormData) {
  const parsed = kitSchema.parse({
    owner: formData.get("owner"),
    seasonLabel: formData.get("seasonLabel"),
    type: formData.get("type"),
    manufacturerId: formData.get("manufacturerId") || undefined,
    mainSponsorId: formData.get("mainSponsorId") || undefined,
    primaryColor: formData.get("primaryColor") || undefined,
    secondaryColor: formData.get("secondaryColor") || undefined,
    description: formData.get("description") || undefined,
    mainImageUrl: formData.get("mainImageUrl") || undefined,
    sourceUrl: formData.get("sourceUrl") || undefined,
    photographer: formData.get("photographer") || undefined,
    imageCredit: formData.get("imageCredit") || undefined,
    imageLicense: formData.get("imageLicense") || undefined,
    competitionIds: formData.getAll("competitionIds").map(String),
    galleryText: formData.get("galleryText") || undefined,
  });

  const ownerMatch = OWNER_PATTERN.exec(parsed.owner);
  if (!ownerMatch) throw new Error("Selecione o clube ou a seleção.");
  const [, ownerType, ownerId] = ownerMatch as unknown as [string, "club" | "nationalTeam", string];

  const { seasonStart, seasonEnd } = parseSeasonLabel(parsed.seasonLabel);
  const images = parseGalleryText(parsed.galleryText);

  return { ...parsed, ownerType, ownerId, seasonStart, seasonEnd, images };
}

export type ParsedGalleryImage = { type: string; imageUrl: string };

/** Parses the admin's "TIPO|URL" gallery textarea, skipping malformed or unknown-type lines. */
export function parseGalleryText(text: string | undefined): ParsedGalleryImage[] {
  if (!text) return [];

  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [rawType, ...rest] = line.split("|");
      const type = rawType?.trim().toUpperCase();
      const imageUrl = rest.join("|").trim();
      return { type, imageUrl };
    })
    .filter(
      (entry): entry is ParsedGalleryImage =>
        Boolean(entry.imageUrl) && (KIT_IMAGE_TYPES as readonly string[]).includes(entry.type ?? ""),
    );
}
