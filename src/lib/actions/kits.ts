"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { formErrorMessage } from "@/lib/actions/errors";
import { prisma } from "@/lib/db";
import { getRandomKit } from "@/lib/data/kits";
import { buildKitSlug } from "@/lib/slug";
import { ensureUniqueSlug } from "@/lib/unique-slug";
import { parseKitForm } from "@/lib/validations/kit";

export async function goToRandomKit() {
  const kit = await getRandomKit();
  if (!kit) redirect("/");
  redirect(`/uniformes/${kit.slug}`);
}

async function resolveOwner(ownerType: "club" | "nationalTeam", ownerId: string) {
  if (ownerType === "club") {
    const club = await prisma.club.findUnique({ where: { id: ownerId } });
    if (!club) throw new Error("Clube selecionado não existe.");
    return { clubId: club.id, nationalTeamId: null, ownerSlug: club.slug, publicPath: `/clubes/${club.slug}` };
  }

  const nationalTeam = await prisma.nationalTeam.findUnique({ where: { id: ownerId } });
  if (!nationalTeam) throw new Error("Seleção selecionada não existe.");
  return {
    clubId: null,
    nationalTeamId: nationalTeam.id,
    ownerSlug: nationalTeam.slug,
    publicPath: `/selecoes/${nationalTeam.slug}`,
  };
}

export async function createKit(formData: FormData) {
  let data;
  try {
    data = parseKitForm(formData);
  } catch (error) {
    redirect(`/admin/uniformes/novo?erro=${encodeURIComponent(formErrorMessage(error))}`);
  }

  let owner;
  try {
    owner = await resolveOwner(data.ownerType, data.ownerId);
  } catch (error) {
    redirect(`/admin/uniformes/novo?erro=${encodeURIComponent(formErrorMessage(error))}`);
  }

  const baseSlug = buildKitSlug({
    ownerSlug: owner.ownerSlug,
    type: data.type,
    seasonStart: data.seasonStart,
    seasonEnd: data.seasonEnd,
  });
  const slug = await ensureUniqueSlug(baseSlug, (candidate) =>
    prisma.kit.findUnique({ where: { slug: candidate } }).then(Boolean),
  );

  await prisma.kit.create({
    data: {
      clubId: owner.clubId,
      nationalTeamId: owner.nationalTeamId,
      seasonStart: data.seasonStart,
      seasonEnd: data.seasonEnd,
      type: data.type,
      manufacturerId: data.manufacturerId || null,
      mainSponsorId: data.mainSponsorId || null,
      primaryColor: data.primaryColor || null,
      secondaryColor: data.secondaryColor || null,
      description: data.description || null,
      mainImageUrl: data.mainImageUrl || null,
      mainImageSourceType: data.mainImageSourceType,
      backImageUrl: data.backImageUrl || null,
      backImageSourceType: data.backImageSourceType,
      sourceUrl: data.sourceUrl || null,
      sourceOwner: data.sourceOwner || null,
      photographer: data.photographer || null,
      imageCredit: data.imageCredit || null,
      imageLicense: data.imageLicense || null,
      slug,
      status: data.status,
      competitions: { create: data.competitionIds.map((competitionId) => ({ competitionId })) },
      images: {
        create: data.images.map((image) => ({
          imageUrl: image.imageUrl,
          type: image.type,
          sourceType: image.sourceType,
          sortOrder: image.sortOrder,
        })),
      },
    },
  });

  revalidatePath(owner.publicPath);
  revalidatePath("/admin/uniformes");
  redirect("/admin/uniformes");
}

export async function updateKit(kitId: string, formData: FormData) {
  let data;
  try {
    data = parseKitForm(formData);
  } catch (error) {
    redirect(`/admin/uniformes/${kitId}/editar?erro=${encodeURIComponent(formErrorMessage(error))}`);
  }

  let owner;
  try {
    owner = await resolveOwner(data.ownerType, data.ownerId);
  } catch (error) {
    redirect(`/admin/uniformes/${kitId}/editar?erro=${encodeURIComponent(formErrorMessage(error))}`);
  }

  const existing = await prisma.kit.findUnique({ where: { id: kitId } });
  if (!existing) redirect("/admin/uniformes");

  await prisma.$transaction([
    prisma.kitImage.deleteMany({ where: { kitId } }),
    prisma.kitCompetition.deleteMany({ where: { kitId } }),
    prisma.kit.update({
      where: { id: kitId },
      data: {
        clubId: owner.clubId,
        nationalTeamId: owner.nationalTeamId,
        seasonStart: data.seasonStart,
        seasonEnd: data.seasonEnd,
        type: data.type,
        manufacturerId: data.manufacturerId || null,
        mainSponsorId: data.mainSponsorId || null,
        primaryColor: data.primaryColor || null,
        secondaryColor: data.secondaryColor || null,
        description: data.description || null,
        mainImageUrl: data.mainImageUrl || null,
        mainImageSourceType: data.mainImageSourceType,
        backImageUrl: data.backImageUrl || null,
        backImageSourceType: data.backImageSourceType,
        sourceUrl: data.sourceUrl || null,
        sourceOwner: data.sourceOwner || null,
        photographer: data.photographer || null,
        imageCredit: data.imageCredit || null,
        imageLicense: data.imageLicense || null,
        status: data.status,
        competitions: { create: data.competitionIds.map((competitionId) => ({ competitionId })) },
        images: {
          create: data.images.map((image) => ({
            imageUrl: image.imageUrl,
            type: image.type,
            sourceType: image.sourceType,
            sortOrder: image.sortOrder,
          })),
        },
      },
    }),
  ]);

  revalidatePath(owner.publicPath);
  if (existing.slug) revalidatePath(`/uniformes/${existing.slug}`);
  revalidatePath("/admin/uniformes");
  redirect("/admin/uniformes");
}

export async function deleteKit(kitId: string) {
  await prisma.kit.delete({ where: { id: kitId } });
  revalidatePath("/admin/uniformes");
  redirect("/admin/uniformes");
}

/**
 * Copies an existing kit into a new, unsaved-in-spirit DRAFT record — same club/season/
 * type/colors/manufacturer/sponsor/competitions/images, so the admin can tweak the parts
 * that differ (e.g. HOME -> AWAY, novas cores, nova imagem) instead of retyping everything.
 * Always lands as DRAFT regardless of the original's status, so it can never appear on the
 * public site until the admin reviews and explicitly publishes it.
 */
export async function duplicateKit(kitId: string) {
  const original = await prisma.kit.findUnique({
    where: { id: kitId },
    include: { images: true, competitions: true },
  });
  if (!original) redirect("/admin/uniformes");

  const baseSlug = `${original.slug}-copia`;
  const slug = await ensureUniqueSlug(baseSlug, (candidate) =>
    prisma.kit.findUnique({ where: { slug: candidate } }).then(Boolean),
  );

  const duplicate = await prisma.kit.create({
    data: {
      clubId: original.clubId,
      nationalTeamId: original.nationalTeamId,
      seasonStart: original.seasonStart,
      seasonEnd: original.seasonEnd,
      type: original.type,
      manufacturerId: original.manufacturerId,
      mainSponsorId: original.mainSponsorId,
      primaryColor: original.primaryColor,
      secondaryColor: original.secondaryColor,
      description: original.description,
      mainImageUrl: original.mainImageUrl,
      mainImageSourceType: original.mainImageSourceType,
      backImageUrl: original.backImageUrl,
      backImageSourceType: original.backImageSourceType,
      sourceUrl: original.sourceUrl,
      sourceOwner: original.sourceOwner,
      photographer: original.photographer,
      imageCredit: original.imageCredit,
      imageLicense: original.imageLicense,
      slug,
      status: "DRAFT",
      competitions: {
        create: original.competitions.map((c) => ({ competitionId: c.competitionId })),
      },
      images: {
        create: original.images.map((image) => ({
          imageUrl: image.imageUrl,
          type: image.type,
          sourceType: image.sourceType,
          sourceUrl: image.sourceUrl,
          photographer: image.photographer,
          credit: image.credit,
          license: image.license,
          sortOrder: image.sortOrder,
        })),
      },
    },
  });

  revalidatePath("/admin/uniformes");
  redirect(`/admin/uniformes/${duplicate.id}/editar`);
}
