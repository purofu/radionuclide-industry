"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/* animation timing --------------------------------------------- */
export const DUR = 1.2;          // body height animation
const ICON = 0.7;                // plus→X rotation

interface Props {
  id: string;
  title: string;
  subtitle?: string;
  content: React.ReactNode;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}

const AccordionSection: React.FC<Props> = ({
  id,
  title,
  subtitle,
  content,
  isExpanded,
  onToggle,
}) => (
  /* full‑bleed shell so the divider spans 100 vw */
  <section id={`section-${id}`} className="relative w-screen left-1/2 -translate-x-1/2">
    {/* ───── HEADER ───── */}
    <header className="sticky top-0 z-40 bg-white">
      {/* 12‑column grid; icon in last track */}
      <div
        onClick={() => onToggle(id)}
        className="container mx-auto px-4 md:px-6 lg:px-8
                   grid grid-cols-12 cursor-pointer relative"
      >
        {/* title + subtitle */}
        <div className="col-span-11 py-8">
          <h2 className="text-h3 font-helvetica-now text-black">{title}</h2>
          {subtitle && (
            <p className="text-body text-grey mt-2 leading-[23.1px]">{subtitle}</p>
          )}
        </div>

        {/* PLUS icon (rotates 45° → X) */}
        <div className="col-span-1 flex justify-end pt-8">
          <motion.div
            animate={{ rotate: isExpanded ? 45 : 0 }}
            transition={{ duration: ICON, ease: [0.16, 1, 0.3, 1] }}
            className="w-6 h-6 relative"
          >
            <span className="absolute w-6 h-0.5 bg-black top-1/2 -translate-y-1/2" />
            <span className="absolute h-6 w-0.5 bg-black left-1/2 -translate-x-1/2" />
          </motion.div>
        </div>
      </div>

      {/* full‑width divider line */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-light-grey" />
    </header>

    {/* ───── BODY ───── */}
    <AnimatePresence initial={false}>
      {isExpanded && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          exit={{ height: 0 }}
          transition={{ duration: DUR, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden"
        >
          {/* centred container; no implicit grid */}
          <div className="container mx-auto ">
            {content}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </section>
);

export default AccordionSection;