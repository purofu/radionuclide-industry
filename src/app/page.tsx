"use client";
import React, { useState } from "react";
import HeroSection from "./component/HeroSection";
import IntroductionSection from "./component/IntroductionSection";
import LigandsAndTargets from "./component/LigandsAndTargets";
import IsotopesOverview from "./component/IsotopesOverview";
import Companies from "./component/Companies";
import Manufacturing from "./component/Manufacturing";
import PatientAccess from "./component/PatientAccess";
import PreFooter from "./component/PreFooter";
import Footer from "./component/Footer";

import AccordionSection, { DUR as PANEL_DUR } from "./component/AccordionSection";
import PerspectiveSection from "./component/PerspectiveSection";
import UpdatesSection from "./component/UpdatesSection";
import Perspective from "../components/ui/Perspective";

/* ---------------------------- helpers -------------------------------- */
const OFFSET = 80;          // px – sticky header height
const FALLBACK = 1000;      // ms – max wait for scrollend event

/** Smooth‑scroll, then resolve when scrolling truly stops. */
const scrollToWithOffsetAsync = (el: HTMLElement): Promise<void> =>
  new Promise((resolve) => {
    const top = el.getBoundingClientRect().top + window.scrollY - OFFSET;
    const distance = Math.abs(window.scrollY - top);

    /* Already at the target … resolve immediately. */
    if (distance < 2) {
      resolve();
      return;
    }

    /* Otherwise wait for the browser's scrollend or our fallback timeout. */
    const done = () => {
      window.removeEventListener("scrollend", done);
      clearTimeout(timer);
      resolve();
    };

    const timer = setTimeout(done, FALLBACK);
    window.addEventListener("scrollend", done, { once: true });
    window.scrollTo({ top, behavior: "smooth" });
  });

/* -------------------------------------------------------------------- */

export default function Home() {
  const sections = [
    {
      id: "introduction",
      title: "Overview",
      subtitle: "The current state of the radionuclide therapy industry",
      content: <IntroductionSection />,
    },
    {
      id: "isotopes",
      title: "Radioisotopes",
      subtitle:
        "The spectrum of therapeutic and diagnostic isotopes in development or in use",
      content: <IsotopesOverview />,
    },
    {
      id: "ligands",
      title: "Ligands & Targets",
      subtitle:
        "The diversity of ligands and biological targets being explored and deployed",
      content: <LigandsAndTargets />,
    },
    {
      id: "companies",
      title: "Companies",
      subtitle: "Key players shaping the Radionuclide industry",
      content: <Companies />,
    },
    {
      id: "manufacturing",
      title: "Manufacturing",
      subtitle:
        "The infrastructure and processes required to produce radionuclide therapies at scale",
      content: <Manufacturing />,
    },
    {
      id: "patient",
      title: "Patient Access",
      subtitle:
        "Market access dynamics and delivery challenges across geographies",
      content: <PatientAccess />,
    },
  ];

  const [expandedId, setExpandedId] = useState<string | null>(null);

  /* ------------------------------------------------------------------ */
  /*  Scroll ➜ collapse ➜ expand ➜ scroll  (fully synchronous)          */
  /* ------------------------------------------------------------------ */
  const toggleSection = async (id: string) => {
    const openId = expandedId;

    /* 1 ─ same panel → scroll (if needed) then collapse */
    if (openId === id) {
      const hdr = document.getElementById(`section-${id}`);
      if (hdr) await scrollToWithOffsetAsync(hdr);
      setExpandedId(null);
      return;
    }

    /* 2 ─ switching panels */
    if (openId) {
      const oldHdr = document.getElementById(`section-${openId}`);
      if (oldHdr) await scrollToWithOffsetAsync(oldHdr); // ensure collapse visible

      setExpandedId(null);                               // collapse old
      await new Promise((r) => setTimeout(r, PANEL_DUR * 1000));

      setExpandedId(id);                                 // expand new
      await new Promise((r) => setTimeout(r, 150));      // mount delay

      const newHdr = document.getElementById(`section-${id}`);
      if (newHdr) await scrollToWithOffsetAsync(newHdr);
      return;
    }

    /* 3 ─ opening first panel */
    setExpandedId(id);
    await new Promise((r) => setTimeout(r, 150));
    const hdr = document.getElementById(`section-${id}`);
    if (hdr) scrollToWithOffsetAsync(hdr);
  };

  /* ------------------------------------------------------------------ */

  /* ------------------------------------------------------------------ */

  return (
    <div className="min-h-screen relative">
      <HeroSection />

      <div className="accordion-container w-full">
        {sections.map((s) => (
          <AccordionSection
            key={s.id}
            {...s}
            isExpanded={expandedId === s.id}
            onToggle={toggleSection}
          />
        ))}
      </div>
      <UpdatesSection />
      <div className="h-24 md:h-32 lg:h-40" />
      
      <PerspectiveSection />
      

      <PreFooter />
      <Perspective />
      <Footer />
    </div>
  );
}