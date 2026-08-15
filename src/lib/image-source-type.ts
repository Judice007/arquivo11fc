import type { ImageSourceType } from "@/generated/prisma/client";

// Literais puros (não importa o enum do client gerado como valor) para que arquivos
// que usam isto possam ser importados por Client Components sem arrastar o runtime
// do Prisma (que inclui `pg`/Node builtins) pro bundle do navegador — isso já quebrou
// o build do Turbopack uma vez (import type é apagado em build time, o valor não).
export const IMAGE_SOURCE_TYPES = ["ARCHIVE_PHOTO", "OFFICIAL_REFERENCE", "DIGITAL_RECREATION"] as const satisfies readonly ImageSourceType[];

export const IMAGE_SOURCE_TYPE_LABELS_PT: Record<ImageSourceType, string> = {
  ARCHIVE_PHOTO: "Fotografia de acervo (autorizada)",
  OFFICIAL_REFERENCE: "Referência oficial de terceiros",
  DIGITAL_RECREATION: "Recriação digital do Arquivo 11",
};

/** Discreet public-facing note shown when the acervo image is a digital recreation. */
export const DIGITAL_RECREATION_NOTE = "Recriação digital para o Arquivo 11.";
