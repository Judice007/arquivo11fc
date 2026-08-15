import { goToRandomKit } from "@/lib/actions/kits";

export function RandomKitButton({ className = "" }: { className?: string }) {
  return (
    <form action={goToRandomKit}>
      <button
        type="submit"
        className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wide text-accent-foreground transition-colors hover:bg-accent-strong ${className}`}
      >
        <ShuffleIcon />
        Uniforme aleatório
      </button>
    </form>
  );
}

function ShuffleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h3.5L15 17h4.5M16 6h3v3M19 6l-4.5 5M4 18h3.5L11 13" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 15v3h-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
