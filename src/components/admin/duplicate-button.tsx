export function DuplicateButton({ action }: { action: (formData: FormData) => void }) {
  return (
    <form action={action}>
      <button type="submit" className="text-sm font-medium text-ink-muted hover:text-accent hover:underline">
        Duplicar
      </button>
    </form>
  );
}
