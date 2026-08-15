export function FormError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <div className="mb-6 rounded-md border border-danger bg-danger-soft px-4 py-3 text-sm text-danger">
      {message}
    </div>
  );
}
