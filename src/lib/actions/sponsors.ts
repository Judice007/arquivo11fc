"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { formErrorMessage } from "@/lib/actions/errors";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { ensureUniqueSlug } from "@/lib/unique-slug";
import { parseSponsorForm } from "@/lib/validations/sponsor";

export async function createSponsor(formData: FormData) {
  let data;
  try {
    data = parseSponsorForm(formData);
  } catch (error) {
    redirect(`/admin/patrocinadores/novo?erro=${encodeURIComponent(formErrorMessage(error))}`);
  }

  const slug = await ensureUniqueSlug(slugify(data.name), (candidate) =>
    prisma.sponsor.findUnique({ where: { slug: candidate } }).then(Boolean),
  );

  await prisma.sponsor.create({ data: { name: data.name, logoUrl: data.logoUrl || null, slug } });

  revalidatePath("/admin/patrocinadores");
  redirect("/admin/patrocinadores");
}

export async function updateSponsor(sponsorId: string, formData: FormData) {
  let data;
  try {
    data = parseSponsorForm(formData);
  } catch (error) {
    redirect(`/admin/patrocinadores/${sponsorId}/editar?erro=${encodeURIComponent(formErrorMessage(error))}`);
  }

  await prisma.sponsor.update({
    where: { id: sponsorId },
    data: { name: data.name, logoUrl: data.logoUrl || null },
  });

  revalidatePath("/admin/patrocinadores");
  redirect("/admin/patrocinadores");
}

export async function deleteSponsor(sponsorId: string) {
  await prisma.sponsor.delete({ where: { id: sponsorId } });
  revalidatePath("/admin/patrocinadores");
  redirect("/admin/patrocinadores");
}
