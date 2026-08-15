import type { KitStatus } from "@/generated/prisma/client";

// Literais puros — ver comentário em src/lib/image-source-type.ts sobre por que não
// importar o enum do client gerado como valor aqui (quebra bundles de Client Components).
export const KIT_STATUSES = ["DRAFT", "PUBLISHED"] as const satisfies readonly KitStatus[];

export const KIT_STATUS_LABELS_PT: Record<KitStatus, string> = {
  DRAFT: "Rascunho",
  PUBLISHED: "Publicado",
};

export function isKitStatus(value: string): value is KitStatus {
  return (KIT_STATUSES as readonly string[]).includes(value);
}
