import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

import "@/app/globals.css";

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

// Fonte de título condensada e forte — impacto editorial (ver docs/PROJECT_SPEC.md,
// revisão de identidade visual de 2026-08-15).
const displayFont = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const SITE_NAME = "Arquivo 11";
const SITE_DESCRIPTION = "A história do futebol vestida em camisas.";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_DESCRIPTION}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

// Root layout público. /admin vive em app/admin/layout.tsx como seu próprio
// root layout (route group sem layout.tsx de nível superior compartilhado) —
// ver docs/PROJECT_SPEC.md: "mantenha /admin separado da interface pública".
export default function PublicRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
