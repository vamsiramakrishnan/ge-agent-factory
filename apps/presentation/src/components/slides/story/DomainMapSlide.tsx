import React from "react";
import { motion } from "motion/react";
import { useSlideNavigation } from "../../../context/SlideContext";
import { DOMAINS } from "../../../constants/domains";
import { ArrowRight } from "lucide-react";

export const DomainMapSlide = () => {
  const { goToSlide } = useSlideNavigation();

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="mb-12">
        <h2 className="text-5xl font-headline font-bold mb-4">The Agentic HR Ecosystem</h2>
        <p className="text-xl text-secondary max-w-3xl">
          Explore the 10 domains of HR transformation. Click any domain to dive into specific agentic use cases.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 flex-1">
        {DOMAINS.map((domain, index) => (
          <motion.button
            key={domain.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => goToSlide(domain.id)}
            className="group relative p-6 rounded-3xl bg-surface-container-low border border-outline-variant/30 hover:border-primary transition-all hover:scale-[1.05] hover:shadow-2xl hover:shadow-primary/10 flex flex-col items-center justify-center text-center gap-4"
          >
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-6"
              style={{ backgroundColor: domain.color }}
            >
              <domain.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-headline font-bold text-sm group-hover:text-primary transition-colors">
              {domain.title}
            </h3>
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="w-4 h-4 text-primary" />
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
