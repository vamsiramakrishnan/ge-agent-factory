import React from "react";
import { motion } from "motion/react";
import { useSlideNavigation } from "../../context/SlideContext";
import { ArrowRight, LucideIcon, ShieldCheck } from "lucide-react";
import { AGENTS } from "../../constants/agents";
import { TRIGGER_ICONS, TRIGGER_STYLES, LAYER_STYLES } from "../../design-tokens";

interface UseCaseLink {
  id: string;
  title: string;
  icon: LucideIcon;
  description: string;
}

interface DomainCatalogSlideProps {
  title: string;
  subtitle: string;
  description: string;
  useCases: UseCaseLink[];
  color: string;
}

export const DomainCatalogSlide = ({ title, subtitle, description, useCases, color }: DomainCatalogSlideProps) => {
  const { goToSlide } = useSlideNavigation();

  // Determine grid columns based on count
  const count = useCases.length;
  const gridCols = count <= 4 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
    : count <= 6 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
    : count <= 9 ? "grid-cols-2 sm:grid-cols-3"
    : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5";

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-4 shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: color }}>
            <span className="text-white text-xs font-bold">{count}</span>
          </div>
          <div>
            <h2 className="text-3xl font-headline font-bold">{title}</h2>
            <p className="text-secondary text-[10px] uppercase tracking-widest font-mono">{subtitle}</p>
          </div>
        </div>
        <p className="text-sm text-secondary max-w-3xl leading-relaxed">
          {description}
        </p>
      </div>

      {/* Use Case Grid */}
      <div className={`grid ${gridCols} gap-2.5 flex-1 auto-rows-min`}>
        {useCases.map((uc, index) => {
          const agentData = AGENTS.find(a => a.id === uc.id);
          const TriggerIcon = agentData ? TRIGGER_ICONS[agentData.triggerType] : null;
          const triggerColor = agentData ? TRIGGER_STYLES[agentData.triggerType].color : "";

          return (
            <motion.button
              key={uc.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => goToSlide(uc.id)}
              className="group editorial-card editorial-card-interactive relative p-4 rounded-lg text-left flex flex-col"
            >
              {/* Top row: icon + badges */}
              <div className="flex items-start justify-between mb-2">
                <div className="w-8 h-8 rounded-md flex items-center justify-center shadow-sm transition-transform group-hover:scale-110" style={{ backgroundColor: color }}>
                  <uc.icon className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-center gap-1">
                  {agentData && (
                    <>
                      <div className={`w-1.5 h-1.5 rounded-full ${LAYER_STYLES[agentData.layer].dot}`} />
                      {TriggerIcon && <TriggerIcon className={`w-3 h-3 ${triggerColor}`} />}
                      {agentData.hitl && <ShieldCheck className="w-3 h-3 text-rose-500" />}
                    </>
                  )}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-sm font-headline font-bold mb-1 group-hover:text-primary transition-colors leading-tight">
                {uc.title}
              </h3>

              {/* Description */}
              <p className="text-[11px] text-secondary leading-snug flex-1">
                {uc.description}
              </p>

              {/* Hover CTA */}
              <div className="flex items-center gap-1 text-primary font-bold text-[9px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                Deep Dive <ArrowRight className="w-3 h-3" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
