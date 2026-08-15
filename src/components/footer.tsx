import Link from "next/link";

import { Logo } from "@/components/logo";

const COLUMNS = [
  {
    title: "Navegar",
    links: [
      { href: "/clubes", label: "Clubes" },
      { href: "/selecoes", label: "Seleções" },
      { href: "/temporadas", label: "Temporadas" },
      { href: "/marcas", label: "Marcas" },
    ],
  },
  {
    title: "Sobre",
    links: [{ href: "/explorar", label: "Explorar o arquivo" }],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-4 py-14 md:flex-row md:justify-between md:px-8">
        <div className="max-w-sm">
          <Logo />
          <p className="mt-3 text-sm text-ink-muted">A história do futebol vestida em camisas.</p>
        </div>

        <div className="flex gap-16">
          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                {column.title}
              </h3>
              <ul className="mt-3 flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-muted transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-line px-4 py-5 md:px-8">
        <p className="mx-auto max-w-[1440px] text-xs text-ink-faint">
          Arquivo 11 (@arquivo11fc) — arquivo visual de uniformes de futebol. Conteúdo em fase de
          demonstração.
        </p>
      </div>
    </footer>
  );
}
