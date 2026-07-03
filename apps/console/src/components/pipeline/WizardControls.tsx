import { Select } from "@ge/ui";

export function SourceOption({ active, Icon, title, detail, onClick }: { active: boolean; Icon: any; title: string; detail: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-4 py-3 text-left transition-colors ${
        active
          ? "border-primary/35 bg-primary/10"
          : "border-outline-variant/40 bg-surface hover:bg-surface-container/60"
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${active ? "text-primary" : "text-secondary"}`} />
        <div className="text-sm font-semibold text-on-surface">{title}</div>
      </div>
      <div className="mt-1 text-xs leading-5 text-secondary">{detail}</div>
    </button>
  );
}

export function ContractRow({ Icon, label, value }: { Icon: any; label: string; value: string }) {
  return (
    <div className="py-3">
      <div className="mb-1 flex items-center gap-2 text-3xs font-medium uppercase tracking-wide text-secondary">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="line-clamp-2 text-sm text-on-surface">{value}</div>
    </div>
  );
}

export function TargetSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <Select value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="preview">Preview ready</option>
      <option value="deploy">Deploy ready</option>
      <option value="publish">Published</option>
    </Select>
  );
}
