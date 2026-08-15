# Arquivo 11

Arquivo visual de uniformes de futebol de clubes e seleções brasileiras — "a história do futebol contada através de seus uniformes."

Especificação completa do projeto (escopo, modelo de dados, decisões arquiteturais): [docs/PROJECT_SPEC.md](docs/PROJECT_SPEC.md).

## Stack

- Next.js 16 (App Router, TypeScript)
- Prisma ORM 7 — PostgreSQL (via `@prisma/adapter-pg`), tanto em desenvolvimento quanto em produção
- Tailwind CSS v4 (tokens de design em `src/app/globals.css`)
- Server Components para o site público, Server Actions para o painel `/admin`

## Rodando localmente

```bash
npm install
cp .env.example .env      # preencha DATABASE_URL com seu Postgres
npx prisma migrate dev    # cria/atualiza as tabelas
npm run db:seed           # popula clubes, fabricantes e uniformes de demonstração
npm run dev               # http://localhost:3000
```

`npm install` já roda `prisma generate` automaticamente (script `postinstall`) — necessário porque `src/generated/prisma` não é versionado.

Painel administrativo: [http://localhost:3000/admin](http://localhost:3000/admin) — CRUD de clubes, seleções, uniformes, fabricantes, patrocinadores, países e competições. Sem autenticação no MVP (decisão registrada em `docs/PROJECT_SPEC.md`).

## Deploy (Vercel)

1. Criar um banco Postgres (Vercel Postgres/Neon, Supabase, etc.) e configurar `DATABASE_URL` nas Environment Variables do projeto no Vercel.
2. Rodar as migrations contra esse banco (`npx prisma migrate deploy`, localmente com a `DATABASE_URL` de produção, ou via um passo de CI).
3. Deploy normal — o `postinstall` cuida de gerar o Prisma Client no build do Vercel.

## Estrutura

```
prisma/schema.prisma       modelo de dados
prisma/seed.ts              dados de demonstração
src/app/(site)/              rotas públicas (tem seu próprio root layout)
src/app/admin/                painel administrativo (root layout próprio, separado do público)
src/lib/data/                camada de acesso a dados (queries Prisma)
src/lib/actions/              Server Actions de mutação, usadas pelo /admin
src/lib/validations/          schemas Zod dos formulários do /admin
src/components/                componentes reutilizáveis (público + src/components/admin para o painel)
```
