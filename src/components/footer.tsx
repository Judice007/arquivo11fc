import Link from "next/link";

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
    links: [
      { href: "/explorar", label: "Explorar o arquivo" },
      { href: "/admin", label: "Painel administrativo" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper-raised">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:flex-row md:justify-between md:px-6">
        <div className="max-w-sm">
          <span className="font-display text-lg font-semibold uppercase tracking-tight text-ink">
            Arquivo 11
          </span>
          <p className="mt-2 text-sm text-ink-muted">
            A história do futebol contada através de seus uniformes.
          </p>
        </div>

        <div className="flex gap-12">
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

      <div className="border-t border-line px-4 py-4 md:px-6">
        <p className="mx-auto max-w-6xl text-xs text-ink-faint">
          Arquivo 11 (@arquivo11fc) — arquivo visual de uniformes de futebol. Conteúdo em fase de
          demonstração.
        </p>
      </div>
    </footer>
  );
}
