import { ImageSourceType } from "@/generated/prisma/client";

export const IMAGE_SOURCE_TYPES = [
  ImageSourceType.ARCHIVE_PHOTO,
  ImageSourceType.OFFICIAL_REFERENCE,
  ImageSourceType.DIGITAL_RECREATION,
] as const;

export const IMAGE_SOURCE_TYPE_LABELS_PT: Record<ImageSourceType, string> = {
  ARCHIVE_PHOTO: "Fotografia de acervo (autorizada)",
  OFFICIAL_REFERENCE: "Referência oficial de terceiros",
  DIGITAL_RECREATION: "Recriação digital do Arquivo 11",
};

/** Discreet public-facing note shown when the acervo image is a digital recreation. */
export const DIGITAL_RECREATION_NOTE = "Recriação digital para o Arquivo 11.";
