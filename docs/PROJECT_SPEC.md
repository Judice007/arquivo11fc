# Arquivo 11 — Especificação do Projeto

> Documento salvo a partir do briefing original fornecido pelo cliente em 2026-08-14.
> Serve como referência viva do escopo do MVP. Decisões arquiteturais tomadas durante a
> implementação que se afastem ou detalhem este documento devem ser registradas aqui ou
> em ADRs separados dentro de `docs/`.

## Marca

- Nome: **Arquivo 11**
- Usuário/domínio: `arquivo11fc`
- Conceito: "A história do futebol contada através de seus uniformes."
- Inspirado na lógica de navegação do Football Kit Archive, mas com identidade visual própria — não copiar layout nem visual.

## Stack técnico (confirmado)

- Next.js 15, App Router, TypeScript estrito
- Prisma ORM
- **PostgreSQL** (dev e produção). O MVP começou em SQLite local; migrado para Postgres em 2026-08-15 ao publicar no Vercel — SQLite/`better-sqlite3` não roda em ambiente serverless (sem disco persistente, módulo nativo). `DATABASE_URL` via variável de ambiente, adapter em `src/lib/db.ts`.
- Tailwind CSS, com tokens de design centralizados (cores, tipografia, radius, spacing, sombras) — nada de cor hardcoded espalhada pelos componentes.
- Server Components para páginas públicas; Server Actions para o painel administrativo (sem API REST separada).
- Projeto único cobrindo frontend público + painel admin + banco.

Deve suportar no futuro: milhares de clubes, milhares de seleções, dezenas/centenas de milhares de uniformes, múltiplas imagens por uniforme, fabricantes, patrocinadores, temporadas, países, competições, usuários e coleções — mas o MVP deve permanecer simples.

## Escopo inicial

- Foco inicial: clubes **brasileiros**, temporadas 2000–2026.
- Arquitetura preparada desde já para clubes e seleções do mundo inteiro.
- Clubes de demonstração (seed): Flamengo, Vasco, Fluminense, Botafogo, Corinthians, Palmeiras, São Paulo, Santos, Grêmio, Internacional, Cruzeiro, Atlético-MG.
- Fabricantes de exemplo (seed): Adidas, Nike, Puma, Umbro, Kappa, Penalty, Topper, Olympikus.
- Não cadastrar uniformes reais agora — apenas dados fictícios claramente identificados como demonstração, sem inventar histórico apresentado como real.

## Estrutura principal do site

Menu: Início, Clubes, Seleções, Temporadas, Marcas, Explorar. Busca global visível, placeholder: "Buscar clube, seleção, temporada ou fabricante".

### Organização geográfica

- Clubes: Continente → País → Clube → Temporada → Uniforme (ex: América do Sul → Brasil → Flamengo → 2009 → Home).
- Seleções: Seleções → Continente → País → Temporada → Uniforme.
- Arquitetura separa claramente clubes e seleções (entidades distintas).

## Páginas

### Home
1. Hero — "ARQUIVO 11" + frase conceitual + busca principal.
2. Clubes em destaque (grid com escudo e nome).
3. Uniformes recentes (cards dos adicionados recentemente).
4. "Volte no tempo" — exploração por década (2020s, 2010s, 2000s, 1990s, 1980s).
5. "Explore por fabricante" (Adidas, Nike, Umbro, Puma, Kappa, Penalty, Topper).
6. "Descubra uma camisa" — botão "Uniforme aleatório" (funciona sobre os dados seed existentes).

### /clubes
Grid de clubes, filtro por continente, filtro por país, busca por nome, ordenação simples. Card: escudo, nome, país.

### /clubes/[slug]
Escudo, nome, nome completo, país, cidade, ano de fundação. Lista de temporadas (mais recente primeiro). Filtro por tipo de uniforme (Todos, Principal, Reserva, Terceiro, Goleiro, Quarto, Especial). Cards de uniformes.

### /clubes/[slug]/[temporada]
Ex: `/clubes/flamengo/2009`. Título "Flamengo — 2009". Todos os uniformes da temporada, por tipo: HOME, AWAY, THIRD, GK, FOURTH, SPECIAL, TRAINING.

Labels em português no frontend:
- HOME = Principal
- AWAY = Reserva
- THIRD = Terceiro
- GK = Goleiro
- FOURTH = Quarto uniforme
- SPECIAL = Especial
- TRAINING = Treino

### /uniformes/[slug]
Ex: `/uniformes/flamengo-home-2009`. Imagem principal, clube, temporada, tipo, fabricante, patrocinador principal, cor primária, cor secundária, competição(ões), descrição/história. Seção "Galeria" (múltiplas imagens: frente, costas, detalhes, outras). Seção "Sobre este uniforme". Seção "Outros uniformes desta temporada" (mesmo clube/temporada). Estrutura preparada para futura seção "Uniformes relacionados".

### Card de uniforme (componente reutilizável)
Imagem (destaque principal), clube, temporada, tipo, fabricante. Visual limpo.

## Temporadas

Suporta dois formatos de exibição: `2025` e `2025/26`. Internamente: `seasonStart` e `seasonEnd`.
- Se `seasonStart === seasonEnd` → exibir `2025`.
- Se diferentes → exibir `2025/26`.
- Não persistir a string formatada — sempre calculada a partir dos dois campos.

## Banco de dados (modelo relacional)

- **Country**: id, name, slug, continent, flagUrl, createdAt, updatedAt
- **Club**: id, name, fullName, slug, countryId, city, foundedYear, crestUrl, createdAt, updatedAt
- **NationalTeam**: id, name, slug, countryId, crestUrl, createdAt, updatedAt
- **Manufacturer**: id, name, slug, countryId?, logoUrl, createdAt, updatedAt
- **Sponsor**: id, name, slug, logoUrl, createdAt, updatedAt
- **Competition**: id, name, slug, countryId?, createdAt, updatedAt
- **Kit**: id, clubId?, nationalTeamId?, seasonStart, seasonEnd, type, manufacturerId?, mainSponsorId?, primaryColor, secondaryColor, description, mainImageUrl, sourceUrl, photographer, imageCredit, imageLicense, slug, createdAt, updatedAt
  - Um Kit pertence a **um clube OU uma seleção**, nunca os dois. SQLite/Prisma não impõe XOR nativamente de forma elegante — validado na camada de aplicação, com constraint real (`CHECK`) planejada para quando migrar a Postgres.
- **KitImage**: id, kitId, imageUrl, type, sourceUrl, photographer, credit, license, sortOrder, createdAt
- **Kit ↔ Competition**: relação many-to-many (tabela de junção), não campo textual único.

### Tipos de uniforme (enum lógico)

`HOME, AWAY, THIRD, GK, FOURTH, SPECIAL, TRAINING` — preparado para novos tipos no futuro. (Implementado como `String` validado em TypeScript/Zod em vez de enum nativo do Prisma, pois SQLite não suporta enums nativos — mantém paridade entre dev e produção.)

### Slugs

Únicos dentro do contexto adequado (ex: `flamengo`, `adidas`, `flamengo-home-2009`). Usados nas URLs. Utilitário reutilizável de geração de slug. Nunca usar nome como chave primária.

## URLs

```
/
/clubes
/clubes/flamengo
/clubes/flamengo/2009
/uniformes/flamengo-home-2009
/selecoes
/selecoes/brasil
/marcas
/marcas/adidas
/temporadas/2009
/explorar

/admin
/admin/clubes
/admin/uniformes
/admin/fabricantes
/admin/patrocinadores
/admin/paises
```

## Painel administrativo

Sem cadastro direto no código. CRUD completo para: Clubes, Seleções, Uniformes, Fabricantes, Patrocinadores (listar/adicionar/editar/excluir); Países e Competições (listar/adicionar/editar).

Cadastro de uniforme: escolher clube OU seleção, temporada inicial/final, tipo, fabricante, patrocinador, cores, descrição, imagem principal, imagens adicionais, fonte, fotógrafo, crédito, licença, competições relacionadas.

Imagens: apenas URLs por enquanto (sem upload binário/base64). Camada preparada para trocar por storage externo (Cloudflare R2, S3, Supabase Storage, etc.) no futuro.

**Proveniência da imagem (2026-08-15):** toda imagem principal/costas do acervo (`Kit.mainImageUrl`/`backImageUrl`, também `KitImage.type`) é classificada por `ImageSourceType` (enum nativo do Postgres): `ARCHIVE_PHOTO` (foto real autorizada), `OFFICIAL_REFERENCE` (material documental de terceiros — nunca vira imagem principal automaticamente) ou `DIGITAL_RECREATION` (recriação digital fornecida pelo admin, permitida como imagem principal, mas sinalizada discretamente na interface pública: "Recriação digital para o Arquivo 11"). As "Fontes e referências" (`sourceUrl`/`sourceOwner`/`imageCredit`/`photographer`/`imageLicense`) ficam sempre registradas separadamente da imagem do acervo, mesmo quando a imagem é uma recriação baseada nelas. Decisão de design: os campos ficaram em `Kit` (não migrados para `KitImage`) para manter a mudança simples — ver comentários em `prisma/schema.prisma`.

**Fluxo de alimentação em massa (2026-08-15):** `Kit.status` (`DRAFT`/`PUBLISHED`, default `PUBLISHED`) permite cadastrar fichas incompletas sem que apareçam no site — toda query pública filtra por `PUBLISHED`; só `/admin` enxerga rascunhos. Uniforme publicado exige imagem principal (validado em `src/lib/validations/kit.ts`); rascunho não exige nada além do que já era obrigatório (clube/seleção, temporada, tipo). Ação "Duplicar" (`duplicateKit`) copia um Kit inteiro (cores, fabricante, patrocinador, competições, galeria) como um novo registro DRAFT com slug `-copia`, pensada para cadastrar variações da mesma temporada (ex.: Home → Away) sem redigitar tudo. A galeria adicional (detalhe/outra) deixou de ser um textarea `TIPO|URL` e virou um editor de linhas (tipo, origem, URL, ordem) — ver `src/components/admin/kit-gallery-editor.tsx`. **Cuidado ao importar dos módulos `@/generated/prisma/*` em Client Components:** só como `import type`, nunca como valor — importar um enum como valor arrasta o runtime do Prisma (que inclui `pg`) pro bundle do navegador e quebra o build do Turbopack.

**Hero dinâmico da Home (2026-08-15):** `Kit` ganhou dois contadores simples (`viewCount`, `searchClickCount`, ambos `Int @default(0)`) em vez de uma tabela de eventos/analytics. `viewCount` é incrementado na ficha pública do uniforme (`/uniformes/[slug]`) via `after()` do Next (`next/server`) — roda depois da resposta já ter sido enviada, então não bloqueia o render nem afeta o cache da página; o acesso via `/admin/uniformes/[id]/editar` usa uma rota e uma query (`getKitById`) completamente separadas, então nunca conta como visualização pública. `searchClickCount` é incrementado quando o clique parte da busca interna (`/busca`, que passou a listar uniformes também, além de clubes/seleções/marcas) — os links de resultado carregam `?from=busca`, e a ficha do uniforme detecta esse marcador para registrar o clique. Os 3 cards do hero da Home (`src/app/(site)/page.tsx`) passaram a vir de `getHeroKits()` (`src/lib/data/kits.ts`): mais recente publicado (sempre disponível), mais visualizado e mais buscado — sem repetir o mesmo uniforme entre os 3 cards, com fallback em cascata (kit não usado ainda → reaproveita o mais recente) para nunca deixar um card vazio num acervo pequeno/novo. A interface pública nunca mostra os números brutos, só o rótulo discreto (MAIS BUSCADO/MAIS RECENTE/MAIS VISUALIZADO) e a legenda do uniforme; os números aparecem apenas no admin (listagem e ficha de edição), sem dashboard.

### Segurança do admin

- `/admin` separado da interface pública (root layout próprio, sem link algum a partir das páginas públicas — ver `src/app/admin/layout.tsx`).
- Server Actions administrativas centralizadas, não expostas de forma insegura.
- **Decisão do cliente (2026-08-14): sem proteção de acesso no MVP** (sem contas de usuário ainda). Estrutura deve ficar preparada para adicionar autenticação depois, sem exigir refatoração grande.
- **⚠️ Pendência antes de produção pública com dados reais (registrada em 2026-08-15):** o site já está publicado (`arquivo11fc.vercel.app`) sem autenticação em `/admin` — qualquer pessoa com a URL consegue criar, editar e excluir conteúdo agora. Aceitável enquanto o conteúdo for de demonstração; autenticação é obrigatória antes de tratar os dados como reais/públicos de verdade.

## SEO

Metadata dinâmica, title/description por página, URLs limpas, HTML semântico, Open Graph básico. Ex: "Flamengo 2009 Uniformes | Arquivo 11" ou "Flamengo Home 2009 | Arquivo 11". Não precisa SEO avançado agora.

## Performance

Server Components onde fizer sentido; Client Components só em interatividade. Componente de imagem bem configurado. Arquitetura não deve obrigar carregar o banco inteiro de uma vez (preparar para paginação futura, sem precisar implementar paginação complexa agora).

## Design

Mobile-first. Aparência de arquivo esportivo / museu digital moderno / catálogo visual / futebol histórico. Evitar: e-commerce, site de apostas, portal de notícias, estética "gamer", cópia visual do Football Kit Archive.

Diretrizes: fundo predominantemente neutro, tipografia forte e legível, bastante espaço para fotos, cards consistentes, hierarquia visual clara, responsivo, acessível. Identidade visual final ainda não definida — usar tokens/variáveis fáceis de alterar depois.

**Revisão de identidade visual (2026-08-15):** paleta e tipografia ajustadas para um mockup de referência (arquivo esportivo premium / museu digital / catálogo editorial). Fundo `#F4F2ED`, tinta `#151515`, texto secundário `#6F6F6F`, verde único de identidade `#173A2B` — sem cor secundária (o antigo tom de latão foi removido). Tipografia: Barlow Condensed para títulos (`next/font/google`), Inter para corpo/interface. Tokens em `src/app/globals.css` (mesmos nomes de variável de antes — `--color-paper`, `--color-ink`, etc. — só os valores mudaram, para não exigir reescrever todos os componentes). Cards de uniforme ganharam uma identificação discreta de arquivo ("A11 · BRA · 2009 · HOME"), gerada por `src/lib/archive-tag.ts` a partir do tipo/temporada/país do clube ou seleção (sem alterar o schema — país não tem coluna de código ISO ainda, só um lookup com fallback).

## Componentes reutilizáveis

Header, Footer, SearchBar, ClubCard, KitCard, ManufacturerCard, SeasonSelector, KitTypeFilter, Breadcrumbs, EmptyState, PageHeader, SectionHeader. Evitar duplicação de markup.

## Seed

País Brasil; os 12 clubes e 8 fabricantes listados acima; alguns uniformes fictícios apenas para validar as páginas, claramente marcados como dados de demonstração.

## Fora de escopo nesta fase

Contas de usuário públicas, favoritos, "Tenho essa camisa"/"Quero essa camisa", coleção pessoal, avaliações, comentários, contribuições públicas, marketplace/compra e venda, seguidores, ranking, notificações, app mobile, i18n completa, analytics avançado, API pública. A arquitetura pode considerar essas possibilidades sem adicionar complexidade ao MVP por causa delas.

## Visão futura (não implementar agora)

Favoritar uniforme, "Tenho essa camisa", "Quero essa camisa", minha coleção, comparar uniformes, enviar uniforme faltante, contribuições da comunidade, perfis de colecionadores, páginas completas de seleções, clubes do mundo inteiro, filtros avançados (ano, marca, clube, país, cor, patrocinador, tipo, competição) — ex: "Todas as camisas Adidas de 1998", "Camisas Nike do Corinthians", "Terceiros uniformes pretos", "Uniformes da Copa do Mundo de 2002".

## Qualidade de código

TypeScript estrito, nomes claros, funções pequenas, estrutura organizada, validação de formulários, tratamento de erros, componentes reutilizáveis, sem código morto, sem abstrações exageradas, sem dependências desnecessárias. Qualquer biblioteca extra deve ser justificada antes de ser adicionada.

## Ordem de implementação

1. Inicialização do projeto
2. Configuração TypeScript/Tailwind
3. Prisma
4. Schema do banco
5. Migration
6. Seed
7. Camada de acesso aos dados
8. Layout global
9. Home
10. Página de Clubes
11. Página individual do Clube
12. Página de Temporada
13. Página individual do Uniforme
14. Seleções (estrutura básica inicialmente)
15. Marcas
16. Busca básica
17. Uniforme aleatório
18. Painel Admin
19. CRUD
20. Responsividade
21. SEO básico
22. Revisão geral

## Regra de escopo

Não expandir o projeto além do que foi pedido. MVP sólido, organizado, fácil de manter. Decisões arquiteturais não cobertas aqui devem escolher a opção mais simples e sustentável, documentada brevemente.
