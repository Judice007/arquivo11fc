export const CONTINENTS = [
  "America do Sul",
  "America do Norte",
  "America Central",
  "Europa",
  "Africa",
  "Asia",
  "Oceania",
] as const;

export type Continent = (typeof CONTINENTS)[number];
