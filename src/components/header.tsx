import Link from "next/link";

import { Logo } from "@/components/logo";
import { MobileNav } from "@/components/mobile-nav";
import { SearchBar } from "@/components/search-bar";

const NAV_LINKS = [
  { href: "/clubes", label: "Clubes" },
  { href: "/selecoes", label: "Seleções" },
  { href: "/temporadas", label: "Temporadas" },
  { href: "/marcas", label: "Marcas" },
  { href: "/explorar", label: "Explorar" },
];

export function Header() {
  return (
    <header className="relative border-b border-line bg-paper-raised">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3 md:px-6">
        <div className="flex flex-1 items-center gap-6">
          <Logo />
          <nav className="hidden md:block">
            <ul className="flex items-center gap-5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-ink-muted transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="order-3 w-full md:order-none md:w-64">
          <SearchBar />
        </div>

        <MobileNav />
      </div>
    </header>
  );
}
