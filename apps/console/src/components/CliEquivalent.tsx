import { useQuery } from "@tanstack/react-query";
import { CommandChip, cx } from "@ge/ui";
import { ge } from "../services/geClient";
import { cliForCommand } from "../lib/cliEquivalent";

// "The console teaches the CLI": next to a registry-backed action, show the
// exact `ge …` invocation the button runs as a copyable chip (the shared
// <CommandChip>). The string derives from the command registry's `cli` field
// via GET /api/ge/commands — never a hardcoded literal in the view — so a
// renamed CLI command can't leave a stale hint behind.
//
// Renders nothing while the registry payload is loading, when the API is
// unavailable, or for an unknown id — the affordance is decoration, never a
// crash.

export interface CliEquivalentProps {
  /** Registry command id (@ge/capability-registry), e.g. "agents.build". */
  commandId: string;
  className?: string;
}

// Shared, hard-cached registry fetch: the command table is static per server
// process, so every <CliEquivalent> on screen resolves from one request.
export function useGeCommands() {
  return useQuery({
    queryKey: ["geCommands"],
    queryFn: async () => {
      try {
        return await ge.commands();
      } catch {
        // best-effort: registry unavailable — the affordance hides itself.
        return null;
      }
    },
    staleTime: 5 * 60_000,
    retry: false,
  });
}

export function CliEquivalent({ commandId, className }: CliEquivalentProps) {
  const { data } = useGeCommands();
  const cli = cliForCommand(data?.commands, commandId);
  if (!cli) return null;
  return (
    <span className={cx("inline-flex items-center gap-1.5", className)}>
      <span className="select-none text-4xs font-semibold uppercase tracking-wide text-secondary" aria-hidden>
        CLI
      </span>
      <CommandChip command={cli} />
    </span>
  );
}
