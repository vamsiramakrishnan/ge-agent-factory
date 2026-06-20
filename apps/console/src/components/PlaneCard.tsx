import { Wrench, Rocket } from "lucide-react";

export interface PlaneCardProps {
  name: string;
  up: boolean;
  detail: string;
  onCheckReadiness: () => void;
  onStandUp: () => void;
  busy?: boolean;
}

export function PlaneCard({ name, up, detail, onCheckReadiness, onStandUp, busy = false }: PlaneCardProps) {
  return (
    <div className="editorial-micro-card rounded-lg p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-on-surface mb-1">{name}</h3>
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${up ? "bg-emerald-500/10 text-emerald-700" : "bg-rose-500/10 text-rose-700"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${up ? "bg-emerald-500" : "bg-rose-500"}`} />
            {up ? "up" : "down"}
          </div>
        </div>
      </div>

      <p className="text-xs text-secondary mb-4 leading-relaxed">{detail}</p>

      <div className="flex items-center gap-2">
        <button
          onClick={onCheckReadiness}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-secondary hover:text-on-surface transition-colors rounded-md hover:bg-surface-container"
        >
          <Wrench className="w-3.5 h-3.5" />
          Check
        </button>
        <button
          onClick={onStandUp}
          disabled={busy || up}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-primary hover:bg-primary-container transition-colors rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Rocket className="w-3.5 h-3.5" />
          Stand up
        </button>
      </div>
    </div>
  );
}
