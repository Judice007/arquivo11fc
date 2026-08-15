import { HeaderSearch } from "@/components/header-search";
import { Logo } from "@/components/logo";
import { MobileNav } from "@/components/mobile-nav";
import { NavLink } from "@/components/nav-link";
import { NAV_LINKS } from "@/lib/nav-links";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper-raised">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-4 md:px-8">
        <Logo />

        <nav className="hidden md:block">
          <ul className="flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <NavLink href={link.href} label={link.label} />
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <HeaderSearch />
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
