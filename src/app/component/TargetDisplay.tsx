// components/TargetDisplay.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button"; // Assuming this path is correct
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Assuming this path is correct
import { Tabs, GridIcon, TableIcon } from "@/components/ui"; // Import our new Tabs component
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell, 
  TableWithTooltips,
  TooltipList
} from "@/components/ui/table";

// --- Custom Toggle Components ---
// Define an interface for ToggleGroupItem props
interface ToggleGroupItemProps {
  children: React.ReactNode;
  value: string;
  className?: string;
  "aria-label"?: string;
  isActive?: boolean;
  onClick?: () => void;
}

const ToggleGroup = ({
  children,
  value,
  onValueChange,
  className = "",
}: {
  children: React.ReactNode,
  value?: string,
  onValueChange?: (value: string) => void,
  className?: string
}) => {
  const handleChildClick = (childValue: string) => {
    if (onValueChange) {
        onValueChange(childValue);
    }
  };

  return (
    <div className={`inline-flex rounded-md ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // Correctly type the child element
          const typedChild = child as React.ReactElement<ToggleGroupItemProps>;
          return React.cloneElement(typedChild, {
            isActive: typedChild.props.value === value,
            onClick: () => handleChildClick(typedChild.props.value),
          });
        }
        return child;
      })}
    </div>
  );
};

const ToggleGroupItem = ({
  children,
  value,
  className = "",
  "aria-label": ariaLabel,
  isActive,
  onClick,
}: ToggleGroupItemProps) => {
  return (
    <button
      type="button"
      className={`relative inline-flex items-center px-3 py-1.5 text-sm font-medium border border-gray-300 ${isActive ? 'bg-black text-white z-10 ring-1 ring-black' : 'bg-white text-gray-700 hover:bg-gray-50'} first:rounded-l-md last:rounded-r-md focus:z-10 focus:outline-none focus:ring-1 focus:ring-black ${className}`}
      aria-label={ariaLabel}
      aria-pressed={isActive}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// --- Interfaces for NEW API Structure ---
interface StudyCounts {
  all: number;
  diagnostic: number; // Kept for completeness, not used in current display logic
  therapy: number;  // Kept for completeness, not used in current display logic
}

interface DetailEntry {
  count: number;
  list: string[];
}

interface PhaseData {
  study_counts: StudyCounts;
  nct_ids?: DetailEntry; // Added from new structure
  diseases: DetailEntry;
  companies: DetailEntry;
}

interface TargetSpecificData {
  // Updated keys based on the new structure
  total?: PhaseData;
  phase_1?: PhaseData;
  phase_2?: PhaseData;
  phase_3?: PhaseData;
  phase_other?: PhaseData; // Added phase_other
  // Potential API fields (kept from original for flexibility)
  fullName?: string;
  description?: string;
}

interface ApiData {
    isotope?: { [key: string]: any };
    target?: { [key: string]: TargetSpecificData };
    companies?: { [key: string]: any };
    metadata?: {
        total_trials_processed?: number;
    };
}

// --- Interface for Processed Data (Remains the same conceptually) ---
interface TargetSummary {
  name: string;
  fullName?: string;
  description?: string;
  clinicalTrials: number; // Represents the 'total' count now
  phase1: number;
  phase2: number;
  phase3: number;
  diseaseCount: number; // Represents count from 'total'
  companiesCount: number; // Represents count from 'total'
  diseases: string[]; // Represents list from 'total'
  companies: string[]; // Represents list from 'total'
}

// Interface for Original Tooltip Content Data (Alias)
type TargetTooltipData = TargetSummary;

// Tab/View Types (Remain the same)
type TabType = "clinical" | "phase1" | "phase2" | "phase3";
type ViewModeType = "grid" | "table";

// --- Main Component ---
const TargetDisplay = () => {
  const [apiData, setApiData] = useState<ApiData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("clinical");
  const [viewMode, setViewMode] = useState<ViewModeType>("grid");

  // --- Data Fetching ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Force an error to use sample data instead
        throw new Error("Using sample data with updated GLUCOSE_TRANSPORT and NET_TRANSPORTER");
        
        // Original API fetch code (commented out to use sample data)
        /*
        const response = await fetch(
          "https://r-eco-52zl8.ondigitalocean.app/visualising",
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ApiData = await response.json();
        setApiData(data);
        */
      } catch (err) {
        console.error("Error loading data:", err);
        setError(
            err instanceof Error ? `Sample data mode active: ${err.message}` : 'An unknown error occurred. Displaying sample data.'
        );
        setApiData(null); // Keep API data null on error to use sample data
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Add a key to force re-render when sample data changes
  useEffect(() => {
    // Force a re-render to ensure sample data changes are reflected
    // Use a slightly longer timeout to ensure the update takes effect
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 300);
  }, []);

  // --- Sample Fallback Data with FINAL CORRECTED NAMES ---
  const sampleTargets: TargetSummary[] = [
    {
        name: "PSMA",
        fullName: "Prostate‑Specific Membrane Antigen",
        description: "PSMA is a transmembrane glycoprotein that is strongly overexpressed on prostate cancer cells compared to most normal tissues (with only low-level expression in tissues like the kidneys and salivary glands). This selective expression and rapid internalization upon ligand binding make PSMA an excellent target for radionuclide therapy agents such as ¹⁷⁷Lu‑PSMA‑617, which deliver targeted cytotoxic radiation directly to prostate cancer lesions [1,2].",
        clinicalTrials: 74, phase1: 32, phase2: 27, phase3: 12, diseaseCount: 4, companiesCount: 12, diseases: ["Prostate Cancer", "Kidney Cancer", "Lung Cancer", "Thyroid Cancer"], companies: ["Company A", "Company B", "Company C", "Novartis", "Bayer", "GE", "Pfizer", "Janssen", "Sanofi", "Roche", "AstraZeneca", "Merck"]
    },
    {
        name: "GLUT1",
        fullName: "GLUCOSE_TRANSPORT",
        description: "Glucose transporters, particularly GLUT1, are overexpressed in many types of cancer as the malignant cells rely heavily on glycolysis (the Warburg effect). This differential expression is exploited in both diagnostic imaging (e.g., FDG‑PET) and, potentially, in therapeutic applications that target the increased glucose uptake in tumor cells [3,4].",
        clinicalTrials: 60, phase1: 28, phase2: 22, phase3: 8, diseaseCount: 6, companiesCount: 9, diseases: ["Various Cancers", "Lung", "Breast", "Ovarian", "Pancreatic", "Colorectal"], companies: ["Company C", "Roche", "Boehringer", "Merck", "Pfizer", "GSK", "AbbVie", "Lilly", "Amgen"]
    },
    {
        name: "SSTR",
        fullName: "Somatostatin Receptors",
        description: "Somatostatin receptors (particularly subtype 2, SSTR2) are overexpressed in many neuroendocrine tumors. Radiolabeled somatostatin analogs (for example, ¹⁷⁷Lu‑DOTATATE) bind with high affinity to these receptors, facilitating receptor-mediated internalization. This selective targeting delivers radiation directly to the tumor cells while largely sparing normal tissue [7,8].",
        clinicalTrials: 31, phase1: 15, phase2: 10, phase3: 5, diseaseCount: 3, companiesCount: 8, diseases: ["Neuroendocrine Tumors", "Gastric", "Pancreatic"], companies: ["Company D", "Novartis", "Ipsen", "AAA", "Curium", "GE Healthcare", "Lantheus", "Siemens"]
    },
    {
        name: "FAP",
        fullName: "Fibroblast Activation Protein",
        description: "Fibroblast Activation Protein is selectively expressed on cancer‐associated fibroblasts within the stroma of various epithelial tumors, while its expression is minimal in normal adult tissues. Radiolabeled FAP inhibitors can accumulate in the tumor microenvironment, allowing for effective imaging and therapeutic radiation delivery that also disrupts the tumor-supporting stroma [9,10].",
        clinicalTrials: 24, phase1: 14, phase2: 8, phase3: 2, diseaseCount: 5, companiesCount: 6, diseases: ["Hematologic Malignancies", "Leukemia", "Lymphoma", "Myeloma", "Solid Tumors"], companies: ["Company F", "Sanofi", "Pfizer", "BMS", "Takeda", "Amgen"]
    },
    {
        name: "BONE",
        fullName: "Bone‑Targeted Radiopharmaceuticals",
        description: "While \"BONE\" is not a conventional molecular target, radiopharmaceuticals can exploit the high affinity for hydroxyapatite in bone—especially within areas of high osteoblastic activity (as seen in bone metastases from cancers like prostate or breast cancer). Agents such as ²²³Ra dichloride or ¹⁵³Sm‑EDTMP localize to these sites to deliver therapeutic radiation and alleviate skeletal complications [5,6].",
        clinicalTrials: 42, phase1: 18, phase2: 16, phase3: 7, diseaseCount: 4, companiesCount: 7, diseases: ["Bone Metastases", "Prostate Cancer", "Breast Cancer", "Multiple Myeloma"], companies: ["Bayer", "Novartis", "GE Healthcare", "Lantheus", "Curium", "Orano Med", "Q BioMed"]
    },
    {
        name: "PRRNT",
        fullName: "Peptide Receptor Radionuclide Therapy",
        description: "Although PRRNT is a therapeutic strategy rather than a single molecular target, it refers to the use of radiolabeled peptides that bind specific receptors (such as SSTR in neuroendocrine tumors). Its effectiveness arises from the high density and selective internalization of these receptors by tumor cells, ensuring that the radioactive payload is concentrated within the tumor while minimizing systemic toxicity [11,12].",
        clinicalTrials: 36, phase1: 16, phase2: 14, phase3: 6, diseaseCount: 3, companiesCount: 5, diseases: ["Neuroendocrine Tumors", "Pancreatic NET", "Gastroenteropancreatic NET"], companies: ["Novartis", "Advanced Accelerator Applications", "Ipsen", "ITM", "Telix Pharmaceuticals"]
    },
    {
        name: "THYROID",
        fullName: "Sodium/Iodide Symporter (NIS)",
        description: "The sodium/iodide symporter (NIS) is predominantly expressed in thyroid follicular cells, where it facilitates the uptake of iodide. This characteristic is exploited in radioiodine (I‑131) therapy, which is used to treat both benign thyroid disorders (such as hyperthyroidism) and thyroid cancer by selectively ablating thyroid tissue [13,14].",
        clinicalTrials: 28, phase1: 10, phase2: 12, phase3: 6, diseaseCount: 2, companiesCount: 4, diseases: ["Thyroid Cancer", "Hyperthyroidism"], companies: ["Jubilant DraxImage", "Curium", "GE Healthcare", "Lantheus"]
    },
    {
        name: "NET",
        fullName: "NET_TRANSPORTER",
        description: "The norepinephrine transporter is overexpressed in certain neuroendocrine tumors including neuroblastoma and pheochromocytoma. Radiolabeled norepinephrine analogs (such as MIBG) are taken up via this transporter, permitting selective irradiation of tumor cells that naturally overexpress this protein [15,16].",
        clinicalTrials: 22, phase1: 12, phase2: 8, phase3: 2, diseaseCount: 3, companiesCount: 4, diseases: ["Neuroblastoma", "Pheochromocytoma", "Paraganglioma"], companies: ["Progenics", "GE Healthcare", "Lantheus", "Jubilant DraxImage"]
    },
    {
        name: "CD20",
        fullName: "CD20",
        description: "CD20 is a surface protein found on B‑lymphocytes and is robustly expressed in many B‑cell non‑Hodgkin's lymphomas. Because of its consistent expression on malignant B‑cells and limited expression in other tissues, radiolabeled anti‑CD20 antibodies (for example, ⁹⁰Y‑ibritumomab tiuxetan) provide a targeted approach for delivering cytotoxic radiation to lymphomas [17,18].",
        clinicalTrials: 30, phase1: 14, phase2: 12, phase3: 4, diseaseCount: 3, companiesCount: 5, diseases: ["Non-Hodgkin's Lymphoma", "B-cell Lymphoma", "Follicular Lymphoma"], companies: ["Spectrum Pharmaceuticals", "Novartis", "Roche", "Bayer", "Nordic Nanovector"]
    },
    {
        name: "MIBG",
        fullName: "Metaiodobenzylguanidine",
        description: "MIBG is a norepinephrine analog that is selectively taken up by cells expressing the norepinephrine transporter. When labeled with radioactive iodine (typically I‑131), MIBG can be used both for imaging and for delivering therapeutic radiation to tumors such as neuroblastoma and pheochromocytoma, while sparing most non‑target tissues [19,20].",
        clinicalTrials: 25, phase1: 12, phase2: 10, phase3: 3, diseaseCount: 3, companiesCount: 4, diseases: ["Neuroblastoma", "Pheochromocytoma", "Paraganglioma"], companies: ["Progenics", "GE Healthcare", "Jubilant DraxImage", "Lantheus"]
    },
    {
        name: "HER2",
        fullName: "Human Epidermal Growth Factor Receptor 2",
        description: "HER2 is a receptor tyrosine kinase that is overexpressed in a subset of breast cancers and other malignancies associated with aggressive tumor behavior. Radiolabeled HER2‑targeted antibodies (often derived from trastuzumab) allow for the precise delivery of radiation to HER2‑positive tumors, improving local control while minimizing toxicity to healthy tissue [21,22].",
        clinicalTrials: 32, phase1: 16, phase2: 12, phase3: 4, diseaseCount: 4, companiesCount: 6, diseases: ["Breast Cancer", "Gastric Cancer", "Esophageal Cancer", "Ovarian Cancer"], companies: ["Roche", "Novartis", "AstraZeneca", "Seagen", "Merck", "Daiichi Sankyo"]
    },
    {
        name: "INTEGRIN",
        fullName: "Integrins (e.g., αvβ3)",
        description: "Integrins, especially the αvβ3 subtype, are expressed on activated endothelial cells during angiogenesis and on the surface of certain tumor cells. Radiolabeled peptides incorporating the RGD (arginine–glycine–aspartate) motif bind to αvβ3 integrins, thereby targeting both tumor cells and the tumor vasculature, which can disrupt blood supply and promote cell death [23,24].",
        clinicalTrials: 20, phase1: 12, phase2: 7, phase3: 1, diseaseCount: 5, companiesCount: 4, diseases: ["Glioblastoma", "Melanoma", "Breast Cancer", "Lung Cancer", "Colorectal Cancer"], companies: ["Merck", "Novartis", "3B Pharmaceuticals", "Piramal Imaging"]
    }
  ];

  // Modified data processing logic to ALWAYS use sample data for demo purposes
  const getSortedTargets = (): TargetSummary[] => {
    // Always use sample data regardless of API state
    return sampleTargets;
  };

  // Function to get targets for grid view (top 12 by clinical trials)
  const getGridTargets = (): TargetSummary[] => {
    const allTargets = getSortedTargets();
    
    // For grid, always get top 12 by clinical trials first
    const top12ByClinical = [...allTargets].sort((a, b) => b.clinicalTrials - a.clinicalTrials).slice(0, 12);
    
    // Then sort those 12 according to active tab
    if (activeTab !== "clinical") {
      return top12ByClinical.sort((a, b) => {
        switch (activeTab) {
          case "phase1": return b.phase1 - a.phase1;
          case "phase2": return b.phase2 - a.phase2;
          case "phase3": return b.phase3 - a.phase3;
          default: return 0;
        }
      });
    }
    
    return top12ByClinical;
  };

  // --- Helper Functions (No changes needed here) ---
  const getDisplayValue = (target: TargetSummary): number => {
    switch (activeTab) {
      case "clinical": return target.clinicalTrials;
      case "phase1": return target.phase1;
      case "phase2": return target.phase2;
      case "phase3": return target.phase3;
      default: return target.clinicalTrials;
    }
  };

  const getTabDisplayText = (): string => {
    switch (activeTab) {
      case "clinical": return "Clinical Trials";
      case "phase1": return "Phase 1";
      case "phase2": return "Phase 2";
      case "phase3": return "Phase 3";
      default: return "Clinical Trials";
    }
  };

  // Prepare original tooltip data (used only for table view now) - No change needed
  const prepareTargetTooltipData = (target: TargetSummary): TargetTooltipData => {
    return target;
  };

  // Get data ready for display
  const targetsToDisplay = getSortedTargets();

  // --- Render Component ---
  return (
    <TooltipProvider delayDuration={100}>
      <section className="w-full bg-white py-12 md:py-16">
        {/* Main grid container - Using exactly the same structure as LigandsAndTargets */}
        <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-12">
          {/* Content container with identical padding to LigandsAndTargets */}
          <div className="col-span-4 sm:col-span-8 md:col-span-12 lg:col-span-12 px-8 md:px-16 lg:px-24">
            {/* Title */}
            <div className="mb-8 w-full md:w-8/12">
              <h3 className="text-h4 mb-4">
                Tumor targets by total volume of studies and clinical stage
              </h3>
              <span className="text-body text-grey">Tumor targets are emerging as promising clinical approaches that offer noninvasive, real-time diagnosis of tumor lesions and highly effective, safe treatments with strong antitumor efficacy. </span>
            </div>
            
            {/* Controls: Tabs & View Toggle using the new Tabs component with fixed labels */}
            <Tabs 
              titleTabs={[
                { id: 'clinical', label: 'Clinical Trials' },
                { id: 'phase1', label: 'Phase 1' },
                { id: 'phase2', label: 'Phase 2' },
                { id: 'phase3', label: 'Phase 3' },
              ]}
              iconTabs={[
                { id: 'grid', icon: <GridIcon />, ariaLabel: 'Grid View' },
                { id: 'table', icon: <TableIcon />, ariaLabel: 'Table View' },
              ]}
              defaultTitleTab={activeTab}
              defaultIconTab={viewMode}
              onTitleTabChange={(tabId) => setActiveTab(tabId as TabType)}
              onIconTabChange={(tabId) => setViewMode(tabId as ViewModeType)}
              className="mb-8"
            />

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center p-12 text-center text-gray-500">
                <p>Loading target data...</p>
              </div>
            )}

            {/* Error Message */}
            {error && !isLoading && (
              <div className="p-6 bg-red-50 text-red-600 rounded-md mb-6">
                <p>{error}</p>
              </div>
            )}

            {/* ---- GRID VIEW ---- */}
            {!isLoading && viewMode === "grid" && getGridTargets().length > 0 && (
              <div className="overflow-x-auto pb-4">
                <div className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {getGridTargets().map((target) => {
                    const displayValue = getDisplayValue(target);

                    return (
                      <div
                        key={target.name}
                        className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow h-full flex flex-col justify-between overflow-hidden min-w-[280px] w-[280px] md:w-auto md:min-w-0"
                      >
                        {/* Top Section */}
                        <div className="px-6 pt-12 pb-4 text-right">
                          <span className="text-5xl font-bold align-baseline">{displayValue}</span>
                          <span className="text-sm text-gray-500 uppercase tracking-wide block mt-1">Total Clinical Trials</span>
                        </div>
                        {/* Middle Section with Placeholder Image */}
                        <div className="flex-grow px-6 flex justify-center items-center">
                          <img 
                            src="/protein.png" 
                            alt={`${target.name} structure visualization`} 
                            className="w-full h-auto object-cover my-4"
                          />
                        </div>
                        {/* Bottom Section - Increased height for text visibility */}
                        <div className="px-6 pb-6 flex flex-col justify-start items-start gap-3">
                          <h3 className="text-xl font-semibold self-stretch">
                            {target.name}
                          </h3>
                          <div className="self-stretch flex flex-col justify-start items-start gap-1">
                            {target.fullName && (
                              <span className="text-base text-black break-words w-full">
                                {target.fullName}
                              </span>
                            )}
                            {/* Removed line-clamp-4 to show full text */}
                            <p className="text-sm text-gray-500 w-full">
                              {target.description || "No description available."}
                            </p>
                          </div>
                          {/* Badges with Individual Tooltips */}
                          <div className="flex flex-wrap justify-start items-start gap-2 mt-2">
                            {/* Disease Badge */}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800">
                                  <span className="text-xs font-body">
                                    {target.diseaseCount} Disease Types
                                  </span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="bg-white text-black p-0 rounded-md max-w-xs z-50 border border-light-grey shadow-none overflow-hidden" side="bottom" align="center">
                                <div className="w-full">
                                  <ul className="max-h-60 overflow-y-auto w-full">
                                    {target.diseases.length > 0 ? (
                                      target.diseases.map((disease, i) => (
                                        <li key={i} className="w-full">
                                          <div className="px-3 py-2 text-body-small">{disease}</div>
                                          {i < target.diseases.length - 1 && (
                                            <div className="w-full border-b border-light-grey"></div>
                                          )}
                                        </li>
                                      ))
                                    ) : (
                                      <li>
                                        <div className="px-3 py-2 text-body-small text-grey">No specific diseases listed</div>
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                            {/* Company Badge */}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800">
                                  <span className="text-xs font-medium">
                                    {target.companiesCount} Companies
                                  </span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="bg-white text-black p-0 rounded-md max-w-xs z-50 border border-light-grey shadow-none overflow-hidden" side="bottom" align="center">
                                <div className="w-full">
                                  <ul className="max-h-60 overflow-y-auto w-full">
                                    {target.companies.length > 0 ? (
                                      target.companies.map((company, i) => (
                                        <li key={i} className="w-full">
                                          <div className="px-3 py-2 text-body-small">{company}</div>
                                          {i < target.companies.length - 1 && (
                                            <div className="w-full border-b border-light-grey"></div>
                                          )}
                                        </li>
                                      ))
                                    ) : (
                                      <li>
                                        <div className="px-3 py-2 text-body-small text-grey">No specific companies listed</div>
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ---- TABLE VIEW ---- */}
            {!isLoading && viewMode === "table" && targetsToDisplay.length > 0 && (
              <div className="overflow-x-auto w-full">
                <TableWithTooltips className="mb-6 w-full">
                  <Table>
                    <TableHeader className="sticky top-0 z-20">
                      <TableRow>
                        <TableHead align="left" className="pl-4">Target</TableHead>
                        <TableHead align="center">Clinical Trials</TableHead>
                        <TableHead align="center">Phase 1</TableHead>
                        <TableHead align="center">Phase 2</TableHead>
                        <TableHead align="center">Phase 3</TableHead>
                        <TableHead align="center">Diseases</TableHead>
                        <TableHead align="center" className="pr-4">Companies</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {targetsToDisplay.map((target) => {
                        return (
                          <TableRow key={target.name}>
                            <TableCell align="left" className="pl-4"
                              hasTooltip={true}
                              tooltipContent={
                                <div className="px-3 py-2 max-w-md">
                                  <h4 className="text-sm text-gray-600 font-medium">{target.name}</h4>
                                  {target.fullName && <p className="text-base text-black mt-1 break-words">{target.fullName}</p>}
                                  
                                  {/* Added protein image to tooltip */}
                                  <div className="mt-3 mb-2 flex justify-center">
                                    <img 
                                      src="/protein.png" 
                                      alt={`${target.name} structure visualization`} 
                                      className="w-full h-auto object-contain max-h-40"
                                    />
                                  </div>
                                  
                                  {target.description && !target.description.startsWith('Placeholder description') && (
                                    <p className="text-xs mt-2 max-h-48 overflow-y-auto">{target.description}</p>
                                  )}
                                </div>
                              }
                            >
                              <div className="font-medium">{target.name}</div>
                              <div className="text-xs text-gray-500 truncate max-w-[150px]">{target.fullName}</div>
                            </TableCell>
                            <TableCell align="center">
                              {target.clinicalTrials}
                            </TableCell>
                            <TableCell align="center">
                              {target.phase1}
                            </TableCell>
                            <TableCell align="center">
                              {target.phase2}
                            </TableCell>
                            <TableCell align="center">
                              {target.phase3}
                            </TableCell>
                            <TableCell align="center" 
                              hasTooltip={target.diseaseCount > 0}
                              tooltipContent={
                                <TooltipList items={target.diseases} />
                              }
                            >
                              {target.diseaseCount}
                            </TableCell>
                            <TableCell align="center" className="pr-4" 
                              hasTooltip={target.companiesCount > 0}
                              tooltipContent={
                                <TooltipList items={target.companies} />
                              }
                            >
                              {target.companiesCount}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableWithTooltips>
              </div>
            )}

            {/* No Data Message */}
            {!isLoading && targetsToDisplay.length === 0 && (
              <div className="text-center p-8 bg-gray-50 rounded-lg w-full">
                <p>
                  {error
                    ? "Sample data is currently unavailable due to a loading error."
                    : "No target data found or API returned empty target list."}
                </p>
              </div>
            )}

            {/* Placeholder Summary Text */}
            
            <div className="mt-12 md:mt-16 border-ts">               
               <div className="text-left text-body-small font-helvetica-now text-grey md:my-8">
                  <p>Last updated: April, 2025</p>
                  <p className="mt-1">
                  Help us keep things accurate. If you notice any outdated or incorrect information, email us at <a href="mailto:info@firm.inc" className="text-primary-blue hover:underline">info@firm.inc</a>
                  </p>
               </div>
               
               {/* Divider before footer text - using config border color */}
               <hr className="border-t border-light-grey w-full my-12 md:my-16" />
             </div>
            </div>
          </div>
        
      </section>
    </TooltipProvider>
  );
};

export default TargetDisplay;