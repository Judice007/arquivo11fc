import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { AdminNav } from "@/components/admin/admin-nav";

import "@/app/globals.css";

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Painel administrativo", template: "%s | Admin Arquivo 11" },
  robots: { index: false, follow: false },
};

// Root layout próprio do /admin (route group `(site)` tem o seu — ver app/(site)/layout.tsx),
// para manter o painel administrativo visualmente separado da interface pública.
//
// ⚠️ SEM AUTENTICAÇÃO — decisão deliberada para a fase atual de MVP local (ver
// docs/PROJECT_SPEC.md). Nenhuma rota sob /admin, nem as Server Actions em
// src/lib/actions/*, verificam quem está fazendo a requisição. Isso é ACEITÁVEL
// apenas enquanto o site não estiver publicado publicamente com dados reais.
// Autenticação (ex.: NextAuth, senha via middleware, etc.) é OBRIGATÓRIA antes
// de qualquer deploy público com dados reais — sem isso, qualquer pessoa com o
// link consegue criar, editar e excluir conteúdo.
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${bodyFont.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-paper-muted text-ink font-sans">
        <AdminNav />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
