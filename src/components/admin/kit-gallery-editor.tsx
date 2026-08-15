"use client";

import { useId, useState } from "react";

import { IMAGE_SOURCE_TYPES, IMAGE_SOURCE_TYPE_LABELS_PT } from "@/lib/image-source-type";
import { KIT_IMAGE_TYPES } from "@/lib/kit-types";

export type GalleryRow = {
  key: string;
  type: string;
  sourceType: string;
  imageUrl: string;
  sortOrder: number;
};

/**
 * Editor da galeria adicional (detalhe/outra, ou ângulos extras de frente/costas).
 * A imagem principal e a de costas continuam em campos próprios no formulário — ver
 * KitForm — este editor cobre só o restante da galeria (KitImage).
 *
 * Serializa para 4 inputs paralelos (mesmo `name`, uma linha por imagem) que o
 * server action lê com `formData.getAll(...)` e recombina em ordem — sem precisar
 * de índices ou JSON no FormData.
 */
export function KitGalleryEditor({ initialRows }: { initialRows: Omit<GalleryRow, "key">[] }) {
  const idPrefix = useId();
  const [rows, setRows] = useState<GalleryRow[]>(
    initialRows.map((row, index) => ({ ...row, key: `${idPrefix}-${index}` })),
  );

  function addRow() {
    setRows((prev) => [
      ...prev,
      {
        key: `${idPrefix}-${prev.length}-${Date.now()}`,
        type: "DETALHE",
        sourceType: "DIGITAL_RECREATION",
        imageUrl: "",
        sortOrder: prev.length,
      },
    ]);
  }

  function removeRow(key: string) {
    setRows((prev) => prev.filter((row) => row.key !== key));
  }

  function updateRow(key: string, patch: Partial<GalleryRow>) {
    setRows((prev) => prev.map((row) => (row.key === key ? { ...row, ...patch } : row)));
  }

  return (
    <div className="flex flex-col gap-3">
      {rows.length === 0 && <p className="text-xs text-ink-faint">Nenhuma imagem adicional ainda.</p>}

      {rows.map((row) => (
        <div key={row.key} className="grid grid-cols-[1fr_1fr_2fr_4.5rem_auto] items-end gap-2 rounded-md border border-line p-2">
          <label className="field-label text-[11px]">
            Ângulo
            <select
              name="galleryType"
              value={row.type}
              onChange={(event) => updateRow(row.key, { type: event.target.value })}
              className="field-select"
            >
              {KIT_IMAGE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className="field-label text-[11px]">
            Origem
            <select
              name="gallerySourceType"
              value={row.sourceType}
              onChange={(event) => updateRow(row.key, { sourceType: event.target.value })}
              className="field-select"
            >
              {IMAGE_SOURCE_TYPES.map((sourceType) => (
                <option key={sourceType} value={sourceType}>
                  {IMAGE_SOURCE_TYPE_LABELS_PT[sourceType]}
                </option>
              ))}
            </select>
          </label>

          <label className="field-label text-[11px]">
            URL
            <input
              type="url"
              name="galleryUrl"
              value={row.imageUrl}
              onChange={(event) => updateRow(row.key, { imageUrl: event.target.value })}
              className="field-input"
            />
          </label>

          <label className="field-label text-[11px]">
            Ordem
            <input
              type="number"
              name="gallerySortOrder"
              value={row.sortOrder}
              onChange={(event) => updateRow(row.key, { sortOrder: Number(event.target.value) })}
              className="field-input"
            />
          </label>

          <button
            type="button"
            onClick={() => removeRow(row.key)}
            className="mb-0.5 text-xs font-medium text-danger hover:underline"
          >
            Remover
          </button>
        </div>
      ))}

      <button type="button" onClick={addRow} className="btn-secondary self-start text-xs">
        + Adicionar imagem
      </button>
    </div>
  );
}
