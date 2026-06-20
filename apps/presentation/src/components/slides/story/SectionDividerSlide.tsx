import React from "react";
import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";

interface SectionDividerProps {
  sectionNumber: string;
  title: string;
  subtitle?: string;
  quote?: string;
  quoteAuthor?: string;
  icon?: LucideIcon;
  accentColor?: string;
}

export const SectionDividerSlide = ({ sectionNumber, title, subtitle, quote, quoteAuthor, icon: Icon, accentColor = "#005bbf" }: SectionDividerProps) => (
  <div className="flex-1 flex flex-col justify-center items-center text-center relative">
    {/* Background accent */}
    <div className="absolute inset-0 -z-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[120px] opacity-[0.04]" style={{ backgroundColor: accentColor }} />
    </div>

    {/* Section number */}
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mb-6"
    >
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 border-2" style={{ borderColor: accentColor + "30", backgroundColor: accentColor + "08" }}>
        {Icon ? (
          <Icon className="w-7 h-7" style={{ color: accentColor }} />
        ) : (
          <span className="text-xl font-headline font-extrabold" style={{ color: accentColor }}>{sectionNumber}</span>
        )}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: accentColor }}>
        Part {sectionNumber}
      </span>
    </motion.div>

    {/* Title */}
    <motion.h2
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="text-5xl font-headline font-extrabold mb-4 tracking-tight"
    >
      {title}
    </motion.h2>

    {subtitle && (
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-lg text-secondary max-w-xl leading-relaxed mb-8"
      >
        {subtitle}
      </motion.p>
    )}

    {/* Quote */}
    {quote && (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-lg mt-4"
      >
        <div className="w-8 h-[2px] mx-auto mb-6 rounded-full" style={{ backgroundColor: accentColor + "40" }} />
        <p className="text-base italic text-secondary/70 leading-relaxed">
          &ldquo;{quote}&rdquo;
        </p>
        {quoteAuthor && (
          <p className="text-xs font-headline font-bold mt-3" style={{ color: accentColor }}>
            &mdash; {quoteAuthor}
          </p>
        )}
      </motion.div>
    )}
  </div>
);
