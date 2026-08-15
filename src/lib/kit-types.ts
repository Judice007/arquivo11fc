/**
 * Kit type codes stored in the database (Kit.type / KitImage sourcing). Modeled as a
 * TypeScript union + runtime array instead of a Prisma enum because the SQLite
 * connector used in development doesn't support native enums — see prisma/schema.prisma.
 */
export const KIT_TYPES = [
  "HOME",
  "AWAY",
  "THIRD",
  "GK",
  "FOURTH",
  "SPECIAL",
  "TRAINING",
] as const;

export type KitType = (typeof KIT_TYPES)[number];

export function isKitType(value: string): value is KitType {
  return (KIT_TYPES as readonly string[]).includes(value);
}

export const KIT_TYPE_LABELS_PT: Record<KitType, string> = {
  HOME: "Principal",
  AWAY: "Reserva",
  THIRD: "Terceiro",
  GK: "Goleiro",
  FOURTH: "Quarto uniforme",
  SPECIAL: "Especial",
  TRAINING: "Treino",
};

export function kitTypeLabel(type: string): string {
  return isKitType(type) ? KIT_TYPE_LABELS_PT[type] : type;
}

/** Image sub-types within a Kit's gallery. Free-form in the schema, fixed set in the UI. */
export const KIT_IMAGE_TYPES = ["FRENTE", "COSTAS", "DETALHE", "OUTRA"] as const;
export type KitImageType = (typeof KIT_IMAGE_TYPES)[number];

export const KIT_IMAGE_TYPE_LABELS_PT: Record<KitImageType, string> = {
  FRENTE: "Frente",
  COSTAS: "Costas",
  DETALHE: "Detalhe",
  OUTRA: "Outra",
};
