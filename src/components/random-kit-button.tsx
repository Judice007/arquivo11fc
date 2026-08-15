import { goToRandomKit } from "@/lib/actions/kits";

export function RandomKitButton({ className = "" }: { className?: string }) {
  return (
    <form action={goToRandomKit}>
      <button
        type="submit"
        className={`inline-flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-paper transition-colors hover:bg-accent-strong ${className}`}
      >
        Uniforme aleatório
      </button>
    </form>
  );
}
