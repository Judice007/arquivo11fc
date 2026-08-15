import { z } from "zod";

import type { ImageSourceType } from "@/generated/prisma/client";
import { IMAGE_SOURCE_TYPES } from "@/lib/image-source-type";
import { KIT_IMAGE_TYPES, KIT_TYPES } from "@/lib/kit-types";
import { KIT_STATUSES } from "@/lib/kit-status";
import { parseSeasonLabel } from "@/lib/season";

const optionalUrl = z.union([z.literal(""), z.string().trim().url("URL inválida.")]).optional();
const optionalId = z.string().trim().optional();
const imageSourceType = z.enum(IMAGE_SOURCE_TYPES);

// O formulário usa um único <select> com optgroups "Clubes"/"Seleções" (sem JS para
// alternar dois campos) e valores no formato "club:<id>" / "nationalTeam:<id>";
// esse regex garante que o valor bruto tem essa forma antes de dividir em ownerType/ownerId.
const OWNER_PATTERN = /^(club|nationalTeam):(.+)$/;

export const kitSchema = z
  .object({
    owner: z.string().trim().regex(OWNER_PATTERN, "Selecione o clube ou a seleção."),
    seasonLabel: z.string().trim().min(4, 'Informe a temporada (ex: "2025" ou "2025/26").'),
    type: z.enum(KIT_TYPES, { message: "Selecione um tipo de uniforme válido." }),
    status: z.enum(KIT_STATUSES).default("PUBLISHED"),
    manufacturerId: optionalId,
    mainSponsorId: optionalId,
    primaryColor: z.string().trim().optional(),
    secondaryColor: z.string().trim().optional(),
    description: z.string().trim().optional(),
    // Imagens do acervo — só arquivos padronizados fornecidos pelo admin. O tipo de
    // origem classifica proveniência (foto de acervo, referência oficial ou recriação
    // digital) — nunca é preenchido automaticamente a partir de uma fonte externa.
    mainImageUrl: optionalUrl,
    mainImageSourceType: imageSourceType.default("DIGITAL_RECREATION"),
    backImageUrl: optionalUrl,
    backImageSourceType: imageSourceType.default("DIGITAL_RECREATION"),
    // Fontes e referências — documental, nunca vira imagem do acervo automaticamente.
    sourceUrl: optionalUrl,
    sourceOwner: z.string().trim().optional(),
    photographer: z.string().trim().optional(),
    imageCredit: z.string().trim().optional(),
    imageLicense: z.string().trim().optional(),
    competitionIds: z.array(z.string()).default([]),
  })
  .refine((data) => parseSeasonLabelSafe(data.seasonLabel) !== null, {
    message: 'Temporada inválida. Use "2025" ou "2025/26".',
    path: ["seasonLabel"],
  })
  .refine((data) => data.status !== "PUBLISHED" || Boolean(data.mainImageUrl), {
    message: "Uniformes publicados precisam de uma imagem principal. Salve como rascunho ou preencha a frente padronizada.",
    path: ["mainImageUrl"],
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
    status: formData.get("status") || undefined,
    manufacturerId: formData.get("manufacturerId") || undefined,
    mainSponsorId: formData.get("mainSponsorId") || undefined,
    primaryColor: formData.get("primaryColor") || undefined,
    secondaryColor: formData.get("secondaryColor") || undefined,
    description: formData.get("description") || undefined,
    mainImageUrl: formData.get("mainImageUrl") || undefined,
    mainImageSourceType: formData.get("mainImageSourceType") || undefined,
    backImageUrl: formData.get("backImageUrl") || undefined,
    backImageSourceType: formData.get("backImageSourceType") || undefined,
    sourceUrl: formData.get("sourceUrl") || undefined,
    sourceOwner: formData.get("sourceOwner") || undefined,
    photographer: formData.get("photographer") || undefined,
    imageCredit: formData.get("imageCredit") || undefined,
    imageLicense: formData.get("imageLicense") || undefined,
    competitionIds: formData.getAll("competitionIds").map(String),
  });

  const ownerMatch = OWNER_PATTERN.exec(parsed.owner);
  if (!ownerMatch) throw new Error("Selecione o clube ou a seleção.");
  const [, ownerType, ownerId] = ownerMatch as unknown as [string, "club" | "nationalTeam", string];

  const { seasonStart, seasonEnd } = parseSeasonLabel(parsed.seasonLabel);
  const images = parseGalleryFields(formData);

  return { ...parsed, ownerType, ownerId, seasonStart, seasonEnd, images };
}

export type ParsedGalleryImage = { type: string; sourceType: ImageSourceType; imageUrl: string; sortOrder: number };

/**
 * Reads the gallery editor's parallel array fields (galleryType[], gallerySourceType[],
 * galleryUrl[], gallerySortOrder[]) — one entry per row, same order — and zips them back
 * into image records. Rows with an empty URL or an unknown type are skipped.
 */
export function parseGalleryFields(formData: FormData): ParsedGalleryImage[] {
  const types = formData.getAll("galleryType").map(String);
  const sourceTypes = formData.getAll("gallerySourceType").map(String);
  const urls = formData.getAll("galleryUrl").map(String);
  const sortOrders = formData.getAll("gallerySortOrder").map(String);

  const rows: ParsedGalleryImage[] = [];
  for (let i = 0; i < urls.length; i += 1) {
    const imageUrl = urls[i]?.trim();
    const type = types[i]?.trim().toUpperCase();
    const sourceType = sourceTypes[i]?.trim().toUpperCase();
    if (!imageUrl || !type || !(KIT_IMAGE_TYPES as readonly string[]).includes(type)) continue;
    const validSourceType = (IMAGE_SOURCE_TYPES as readonly string[]).includes(sourceType)
      ? (sourceType as ImageSourceType)
      : "DIGITAL_RECREATION";
    rows.push({
      type,
      sourceType: validSourceType,
      imageUrl,
      sortOrder: Number(sortOrders[i]) || i,
    });
  }
  return rows;
}
