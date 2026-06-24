import React from "react";
import { motion } from "motion/react";
import { ArrowRight, LucideIcon } from "lucide-react";
import { useSlideNavigation } from "../../../context/SlideContext";
import { DOMAINS } from "../../../constants/domains";
import { AGENTS } from "../../../constants/agents";

interface DepartmentLandingSlideProps {
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  accentColor: string;
  domainRange: [number, number]; // [min, max] inclusive domain IDs
}

export const DepartmentLandingSlide = ({ title, subtitle, description, icon: Icon, accentColor, domainRange }: DepartmentLandingSlideProps) => {
  const { goToSlide } = useSlideNavigation();
  const [minDomain, maxDomain] = domainRange;

  const departmentDomains = DOMAINS.filter((_, idx) => {
    const domainNum = idx + 1;
    return domainNum >= minDomain && domainNum <= maxDomain;
  });

  const totalAgents = AGENTS.filter(a => a.domain >= minDomain && a.domain <= maxDomain).length;
  const hitlAgents = AGENTS.filter(a => a.domain >= minDomain && a.domain <= maxDomain && a.hitl).length;

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-6 shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: accentColor }}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-4xl font-headline font-bold">{title}</h2>
            <p className="text-secondary text-[10px] uppercase tracking-widest font-mono">{subtitle}</p>
          </div>
        </div>
        <p className="text-sm text-secondary max-w-3xl leading-relaxed">{description}</p>
      </div>

      {/* Stats Bar */}
      <div className="flex flex-wrap items-center gap-6 mb-6 p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 shrink-0">
        <div className="text-center">
          <div className="text-3xl font-headline font-black" style={{ color: accentColor }}>{departmentDomains.length}</div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-secondary/50">Domains</div>
        </div>
        <div className="w-px h-10 bg-outline-variant/20" />
        <div className="text-center">
          <div className="text-3xl font-headline font-black" style={{ color: accentColor }}>{totalAgents}</div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-secondary/50">AI Agents</div>
        </div>
        <div className="w-px h-10 bg-outline-variant/20" />
        <div className="text-center">
          <div className="text-3xl font-headline font-black" style={{ color: accentColor }}>{hitlAgents}</div>
          <div className="text-[9px] font-bold uppercase tracking-widest text-secondary/50">HITL Gates</div>
        </div>
      </div>

      {/* Domain Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 flex-1 auto-rows-min">
        {departmentDomains.map((domain, index) => {
          const domainIdx = DOMAINS.indexOf(domain);
          const domainNum = domainIdx + 1;
          const agentCount = AGENTS.filter(a => a.domain === domainNum).length;

          return (
            <motion.button
              key={domain.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => goToSlide(domain.id)}
              className="group relative p-5 rounded-xl bg-surface-container-lowest border border-outline-variant/20 hover:border-primary/40 transition-all hover:shadow-lg hover:shadow-primary/5 text-left flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm transition-transform group-hover:scale-110" style={{ backgroundColor: domain.color }}>
                  <domain.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-[8px] font-mono text-secondary/40 font-bold">{agentCount} agents</span>
              </div>

              <h3 className="text-base font-headline font-bold mb-1 group-hover:text-primary transition-colors leading-tight">
                {domain.title}
              </h3>

              <div className="flex items-center gap-1 text-primary font-bold text-[9px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity mt-auto pt-2">
                Explore Domain <ArrowRight className="w-3 h-3" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
