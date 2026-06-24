import { useRef, useState } from "react";
import { FileUp, Loader2, TriangleAlert, UploadCloud } from "lucide-react";
import { ge, type InterviewDocument } from "../../services/geClient";

const MAX_BYTES = 25 * 1024 * 1024; // ~25MB client-side guard
const ACCEPT = ".txt,.md,.csv,.json,.pdf,.docx,.pptx,.xlsx";

/**
 * Drag/drop + file-picker for interview grounding documents. Reads the file as
 * base64 (data: prefix stripped) and POSTs it through ge.uploadInterviewDocument,
 * which parses it server-side and returns the extracted text. Newly uploaded docs
 * are handed up via onUploaded so DocumentPreview can render + ground them.
 */
export function DocumentDropzone({
  usecaseId,
  onUploaded,
  disabled = false,
}: {
  usecaseId: string;
  onUploaded: (doc: InterviewDocument) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [busyName, setBusyName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File) => {
    setError(null);
    if (file.size > MAX_BYTES) {
      setError(`${file.name} is ${formatBytes(file.size)} — over the ${formatBytes(MAX_BYTES)} limit.`);
      return;
    }
    setBusyName(file.name);
    try {
      const contentBase64 = await readAsBase64(file);
      const doc = await ge.uploadInterviewDocument(usecaseId, {
        filename: file.name,
        mimeType: file.type || undefined,
        contentBase64,
      });
      onUploaded(doc);
    } catch (err: any) {
      setError(err.detail || err.message || `Failed to upload ${file.name}`);
    } finally {
      setBusyName(null);
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || disabled) return;
    for (const file of Array.from(files)) {
      // Sequential so the per-file busy indicator + error surfacing stay legible.
      await uploadFile(file);
    }
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(event) => {
          if ((event.key === "Enter" || event.key === " ") && !disabled) {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void handleFiles(event.dataTransfer?.files ?? null);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-6 text-center transition-colors ${
          dragging
            ? "border-primary/60 bg-primary/5"
            : "border-outline-variant/60 bg-surface-container/30 hover:bg-surface-container/50"
        } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
      >
        {busyName ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <div className="text-xs font-medium text-secondary">Uploading {busyName}…</div>
          </>
        ) : (
          <>
            <UploadCloud className={`h-5 w-5 ${dragging ? "text-primary" : "text-secondary"}`} />
            <div className="text-xs font-medium text-on-surface">
              Drop a BRD or supporting document, or <span className="text-primary">browse</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-secondary">
              <FileUp className="h-3 w-3" />
              .txt .md .csv .json .pdf .docx .pptx .xlsx · up to {formatBytes(MAX_BYTES)}
            </div>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          multiple
          className="sr-only"
          disabled={disabled}
          onChange={(event) => {
            void handleFiles(event.target.files);
            event.target.value = "";
          }}
        />
      </div>
      {error && (
        <div className="mt-2 flex items-start gap-2 rounded-md border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-700">
          <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

function readAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      // FileReader gives "data:<mime>;base64,<payload>" — strip the prefix.
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(reader.error || new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

export function formatBytes(value: number): string {
  if (!Number.isFinite(value)) return "";
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${Math.round(value / 1024)} KB`;
  return `${(value / 1024 / 1024).toFixed(1)} MB`;
}
