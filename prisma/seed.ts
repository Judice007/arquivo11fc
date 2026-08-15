import "dotenv/config";

import { prisma } from "../src/lib/db";
import type { KitType } from "../src/lib/kit-types";
import { buildKitSlug, slugify } from "../src/lib/slug";

/**
 * Seed de demonstração do Arquivo 11.
 *
 * Os clubes, o país e os fabricantes abaixo são entidades reais (nome, cidade,
 * ano de fundação são fatos públicos). Os UNIFORMES (Kit) são inteiramente
 * FICTÍCIOS — cores, patrocinadores, descrições e imagens não representam
 * uniformes reais desses clubes. Cada Kit criado aqui recebe uma descrição
 * começando com "[DEMO]" para deixar isso explícito também no banco de dados.
 */

const DEMO_NOTE =
  "[DEMO] Uniforme fictício criado apenas para validar a estrutura do Arquivo 11 — não representa um uniforme real.";

const CLUBS = [
  { name: "Flamengo", fullName: "Clube de Regatas do Flamengo", city: "Rio de Janeiro", foundedYear: 1895 },
  { name: "Vasco", fullName: "Club de Regatas Vasco da Gama", city: "Rio de Janeiro", foundedYear: 1898 },
  { name: "Fluminense", fullName: "Fluminense Football Club", city: "Rio de Janeiro", foundedYear: 1902 },
  { name: "Botafogo", fullName: "Botafogo de Futebol e Regatas", city: "Rio de Janeiro", foundedYear: 1904 },
  { name: "Corinthians", fullName: "Sport Club Corinthians Paulista", city: "São Paulo", foundedYear: 1910 },
  { name: "Palmeiras", fullName: "Sociedade Esportiva Palmeiras", city: "São Paulo", foundedYear: 1914 },
  { name: "São Paulo", fullName: "São Paulo Futebol Clube", city: "São Paulo", foundedYear: 1930 },
  { name: "Santos", fullName: "Santos Futebol Clube", city: "Santos", foundedYear: 1912 },
  { name: "Grêmio", fullName: "Grêmio Foot-Ball Porto Alegrense", city: "Porto Alegre", foundedYear: 1903 },
  { name: "Internacional", fullName: "Sport Club Internacional", city: "Porto Alegre", foundedYear: 1909 },
  { name: "Cruzeiro", fullName: "Cruzeiro Esporte Clube", city: "Belo Horizonte", foundedYear: 1921 },
  { name: "Atlético-MG", fullName: "Clube Atlético Mineiro", city: "Belo Horizonte", foundedYear: 1908 },
] as const;

const MANUFACTURERS = ["Adidas", "Nike", "Puma", "Umbro", "Kappa", "Penalty", "Topper", "Olympikus"] as const;

const SPONSORS = [
  "Banco Central Esportivo",
  "Seguros Litoral",
  "TechBank Digital",
  "Rede Litoral Supermercados",
  "Cia. de Bebidas Sul",
] as const;

const COMPETITIONS = ["Campeonato Brasileiro Série A", "Copa do Brasil", "Copa Libertadores da América"] as const;

const COLORS = ["#C8102E", "#000000", "#FFFFFF", "#006341", "#003DA5", "#FFD100", "#7A1FA2"];

function pick<T>(items: readonly T[], index: number): T {
  return items[index % items.length];
}

function placeholderImage(seed: string, w = 600, h = 800) {
  return `https://placehold.co/${w}x${h}/1f4d3a/f7f5f0?text=${encodeURIComponent(seed)}`;
}

async function main() {
  console.log("Seed: limpando dados existentes...");
  await prisma.kitCompetition.deleteMany();
  await prisma.kitImage.deleteMany();
  await prisma.kit.deleteMany();
  await prisma.club.deleteMany();
  await prisma.nationalTeam.deleteMany();
  await prisma.manufacturer.deleteMany();
  await prisma.sponsor.deleteMany();
  await prisma.competition.deleteMany();
  await prisma.country.deleteMany();

  console.log("Seed: país...");
  const brasil = await prisma.country.create({
    data: {
      name: "Brasil",
      slug: "brasil",
      continent: "America do Sul",
      flagUrl: placeholderImage("Brasil", 120, 80),
    },
  });

  console.log("Seed: fabricantes...");
  const manufacturers = await Promise.all(
    MANUFACTURERS.map((name) =>
      prisma.manufacturer.create({
        data: {
          name,
          slug: slugify(name),
          logoUrl: placeholderImage(name, 240, 120),
        },
      }),
    ),
  );

  console.log("Seed: patrocinadores...");
  const sponsors = await Promise.all(
    SPONSORS.map((name) =>
      prisma.sponsor.create({
        data: { name, slug: slugify(name), logoUrl: placeholderImage(name, 240, 120) },
      }),
    ),
  );

  console.log("Seed: competições...");
  const competitions = await Promise.all(
    COMPETITIONS.map((name) =>
      prisma.competition.create({
        data: { name, slug: slugify(name), countryId: brasil.id },
      }),
    ),
  );

  console.log("Seed: clubes...");
  const clubs = await Promise.all(
    CLUBS.map((club) =>
      prisma.club.create({
        data: {
          name: club.name,
          fullName: club.fullName,
          slug: slugify(club.name),
          countryId: brasil.id,
          city: club.city,
          foundedYear: club.foundedYear,
          crestUrl: placeholderImage(club.name, 200, 200),
        },
      }),
    ),
  );

  console.log("Seed: uniformes de demonstração...");

  // Temporadas de exemplo por clube, uma por década, o suficiente para validar
  // o agrupamento por década e a listagem de temporadas. Clubes brasileiros usam
  // temporada de ano único (ver docs/PROJECT_SPEC.md) — o formato "2025/26" para
  // ligas que atravessam o ano continua suportado pelo sistema (formatSeason /
  // parseSeasonSlug), só não é exercitado neste seed porque nenhum clube/seleção
  // aqui usa esse formato de temporada.
  const DEMO_SEASONS: { seasonStart: number; seasonEnd: number; types: KitType[] }[] = [
    { seasonStart: 2005, seasonEnd: 2005, types: ["HOME", "AWAY"] },
    { seasonStart: 2015, seasonEnd: 2015, types: ["HOME", "AWAY", "THIRD"] },
    { seasonStart: 2025, seasonEnd: 2025, types: ["HOME", "AWAY", "THIRD", "GK"] },
  ];

  let kitCounter = 0;

  for (const [clubIndex, club] of clubs.entries()) {
    for (const season of DEMO_SEASONS) {
      for (const type of season.types) {
        const manufacturer = pick(manufacturers, clubIndex + season.seasonStart);
        const sponsor = pick(sponsors, clubIndex + 1);
        const primaryColor = pick(COLORS, clubIndex);
        const secondaryColor = pick(COLORS, clubIndex + 3);

        const slug = buildKitSlug({
          ownerSlug: club.slug,
          type,
          seasonStart: season.seasonStart,
          seasonEnd: season.seasonEnd,
        });

        const imageSeed = `${club.name} ${type} ${season.seasonStart}`;

        const kit = await prisma.kit.create({
          data: {
            clubId: club.id,
            seasonStart: season.seasonStart,
            seasonEnd: season.seasonEnd,
            type,
            manufacturerId: manufacturer.id,
            mainSponsorId: sponsor.id,
            primaryColor,
            secondaryColor,
            description: `${DEMO_NOTE} Uniforme ${type.toLowerCase()} fictício do ${club.name} para a temporada.`,
            mainImageUrl: placeholderImage(imageSeed),
            sourceUrl: null,
            photographer: "Acervo Arquivo 11 (demonstração)",
            imageCredit: "Imagem placeholder gerada para demonstração",
            imageLicense: "Uso interno — dado de demonstração",
            slug,
          },
        });

        await prisma.kitImage.createMany({
          data: [
            { kitId: kit.id, imageUrl: placeholderImage(`${imageSeed} frente`), type: "FRENTE", sortOrder: 0 },
            { kitId: kit.id, imageUrl: placeholderImage(`${imageSeed} costas`), type: "COSTAS", sortOrder: 1 },
          ],
        });

        // Associa a uma competição real (nome), mas a relação em si é fictícia/demo.
        const competition = pick(competitions, clubIndex + kitCounter);
        await prisma.kitCompetition.create({
          data: { kitId: kit.id, competitionId: competition.id },
        });

        kitCounter += 1;
      }
    }
  }

  console.log(`Seed concluído: ${clubs.length} clubes, ${manufacturers.length} fabricantes, ${kitCounter} uniformes de demonstração.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
