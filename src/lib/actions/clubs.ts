"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { formErrorMessage } from "@/lib/actions/errors";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { ensureUniqueSlug } from "@/lib/unique-slug";
import { parseClubForm } from "@/lib/validations/club";

export async function createClub(formData: FormData) {
  let data;
  try {
    data = parseClubForm(formData);
  } catch (error) {
    redirect(`/admin/clubes/novo?erro=${encodeURIComponent(formErrorMessage(error))}`);
  }

  const slug = await ensureUniqueSlug(slugify(data.name), (candidate) =>
    prisma.club.findUnique({ where: { slug: candidate } }).then(Boolean),
  );

  await prisma.club.create({
    data: {
      name: data.name,
      fullName: data.fullName,
      countryId: data.countryId,
      city: data.city || null,
      foundedYear: data.foundedYear === "" || data.foundedYear === undefined ? null : data.foundedYear,
      crestUrl: data.crestUrl || null,
      slug,
    },
  });

  revalidatePath("/clubes");
  revalidatePath("/admin/clubes");
  redirect("/admin/clubes");
}

export async function updateClub(clubId: string, formData: FormData) {
  let data;
  try {
    data = parseClubForm(formData);
  } catch (error) {
    redirect(`/admin/clubes/${clubId}/editar?erro=${encodeURIComponent(formErrorMessage(error))}`);
  }

  const club = await prisma.club.update({
    where: { id: clubId },
    data: {
      name: data.name,
      fullName: data.fullName,
      countryId: data.countryId,
      city: data.city || null,
      foundedYear: data.foundedYear === "" || data.foundedYear === undefined ? null : data.foundedYear,
      crestUrl: data.crestUrl || null,
    },
  });

  revalidatePath("/clubes");
  revalidatePath(`/clubes/${club.slug}`);
  revalidatePath("/admin/clubes");
  redirect("/admin/clubes");
}

export async function deleteClub(clubId: string) {
  await prisma.club.delete({ where: { id: clubId } });
  revalidatePath("/clubes");
  revalidatePath("/admin/clubes");
  redirect("/admin/clubes");
}
