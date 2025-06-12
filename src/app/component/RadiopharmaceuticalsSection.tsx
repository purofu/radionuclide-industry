"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import styles from "@/theme/components";          // card utility classes
import { Tabs } from "@/components/ui/Tabs";      // dropdown‑on‑mobile Tabs

/* ----------------------------------------------------------------- */
/*  Type definitions                                                 */
/* ----------------------------------------------------------------- */

type Radiopharmaceutical = {
  isotope: string;
  name: string;
  brandName: string;
  company: string;
  indication: string;
  url?: string;
};

type Category = {
  field: string;          // e.g. Neurology, Oncology
  type: string;           // Diagnostics | Therapy
  items: Radiopharmaceutical[];
};

/* ----------------------------------------------------------------- */
/*  Complete source data                                             */
/* ----------------------------------------------------------------- */

const allCategoriesData: Category[] = [
  // ───────────────────────────────────────────────────────────
  // Neurology ‑ Diagnostics
  // ───────────────────────────────────────────────────────────
  {
    field: "Neurology",
    type: "Diagnostics",
    items: [
      {
        isotope: "[18F]",
        name: "Florbetaben",
        brandName: "Neuraceq",
        company: "Piramal Imaging",
        indication: "Alzheimer's disease imaging",
        url: "https://www.neuraceq.com/",
      },
      {
        isotope: "[99mTc]",
        name: "NaTcO4",
        brandName: "",
        company: "Generic",
        indication: "Cerebral imaging",
      },
      {
        isotope: "[18F]",
        name: "Flutemetamol",
        brandName: "Vizamyl",
        company: "GE Healthcare",
        indication: "Alzheimer's disease imaging",
        url: "https://www.gehealthcare.com/",
      },
      {
        isotope: "[99mTc]",
        name: "TcHMPAO",
        brandName: "Ceretec",
        company: "GE Healthcare",
        indication: "Cerebral perfusion imaging",
        url: "https://www.gehealthcare.com/",
      },
      {
        isotope: "[18F]",
        name: "Florbetapir",
        brandName: "Amyvid",
        company: "Eli Lilly",
        indication: "Alzheimer's disease imaging",
        url: "https://www.amyvid.com/",
      },
      {
        isotope: "[99mTc]",
        name: "TcECD",
        brandName: "",
        company: "GE Healthcare",
        indication: "Cerebral perfusion imaging",
        url: "https://www.gehealthcare.com/",
      },
      {
        isotope: "[18F]",
        name: "Flortaucipir",
        brandName: "Tauvid",
        company: "Roche",
        indication: "Tau imaging in Alzheimer's disease",
        url: "https://www.roche.com/",
      },
      {
        isotope: "[123I]",
        name: "Iomazenil",
        brandName: "",
        company: "Generic",
        indication: "Epilepsy/neuroreceptor imaging",
      },
      {
        isotope: "[18F]",
        name: "FDOPA",
        brandName: "",
        company: "Generic",
        indication: "Parkinson's disease imaging",
      },
      {
        isotope: "[123I]",
        name: "FP‑CIT",
        brandName: "DaTSCAN",
        company: "GE Healthcare",
        indication: "Parkinsonian syndromes imaging",
        url: "https://www.gehealthcare.com/",
      },
      {
        isotope: "[18F]",
        name: "FP‑CIT",
        brandName: "",
        company: "Generic",
        indication: "Parkinsonian syndromes imaging",
      },
      {
        isotope: "[18F]",
        name: "FDG",
        brandName: "FDG",
        company: "Generic",
        indication: "Brain metabolism imaging (epilepsy, dementia, tumors)",
        url: "https://en.wikipedia.org/wiki/Fluorodeoxyglucose",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────
  // Oncology ‑ Diagnostics
  // ───────────────────────────────────────────────────────────
  {
    field: "Oncology",
    type: "Oncology - Diagnostics",
    items: [
      {
        isotope: "[18F]",
        name: "Fluoro‑2‑Deoxy‑D‑Glucose",
        brandName: "FDG",
        company: "Multiple Suppliers",
        indication: "Various cancers – metabolic imaging",
        url: "https://en.wikipedia.org/wiki/Fluorodeoxyglucose",
      },
      {
        isotope: "[99mTc]",
        name: "Tc‑DTPA‑Tilmanocept",
        brandName: "Lymphoseek",
        company: "Navidea Biopharmaceuticals",
        indication: "Sentinel lymph node mapping (breast, melanoma, head & neck)",
        url: "https://www.navidea.com/",
      },
      {
        isotope: "[18F]",
        name: "Flotufolastat",
        brandName: "",
        company: "Investigational",
        indication: "Prostate cancer imaging",
      },
      {
        isotope: "[99mTc]",
        name: "Arcitumomab",
        brandName: "CEA‑Scan",
        company: "Immunomedics",
        indication: "Colorectal cancer imaging",
        url: "https://www.immunomedics.com/",
      },
      {
        isotope: "[18F]",
        name: "Fluciclovine",
        brandName: "Axumin",
        company: "Astellas / Blue Earth Diagnostics",
        indication: "Prostate cancer recurrence imaging",
        url: "https://www.axumin.com/",
      },
      {
        isotope: "[99mTc]",
        name: "TcN‑pyridoxyl‑5‑methyltryptophan",
        brandName: "",
        company: "Generic",
        indication: "Liver tumor imaging",
      },
      {
        isotope: "[18F]",
        name: "PSMA‑1007",
        brandName: "",
        company: "Generic",
        indication: "Prostate cancer imaging",
      },
      {
        isotope: "[99mTc]",
        name: "TcECG",
        brandName: "",
        company: "Investigational",
        indication: "Oncology imaging (unspecified)",
      },
      {
        isotope: "[18F]",
        name: "Piflufolastat",
        brandName: "Pylarify",
        company: "Lantheus Medical Imaging",
        indication: "Prostate cancer imaging",
        url: "https://www.lantheus.com/",
      },
      {
        isotope: "[99mTc]",
        name: "TcSulfur Colloid",
        brandName: "",
        company: "Generic",
        indication: "Liver/splenic imaging in cancer staging",
      },
      {
        isotope: "[18F]",
        name: "Fluoroestradiol",
        brandName: "FES",
        company: "Generic",
        indication: "Breast cancer (ER‑positive) imaging",
      },
      {
        isotope: "[99mTc]",
        name: "TcPhytate",
        brandName: "",
        company: "Generic",
        indication: "Liver tumor imaging",
      },
      {
        isotope: "[68Ga]",
        name: "Ga‑DOTA‑TATE",
        brandName: "NETSPOT",
        company: "Advanced Accelerator Applications / Ipsen",
        indication: "Neuroendocrine tumor imaging",
        url: "https://www.netspot.com/",
      },
      {
        isotope: "[99mTc]",
        name: "TcMDP",
        brandName: "",
        company: "Generic",
        indication: "Bone metastases imaging",
      },
      {
        isotope: "[68Ga]",
        name: "Ga‑DOTA‑TOC",
        brandName: "",
        company: "Generic",
        indication: "Neuroendocrine tumor imaging",
      },
      {
        isotope: "[99mTc]",
        name: "TcGH",
        brandName: "",
        company: "Investigational",
        indication: "Oncology imaging (unspecified)",
      },
      {
        isotope: "[68Ga]",
        name: "Ga‑PSMA‑11",
        brandName: "",
        company: "Generic",
        indication: "Prostate cancer imaging",
      },
      {
        isotope: "[111In]",
        name: "Capromab pendetide",
        brandName: "ProstaScint",
        company: "Cytogen",
        indication: "Prostate cancer imaging",
        url: "https://en.wikipedia.org/wiki/ProstaScint",
      },
      {
        isotope: "[11C]",
        name: "Choline",
        brandName: "",
        company: "Generic",
        indication: "Prostate cancer imaging",
      },
      {
        isotope: "[111In]",
        name: "In‑DTPA‑Octreotide",
        brandName: "OctreoScan",
        company: "Mallinckrodt Pharmaceuticals",
        indication: "Neuroendocrine tumor imaging",
        url: "https://www.mallinckrodt.com/",
      },
      {
        isotope: "[64Cu]",
        name: "Cu‑DOTA‑TATE",
        brandName: "",
        company: "Generic",
        indication: "Neuroendocrine tumor imaging",
      },
      {
        isotope: "[111In]",
        name: "Satumomab pendetide",
        brandName: "",
        company: "Investigational",
        indication: "Oncology imaging (unspecified)",
      },
      {
        isotope: "[123I]",
        name: "MIBG",
        brandName: "",
        company: "Generic",
        indication: "Neuroendocrine tumor imaging (pheochromocytoma, neuroblastoma)",
      },
      {
        isotope: "[123I]",
        name: "Sodium iodinate",
        brandName: "",
        company: "Generic",
        indication: "Thyroid cancer imaging",
      },
      {
        isotope: "[67Ga]",
        name: "Gallium citrate",
        brandName: "",
        company: "Generic",
        indication: "Lymphoma and various cancers imaging",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────
  // Cardiology ‑ Diagnostics
  // ───────────────────────────────────────────────────────────
  {
    field: "Cardiology",
    type: "Diagnostics",
    items: [
      {
        isotope: "[18F]",
        name: "FDG",
        brandName: "FDG",
        company: "Generic",
        indication: "Cardiac viability imaging",
        url: "https://en.wikipedia.org/wiki/Fluorodeoxyglucose",
      },
      {
        isotope: "[99mTc]",
        name: "Tetrofosmin",
        brandName: "Myoview",
        company: "GE Healthcare",
        indication: "Myocardial perfusion imaging",
        url: "https://www.gehealthcare.com/",
      },
      {
        isotope: "[13N]",
        name: "NH3·H2O",
        brandName: "",
        company: "Generic",
        indication: "Myocardial perfusion imaging",
      },
      {
        isotope: "[99mTc]",
        name: "Sestamibi",
        brandName: "Cardiolite",
        company: "Bristol‑Myers Squibb / GE Healthcare",
        indication: "Myocardial perfusion imaging",
        url: "https://www.gehealthcare.com/",
      },
      {
        isotope: "[82Rb]",
        name: "Rubidium chloride",
        brandName: "",
        company: "Generic",
        indication: "Myocardial perfusion imaging",
      },
      {
        isotope: "[99mTc]",
        name: "TcRBCs",
        brandName: "",
        company: "Generic",
        indication: "Cardiac function assessment",
      },
      {
        isotope: "[99mTc]",
        name: "TcPYP",
        brandName: "",
        company: "Generic",
        indication: "Cardiac amyloidosis imaging",
      },
      {
        isotope: "[125I]",
        name: "Iodinated albumin",
        brandName: "",
        company: "Generic",
        indication: "Cardiac blood pool imaging",
      },
      {
        isotope: "[201Tl]",
        name: "Thallium chloride",
        brandName: "",
        company: "Generic",
        indication: "Myocardial perfusion imaging",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────
  // Bone Imaging ‑ Diagnostics
  // ───────────────────────────────────────────────────────────
  {
    field: "Bone Imaging",
    type: "Diagnostics",
    items: [
      {
        isotope: "[18F]",
        name: "NaF",
        brandName: "",
        company: "Generic",
        indication: "Bone metastases imaging",
      },
      {
        isotope: "[99mTc]",
        name: "Sulesomab",
        brandName: "",
        company: "Generic",
        indication: "Bone infection/metastases imaging",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────
  // Nephrotic Syndrome ‑ Diagnostics
  // ───────────────────────────────────────────────────────────
  {
    field: "Nephrotic Syndrome",
    type: "Diagnostics",
    items: [
      {
        isotope: "[99mTc]",
        name: "TcDTPA2‑",
        brandName: "",
        company: "Generic",
        indication: "Renal function imaging",
      },
      {
        isotope: "[99mTc]",
        name: "TcSuccimer",
        brandName: "",
        company: "Generic",
        indication: "Renal imaging",
      },
      {
        isotope: "[99mTc]",
        name: "TcMAG3",
        brandName: "",
        company: "Generic",
        indication: "Renal tubular function imaging",
      },
      {
        isotope: "[99mTc]",
        name: "Human serum albumin DTPA",
        brandName: "",
        company: "Generic",
        indication: "Renal imaging",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────
  // Hepatopulmonary Imaging ‑ Diagnostics
  // ───────────────────────────────────────────────────────────
  {
    field: "Hepatopulmonary Imaging",
    type: "Diagnostics",
    items: [
      {
        isotope: "[99mTc]",
        name: "Albumin Aggregate Injection",
        brandName: "",
        company: "Generic",
        indication: "Lung perfusion imaging",
      },
      {
        isotope: "[99mTc]",
        name: "DTPA‑galactosyl‑HSA",
        brandName: "",
        company: "Generic",
        indication: "Liver function imaging",
      },
      {
        isotope: "[99mTc]",
        name: "Macroaggregated human serum albumin",
        brandName: "",
        company: "Generic",
        indication: "Lung perfusion imaging",
      },
      {
        isotope: "[99mTc]",
        name: "TcMebrofenin",
        brandName: "",
        company: "Generic",
        indication: "Hepatobiliary imaging",
      },
    ],
  },

  // ───────────────────────────────────────────────────────────
  // Oncology ‑ Therapy (Therapeutic radiopharmaceuticals)
  // ───────────────────────────────────────────────────────────
  {
    field: "Oncology",
    type: "Oncology - Therapy",
    items: [
      {
        isotope: "[223Ra]",
        name: "RaCl",
        brandName: "Xofigo",
        company: "Bayer Healthcare",
        indication: "Prostate cancer with bone metastases",
        url: "https://www.xofigo.com/",
      },
      {
        isotope: "[90Y]",
        name: "Glass microspheres",
        brandName: "TheraSphere",
        company: "BTG",
        indication: "Liver cancer (primary and metastatic)",
        url: "http://www.therasphere.com/",
      },
      {
        isotope: "[32P]",
        name: "Sodium orthophosphate",
        brandName: "",
        company: "Nordion International",
        indication: "Polycythemia vera and bone disorders",
        url: "https://www.nordion.com/",
      },
      {
        isotope: "[90Y]",
        name: "Y‑DTPA‑Ibritumomab Tiuxetan",
        brandName: "Zevalin",
        company: "Spectrum Pharmaceuticals",
        indication: "Non‑Hodgkin's lymphoma",
        url: "https://www.zevalin.com/",
      },
      {
        isotope: "[89Sr]",
        name: "SrCl₂",
        brandName: "Metastron",
        company: "Mallinckrodt Pharmaceuticals",
        indication: "Bone metastases (pain palliation)",
        url: "https://www.mallinckrodt.com/",
      },
      {
        isotope: "[131I]",
        name: "MIBG",
        brandName: "Azdedra",
        company: "Novartis",
        indication: "Neuroendocrine tumors (pheochromocytoma, neuroblastoma)",
        url: "https://www.azedra.com/",
      },
      {
        isotope: "[153Sm]",
        name: "Lexidronam",
        brandName: "Quadramet",
        company: "Ipsen",
        indication: "Bone metastases (pain palliation)",
        url: "https://www.ipsen.com/",
      },
      {
        isotope: "[131I]",
        name: "Sodium Iodide",
        brandName: "",
        company: "Mallinckrodt Pharmaceuticals",
        indication: "Thyroid cancer (ablation therapy)",
        url: "https://www.mallinckrodt.com/",
      },
      {
        isotope: "[177Lu]",
        name: "Lu‑PSMA‑617",
        brandName: "Pluvicto",
        company: "Novartis",
        indication: "Metastatic castration‑resistant prostate cancer",
        url: "https://www.pluvicto.com/",
      },
      {
        isotope: "[131I]",
        name: "Metuximab",
        brandName: "Licartin",
        company: "Beijing 301 Hospital",
        indication: "Hepatocellular carcinoma",
        url: "http://www.301hospital.com.cn/",
      },
      {
        isotope: "[177Lu]",
        name: "Lu‑DOTA‑TATE",
        brandName: "Lutathera",
        company: "Advanced Accelerator Applications",
        indication: "Neuroendocrine tumors",
        url: "https://www.lutathera.com/",
      },
      {
        isotope: "[131I]",
        name: "Tositumomab",
        brandName: "Bexxar",
        company: "GlaxoSmithKline",
        indication: "Non‑Hodgkin's lymphoma",
        url: "https://www.gsk.com/",
      },
      {
        isotope: "[90Y]",
        name: "Resin microspheres",
        brandName: "SIR‑Spheres",
        company: "Sirtex Medical",
        indication: "Liver cancer (primary and metastatic)",
        url: "https://www.sirtex.com/",
      },
    ],
  },
];


/* ----------------------------------------------------------------- */
/*  Lightweight custom dropdown                                      */
/* ----------------------------------------------------------------- */
type Option = { id: string; label: string };

const Dropdown: React.FC<{
  value: string;
  options: Option[];
  onChange: (id: string) => void;
  labelSrOnly?: string;
}> = ({ value, options, onChange, labelSrOnly = "dropdown" }) => {
  const [open, setOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close when clicking outside
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const selected = options.find((o) => o.id === value);

  return (
    <div ref={dropdownRef} className="relative mb-6 w-full max-w-xs">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={labelSrOnly}
        onClick={() => setOpen((p) => !p)}
        className={`flex w-full items-center justify-between rounded-lg bg-[#F9F9F9] border border-grey-200 px-4 py-2 text-left text-lg font-medium text-black transition-colors ${
          open ? "bg-white" : "hover:bg-white"
        }`}
      >
        <span>{selected?.label}</span>
        {/* caret icon */}
        <svg
          className={`h-4 w-4 transform transition-transform ${open ? "rotate-180" : ""} text-grey-500`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* options list */}
      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-full z-20 mt-1 w-full overflow-hidden rounded-lg border border-grey-200 bg-white shadow-md"
        >
          {options.map((o) => (
            <li
              key={o.id}
              role="option"
              aria-selected={o.id === value}
              onClick={() => {
                onChange(o.id);
                setOpen(false);
              }}
              className={`cursor-pointer px-4 py-3 text-base transition-colors ${
                o.id === value ? "bg-grey-100 font-semibold" : "hover:bg-grey-50"
              }`}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const RadiopharmaceuticalsSection: React.FC = () => {
  /* Split data once */
  const { diagnosticCategories, oncologyCategories } = useMemo(() => {
    const oncology = allCategoriesData.filter((c) => c.field === "Oncology");
    const diagnostics = allCategoriesData.filter((c) => c.field !== "Oncology");
    return { diagnosticCategories: diagnostics, oncologyCategories: oncology };
  }, []);

  /* Build option lists */
  const diagnosticOptions = useMemo(
    () => diagnosticCategories.map((c) => ({ id: c.field, label: c.field })),
    [diagnosticCategories]
  );
  const oncologyOptions = useMemo(
    () => oncologyCategories.map((c) => ({ id: c.type, label: c.type })),
    [oncologyCategories]
  );

  /* Active selections */
  const [activeDiag, setActiveDiag] = useState(diagnosticOptions[0]?.id || "");
  const [activeOnc, setActiveOnc] = useState(oncologyOptions[0]?.id || "");

  /* Simple fade */
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <section className="w-full py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          className="w-full mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-h4 font-bold">
            <span className="text-grey">List of approved </span>
            <span className="text-black">radiopharmaceuticals </span>
            <span className="text-grey">across </span>
            <span className="text-black">therapy & diagnosis</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Diagnostics column */}
          <div className="w-full">
            {/* Dropdown */}
            <Dropdown
              value={activeDiag}
              options={diagnosticOptions}
              onChange={setActiveDiag}
              labelSrOnly="Select diagnostic category"
            />

            <div className="h-[550px] overflow-y-auto pr-2">
              {diagnosticCategories.map((category) => (
                <div key={category.field} className={activeDiag === category.field ? "block" : "hidden"}>
                  <div className="sticky top-0 bg-white z-10 py-3 border-b border-grey/20 mb-5">
                    <h3 className="text-xl font-medium">
                      <span className="text-grey">{category.field} – </span>
                      <span className="text-black">{category.type}</span>
                    </h3>
                  </div>

                  <div className="space-y-4 pb-8">
                    {category.items.map((item, idx) => (
                      <motion.div
                        key={idx}
                        className={styles.card.data("")}
                        variants={fadeIn}
                        initial="hidden"
                        animate="visible"
                      >
                        <div className="flex items-start justify-between mb-2 gap-2">
                          <div className="flex-1 min-w-0 mr-2">
                            <span className="text-purple font-helvetica-now">{item.isotope}</span>
                            <span className="text-black font-helvetica-now"> {item.name} </span>
                            {item.brandName && (item.url ? (
                              <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-primary-blue hover:underline">
                                ({item.brandName})
                              </a>
                            ) : (
                              <span className="text-primary-blue">({item.brandName})</span>
                            ))}
                          </div>
                          <span className="text-grey flex-shrink-0 text-right">{item.company}</span>
                        </div>
                        <div className="text-sm text-grey mt-1">{item.indication}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Oncology column */}
          <div className="w-full">
            <Dropdown
              value={activeOnc}
              options={oncologyOptions}
              onChange={setActiveOnc}
              labelSrOnly="Select oncology type"
            />

            <div className="h-[550px] overflow-y-auto pr-2">
              {oncologyCategories.map((category) => (
                <div key={category.type} className={activeOnc === category.type ? "block" : "hidden"}>
                  <div className="sticky top-0 bg-white z-10 py-3 border-b border-grey/20 mb-5">
                    <h3 className="text-xl font-medium">
                      <span className="text-grey">{category.field} – </span>
                      <span className="text-black">{category.type}</span>
                    </h3>
                  </div>

                  <div className="space-y-4 pb-8">
                    {category.items.map((item, idx) => (
                      <motion.div
                        key={idx}
                        className={styles.card.data("")}
                        variants={fadeIn}
                        initial="hidden"
                        animate="visible"
                      >
                        <div className="flex items-start justify-between mb-2 gap-2">
                          <div className="flex-1 min-w-0 mr-2">
                            <span className="text-purple font-helvetica-now">{item.isotope}</span>
                            <span className="text-black font-helvetica-now"> {item.name} </span>
                            {item.brandName && (item.url ? (
                              <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-primary-blue hover:underline">
                                ({item.brandName})
                              </a>
                            ) : (
                              <span className="text-primary-blue">({item.brandName})</span>
                            ))}
                          </div>
                          <span className="text-grey flex-shrink-0 text-right">{item.company}</span>
                        </div>
                        <div className="text-sm text-grey mt-1">{item.indication}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footnote */}
        <div className="text-left text-body-small text-grey md:my-8">
          <p>Last updated: June 2025</p>
          <p className="mt-1">
            Help us keep things accurate. If you notice any outdated or incorrect information,
            email us at <a href="mailto:info@firm.inc" className="text-primary-blue hover:underline">info@firm.inc</a>
          </p>
        </div>

      </div>
      
    </section>
  );
};

export default RadiopharmaceuticalsSection;
