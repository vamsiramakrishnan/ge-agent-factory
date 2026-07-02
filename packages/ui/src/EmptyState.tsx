import type { ComponentType, ReactNode } from "react";
import { cx } from "./cx";

// The one empty-state layout (icon · message · optional detail · optional
// action) that ~14 hand-rolled blocks across the console shared informally.
export interface EmptyStateProps {
  /** A lucide icon component (rendered in the muted 8×8 idiom). */
  icon?: ComponentType<{ className?: string }>;
  title: ReactNode;
  detail?: ReactNode;
  /** Call to action — usually a <Button size="sm"> or <ButtonLink>. */
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, detail, action, className }: EmptyStateProps) {
  return (
    <div className={cx("flex flex-col items-center justify-center py-8 text-center", className)}>
      {Icon && <Icon className="mb-3 h-8 w-8 text-secondary/40" aria-hidden />}
      <p className="text-sm text-secondary">{title}</p>
      {detail && <p className="mt-1 text-xs text-secondary/80">{detail}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
