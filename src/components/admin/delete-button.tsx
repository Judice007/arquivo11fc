"use client";

export function DeleteButton({
  action,
  confirmMessage = "Tem certeza que deseja excluir? Essa ação não pode ser desfeita.",
  label = "Excluir",
}: {
  action: (formData: FormData) => void;
  confirmMessage?: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(confirmMessage)) event.preventDefault();
      }}
    >
      <button type="submit" className="text-sm font-medium text-danger hover:underline">
        {label}
      </button>
    </form>
  );
}
