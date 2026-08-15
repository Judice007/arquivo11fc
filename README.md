# Arquivo 11

Arquivo visual de uniformes de futebol de clubes e seleções brasileiras — "a história do futebol contada através de seus uniformes."

Especificação completa do projeto (escopo, modelo de dados, decisões arquiteturais): [docs/PROJECT_SPEC.md](docs/PROJECT_SPEC.md).

## Stack

- Next.js 16 (App Router, TypeScript)
- Prisma ORM 7 — SQLite em desenvolvimento (`@prisma/adapter-better-sqlite3`), PostgreSQL como destino de produção
- Tailwind CSS v4 (tokens de design em `src/app/globals.css`)
- Server Components para o site público, Server Actions para o painel `/admin`

## Rodando localmente

```bash
npm install
npx prisma migrate dev   # cria/atualiza o banco SQLite local (prisma/dev.db)
npm run db:seed          # popula clubes, fabricantes e uniformes de demonstração
npm run dev              # http://localhost:3000
```

Painel administrativo: [http://localhost:3000/admin](http://localhost:3000/admin) — CRUD de clubes, seleções, uniformes, fabricantes, patrocinadores, países e competições. Sem autenticação no MVP (decisão registrada em `docs/PROJECT_SPEC.md`).

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

## Migrando para PostgreSQL

1. Trocar `provider = "sqlite"` por `provider = "postgresql"` em `prisma/schema.prisma`.
2. Apontar `DATABASE_URL` para o Postgres de destino.
3. Trocar o adapter em `src/lib/db.ts` de `PrismaBetterSqlite3` para `PrismaPg` (`@prisma/adapter-pg`).
4. Rodar `prisma migrate deploy`.

Nenhum outro arquivo depende do banco específico — consultas e schema já foram escritos evitando recursos exclusivos do SQLite (ver comentários em `prisma/schema.prisma`).
