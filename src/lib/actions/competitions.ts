"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { formErrorMessage } from "@/lib/actions/errors";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { ensureUniqueSlug } from "@/lib/unique-slug";
import { parseCompetitionForm } from "@/lib/validations/competition";

export async function createCompetition(formData: FormData) {
  let data;
  try {
    data = parseCompetitionForm(formData);
  } catch (error) {
    redirect(`/admin/competicoes/novo?erro=${encodeURIComponent(formErrorMessage(error))}`);
  }

  const slug = await ensureUniqueSlug(slugify(data.name), (candidate) =>
    prisma.competition.findUnique({ where: { slug: candidate } }).then(Boolean),
  );

  await prisma.competition.create({ data: { name: data.name, countryId: data.countryId || null, slug } });

  revalidatePath("/admin/competicoes");
  redirect("/admin/competicoes");
}

export async function updateCompetition(competitionId: string, formData: FormData) {
  let data;
  try {
    data = parseCompetitionForm(formData);
  } catch (error) {
    redirect(`/admin/competicoes/${competitionId}/editar?erro=${encodeURIComponent(formErrorMessage(error))}`);
  }

  await prisma.competition.update({
    where: { id: competitionId },
    data: { name: data.name, countryId: data.countryId || null },
  });

  revalidatePath("/admin/competicoes");
  redirect("/admin/competicoes");
}
