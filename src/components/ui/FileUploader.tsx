import React, { useMemo, useRef } from "react";
import { ImagePlus, Trash2, Replace } from "lucide-react";
import Button from "./Button";
import { cn } from "../../lib/cn";

export type FileValue = {
  name: string;
  size: number;
  type: string;
  dataUrl: string; // base64 data url
};

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export default function FileUploader({
  label,
  value,
  onChange,
  multiple = true,
  accept = "image/*",
  hint,
  error,
}: {
  label?: string;
  value: FileValue[];
  onChange: (next: FileValue[]) => void;
  multiple?: boolean;
  accept?: string;
  hint?: string;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const totalSize = useMemo(() => value.reduce((a, b) => a + b.size, 0), [value]);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const list = Array.from(files);
    const mapped: FileValue[] = [];
    for (const f of list) {
      mapped.push({ name: f.name, size: f.size, type: f.type, dataUrl: await fileToDataUrl(f) });
    }
    onChange(multiple ? [...value, ...mapped] : mapped.slice(0, 1));
  }

  function onPick() {
    inputRef.current?.click();
  }

  function removeAt(i: number) {
    const next = value.slice();
    next.splice(i, 1);
    onChange(next);
  }

  function clearAll() {
    onChange([]);
  }

  return (
    <div className="space-y-2">
      {label ? <div className="label">{label}</div> : null}

      <div
        className={cn(
          "card-muted p-4",
          "border-dashed border-2",
          error ? "border-[var(--danger)]" : "border-[var(--border2)]"
        )}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="rounded-2xl border border-[var(--border2)] p-3 bg-[rgba(255,255,255,.06)]">
            <ImagePlus className="h-6 w-6 opacity-90" />
          </div>
          <div className="space-y-1">
            <div className="text-sm font-semibold">Drag & drop images here</div>
            <div className="help">
              Or <button type="button" className="underline" onClick={onPick}>browse</button>.
              {multiple ? " You can upload multiple." : " Single image."}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" variant="primary" onClick={onPick} leftIcon={<Replace className="h-4 w-4" />}>
              Select
            </Button>
            {value.length ? (
              <Button type="button" variant="danger" onClick={clearAll} leftIcon={<Trash2 className="h-4 w-4" />}>
                Clear
              </Button>
            ) : null}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      </div>

      {error ? <div className="text-xs text-[var(--danger)]">{error}</div> : null}
      {!error && hint ? <div className="help">{hint}</div> : null}

      {value.length ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {value.map((f, i) => (
            <div key={i} className="card p-3">
              <div className="aspect-[16/10] overflow-hidden rounded-xl border border-[var(--border)] bg-black/10">
                <img src={f.dataUrl} alt={f.name} className="h-full w-full object-cover" />
              </div>
              <div className="mt-2 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">{f.name}</div>
                  <div className="help">{Math.round(f.size / 1024)} KB</div>
                </div>
                <button
                  type="button"
                  className="rounded-xl border border-[var(--border2)] p-2 hover:bg-white/5"
                  onClick={() => removeAt(i)}
                  aria-label="remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {value.length ? (
        <div className="help">
          {value.length} file(s) • {Math.round(totalSize / 1024)} KB total
        </div>
      ) : null}
    </div>
  );
}
