import { statusStyle, statusLabel, type StatusValue } from "./status";

interface StatusPillProps {
  status: StatusValue;
  className?: string;
}

export function StatusPill({ status, className = "" }: StatusPillProps) {
  const tone = statusStyle(status);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${tone.className} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${tone.dot}`} />
      {statusLabel(status)}
    </span>
  );
}
