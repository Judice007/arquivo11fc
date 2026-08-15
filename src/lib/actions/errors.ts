import { z } from "zod";

/** Turns a caught validation/Prisma error into a short message safe to show an admin. */
export function formErrorMessage(error: unknown): string {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message ?? "Dados inválidos.";
  }
  if (error instanceof Error) return error.message;
  return "Erro inesperado ao salvar.";
}
