import React from "react";
import { useVertical } from "../../context/VerticalContext";

export const VerticalSwitcher = () => {
  const { vertical, setVertical, allVerticals } = useVertical();

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-0.5 rounded bg-surface-container-low shrink-0 max-w-full">
      {allVerticals.map((v) => {
        const Icon = v.icon;
        const isActive = vertical === v.key;
        return (
          <button
            key={v.key}
            onClick={() => setVertical(v.key)}
            className={`flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded text-[8px] sm:text-[9px] font-headline font-bold uppercase tracking-[0.08em] transition-all duration-200 ${
              isActive
                ? `${v.activeBg} text-white shadow-ambient`
                : "text-secondary/40 hover:text-on-surface hover:bg-surface-container-high"
            }`}
          >
            <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            {v.shortLabel}
          </button>
        );
      })}
    </div>
  );
};
