"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar({
  className = "",
  defaultValue = "",
  size = "md",
  autoFocus = false,
}: {
  className?: string;
  defaultValue?: string;
  size?: "md" | "lg";
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = value.trim();
    router.push(trimmed ? `/busca?q=${encodeURIComponent(trimmed)}` : "/busca");
  }

  const sizeClasses = size === "lg" ? "rounded-full py-3.5 px-6 text-base" : "rounded-md py-2 px-3.5 text-sm";

  return (
    <form role="search" onSubmit={handleSubmit} className={className}>
      <input
        type="search"
        name="q"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Buscar clube, temporada ou fabricante"
        aria-label="Buscar clube, temporada ou fabricante"
        autoFocus={autoFocus}
        className={`w-full border border-line bg-paper-raised text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent ${sizeClasses}`}
      />
    </form>
  );
}
