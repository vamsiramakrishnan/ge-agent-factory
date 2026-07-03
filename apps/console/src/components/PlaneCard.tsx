import { Wrench, Rocket } from "lucide-react";
import { Button, StatusPill } from "@ge/ui";
import { CliEquivalent } from "./CliEquivalent";

export interface PlaneCardProps {
  name: string;
  up: boolean;
  detail: string;
  onCheckReadiness: () => void;
  onStandUp: () => void;
  busy?: boolean;
  /**
   * Registry command id behind "Stand up" (e.g. "data.up", "mcp.deploy").
   * When set, the card shows the CLI-equivalent chip derived from the command
   * registry — the console teaching the CLI. Optional and additive.
   */
  cliCommandId?: string;
}

export function PlaneCard({ name, up, detail, onCheckReadiness, onStandUp, busy = false, cliCommandId }: PlaneCardProps) {
  return (
    <div className="editorial-micro-card rounded-lg p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-on-surface mb-1">{name}</h3>
          <StatusPill status={up ? "up" : "down"} />
        </div>
      </div>

      <p className="text-xs text-secondary mb-4 leading-relaxed">{detail}</p>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onCheckReadiness}>
          <Wrench className="w-3.5 h-3.5" />
          Check
        </Button>
        <Button size="sm" onClick={onStandUp} disabled={busy || up}>
          <Rocket className="w-3.5 h-3.5" />
          Stand up
        </Button>
      </div>

      {cliCommandId && !up && (
        <div className="mt-3">
          <CliEquivalent commandId={cliCommandId} />
        </div>
      )}
    </div>
  );
}
