"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { formErrorMessage } from "@/lib/actions/errors";
import { prisma } from "@/lib/db";
import { ensureUniqueSlug } from "@/lib/unique-slug";
import { parseCountryForm } from "@/lib/validations/country";
import { slugify } from "@/lib/slug";

export async function createCountry(formData: FormData) {
  let data;
  try {
    data = parseCountryForm(formData);
  } catch (error) {
    redirect(`/admin/paises/novo?erro=${encodeURIComponent(formErrorMessage(error))}`);
  }

  const slug = await ensureUniqueSlug(slugify(data.name), (candidate) =>
    prisma.country.findUnique({ where: { slug: candidate } }).then(Boolean),
  );

  await prisma.country.create({
    data: { name: data.name, continent: data.continent, flagUrl: data.flagUrl || null, slug },
  });

  revalidatePath("/admin/paises");
  redirect("/admin/paises");
}

export async function updateCountry(countryId: string, formData: FormData) {
  let data;
  try {
    data = parseCountryForm(formData);
  } catch (error) {
    redirect(`/admin/paises/${countryId}/editar?erro=${encodeURIComponent(formErrorMessage(error))}`);
  }

  await prisma.country.update({
    where: { id: countryId },
    data: { name: data.name, continent: data.continent, flagUrl: data.flagUrl || null },
  });

  revalidatePath("/admin/paises");
  revalidatePath("/clubes");
  redirect("/admin/paises");
}
