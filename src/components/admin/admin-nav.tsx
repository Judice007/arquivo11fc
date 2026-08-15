import Link from "next/link";

const ADMIN_LINKS = [
  { href: "/admin", label: "Painel" },
  { href: "/admin/clubes", label: "Clubes" },
  { href: "/admin/selecoes", label: "Seleções" },
  { href: "/admin/uniformes", label: "Uniformes" },
  { href: "/admin/fabricantes", label: "Fabricantes" },
  { href: "/admin/patrocinadores", label: "Patrocinadores" },
  { href: "/admin/paises", label: "Países" },
  { href: "/admin/competicoes", label: "Competições" },
];

export function AdminNav() {
  return (
    <header className="border-b border-line-strong bg-ink">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link href="/admin" className="text-sm font-semibold uppercase tracking-wide text-paper">
          Arquivo 11 <span className="text-brass">· Admin</span>
        </Link>
        <Link href="/" className="text-xs text-paper/70 transition-colors hover:text-paper">
          Ver site público →
        </Link>
      </div>
      <nav className="border-t border-white/10">
        <div className="mx-auto max-w-6xl overflow-x-auto px-4 md:px-6">
          <ul className="flex gap-5 whitespace-nowrap py-2">
            {ADMIN_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-paper/80 transition-colors hover:text-paper"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
