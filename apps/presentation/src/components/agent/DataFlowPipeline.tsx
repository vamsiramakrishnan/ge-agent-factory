import React from "react";
import { motion } from "motion/react";
import { ChevronDown, Sparkles, ArrowRight } from "lucide-react";
import { PipelineStage } from "../../types/architecture";
import { PIPELINE_STYLES } from "../../design-tokens";

interface DataFlowPipelineProps {
  stages: PipelineStage[];
}

export const DataFlowPipeline: React.FC<DataFlowPipelineProps> = ({ stages }) => (
  <div className="flex flex-col gap-0.5 h-full">
    {stages.map((stage, i) => {
      const style = PIPELINE_STYLES[stage.layer] || PIPELINE_STYLES.integration;
      const isLLM = stage.layer === "llm";

      return (
        <React.Fragment key={i}>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.08 }}
            className={`p-2.5 rounded-lg border flex-1 ${
              isLLM
                ? "border-2 border-amber-400 bg-gradient-to-r from-amber-50 via-yellow-50/60 to-amber-50"
                : `${style.bg} ${style.border}`
            }`}
          >
            {/* Header row */}
            <div className="flex items-center gap-1.5 mb-1">
              {isLLM && <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />}
              <span className={`text-[8px] font-bold uppercase tracking-wider ${style.textColor}`}>
                {isLLM ? `✦ ${stage.label}` : stage.label}
              </span>
              <span className="text-[6px] font-mono text-secondary/30 ml-auto shrink-0">
                {style.label}
              </span>
            </div>

            {/* Description */}
            <p className="text-[8px] text-secondary/60 leading-snug mb-1.5 line-clamp-2">
              {stage.description}
            </p>

            {/* Data flow badges + Systems */}
            <div className="flex items-center gap-1 flex-wrap">
              {stage.dataIn && (
                <span className="inline-flex items-center gap-0.5 text-[6px] font-mono px-1.5 py-0.5 rounded bg-white/70 border border-outline-variant/15 text-secondary/50">
                  <span className="font-bold text-secondary/70">IN</span> {stage.dataIn}
                </span>
              )}
              {stage.dataIn && stage.dataOut && (
                <ArrowRight className="w-2 h-2 text-secondary/20 shrink-0" />
              )}
              {stage.dataOut && (
                <span className="inline-flex items-center gap-0.5 text-[6px] font-mono px-1.5 py-0.5 rounded bg-white/70 border border-outline-variant/15 text-secondary/50">
                  <span className="font-bold text-secondary/70">OUT</span> {stage.dataOut}
                </span>
              )}
            </div>

            {/* System tags */}
            <div className="flex gap-0.5 mt-1 flex-wrap">
              {stage.systems.map((sys, j) => (
                <span
                  key={j}
                  className="text-[5px] font-bold uppercase tracking-wider px-1 py-px rounded bg-white/50 text-secondary/40 border border-outline-variant/10"
                >
                  {sys}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Arrow connector */}
          {i < stages.length - 1 && (
            <div className="flex justify-center py-px">
              <ChevronDown className="w-3 h-3 text-outline-variant/25" />
            </div>
          )}
        </React.Fragment>
      );
    })}
  </div>
);
