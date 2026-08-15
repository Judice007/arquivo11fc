"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { formErrorMessage } from "@/lib/actions/errors";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { ensureUniqueSlug } from "@/lib/unique-slug";
import { parseManufacturerForm } from "@/lib/validations/manufacturer";

export async function createManufacturer(formData: FormData) {
  let data;
  try {
    data = parseManufacturerForm(formData);
  } catch (error) {
    redirect(`/admin/fabricantes/novo?erro=${encodeURIComponent(formErrorMessage(error))}`);
  }

  const slug = await ensureUniqueSlug(slugify(data.name), (candidate) =>
    prisma.manufacturer.findUnique({ where: { slug: candidate } }).then(Boolean),
  );

  await prisma.manufacturer.create({
    data: { name: data.name, countryId: data.countryId || null, logoUrl: data.logoUrl || null, slug },
  });

  revalidatePath("/marcas");
  revalidatePath("/admin/fabricantes");
  redirect("/admin/fabricantes");
}

export async function updateManufacturer(manufacturerId: string, formData: FormData) {
  let data;
  try {
    data = parseManufacturerForm(formData);
  } catch (error) {
    redirect(`/admin/fabricantes/${manufacturerId}/editar?erro=${encodeURIComponent(formErrorMessage(error))}`);
  }

  const manufacturer = await prisma.manufacturer.update({
    where: { id: manufacturerId },
    data: { name: data.name, countryId: data.countryId || null, logoUrl: data.logoUrl || null },
  });

  revalidatePath("/marcas");
  revalidatePath(`/marcas/${manufacturer.slug}`);
  revalidatePath("/admin/fabricantes");
  redirect("/admin/fabricantes");
}

export async function deleteManufacturer(manufacturerId: string) {
  await prisma.manufacturer.delete({ where: { id: manufacturerId } });
  revalidatePath("/marcas");
  revalidatePath("/admin/fabricantes");
  redirect("/admin/fabricantes");
}
