"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { formErrorMessage } from "@/lib/actions/errors";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { ensureUniqueSlug } from "@/lib/unique-slug";
import { parseNationalTeamForm } from "@/lib/validations/national-team";

export async function createNationalTeam(formData: FormData) {
  let data;
  try {
    data = parseNationalTeamForm(formData);
  } catch (error) {
    redirect(`/admin/selecoes/novo?erro=${encodeURIComponent(formErrorMessage(error))}`);
  }

  const slug = await ensureUniqueSlug(slugify(data.name), (candidate) =>
    prisma.nationalTeam.findUnique({ where: { slug: candidate } }).then(Boolean),
  );

  await prisma.nationalTeam.create({
    data: { name: data.name, countryId: data.countryId, crestUrl: data.crestUrl || null, slug },
  });

  revalidatePath("/selecoes");
  revalidatePath("/admin/selecoes");
  redirect("/admin/selecoes");
}

export async function updateNationalTeam(nationalTeamId: string, formData: FormData) {
  let data;
  try {
    data = parseNationalTeamForm(formData);
  } catch (error) {
    redirect(`/admin/selecoes/${nationalTeamId}/editar?erro=${encodeURIComponent(formErrorMessage(error))}`);
  }

  const team = await prisma.nationalTeam.update({
    where: { id: nationalTeamId },
    data: { name: data.name, countryId: data.countryId, crestUrl: data.crestUrl || null },
  });

  revalidatePath("/selecoes");
  revalidatePath(`/selecoes/${team.slug}`);
  revalidatePath("/admin/selecoes");
  redirect("/admin/selecoes");
}

export async function deleteNationalTeam(nationalTeamId: string) {
  await prisma.nationalTeam.delete({ where: { id: nationalTeamId } });
  revalidatePath("/selecoes");
  revalidatePath("/admin/selecoes");
  redirect("/admin/selecoes");
}
