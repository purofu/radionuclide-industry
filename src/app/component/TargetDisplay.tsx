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

// --- Custom Table Components ---
const Table = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <table className={`w-full border-collapse ${className}`}>{children}</table>
);
const TableHeader = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <thead className={className}>{children}</thead>
);
const TableBody = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <tbody className={className}>{children}</tbody>
);
const TableRow = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <tr className={`border-b hover:bg-gray-50 ${className}`}>{children}</tr>
);
const TableHead = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <th className={`p-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-left border-r last:border-r-0 ${className}`}>{children}</th>
);
const TableCell = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <td className={`p-3 text-sm text-gray-700 border-r last:border-r-0 ${className}`}>{children}</td>
);

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
        const response = await fetch(
          "https://r-eco-52zl8.ondigitalocean.app/visualising",
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ApiData = await response.json();
        setApiData(data);
      } catch (err) {
        console.error("Error loading data:", err);
        setError(
            err instanceof Error ? `Failed to load data: ${err.message}. Displaying sample data.` : 'An unknown error occurred. Displaying sample data.'
        );
        setApiData(null); // Keep API data null on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Sample Fallback Data (Remains the same) ---
  const sampleTargets: TargetSummary[] = [
    {
        name: "PSMA",
        fullName: "Prostate-Specific Membrane Antigen",
        description: "PSMA is highly expressed in prostate cancer cells, making it a prime target for diagnostic imaging and targeted radionuclide therapy.",
        clinicalTrials: 74, phase1: 32, phase2: 27, phase3: 12, diseaseCount: 4, companiesCount: 12, diseases: ["Prostate Cancer", "Kidney Cancer", "Lung Cancer", "Thyroid Cancer"], companies: ["Company A", "Company B", "Company C", "Novartis", "Bayer", "GE", "Pfizer", "Janssen", "Sanofi", "Roche", "AstraZeneca", "Merck"]
    },
    {
        name: "FAP",
        fullName: "Fibroblast Activation Protein-α",
        description: "FAP expression under physiological conditions is very low in the majority of adult tissues. FAP is nevertheless expressed during embryonic development,[16] and in adults in pancreatic alpha cells[17] in multipotent bone marrow stromal cells (BM-MSC)[18] and uterine stroma.[19]",
        clinicalTrials: 60, phase1: 28, phase2: 22, phase3: 8, diseaseCount: 6, companiesCount: 9, diseases: ["Various Cancers", "Lung", "Breast", "Ovarian", "Pancreatic", "Colorectal"], companies: ["Company C", "Roche", "Boehringer", "Merck", "Pfizer", "GSK", "AbbVie", "Lilly", "Amgen"]
    },
    {
        name: "SSTR",
        fullName: "Somatostatin Receptor",
        description: "SSTRs are G protein-coupled receptors expressed in various tissues, notably overexpressed in many neuroendocrine tumors.",
        clinicalTrials: 31, phase1: 15, phase2: 10, phase3: 5, diseaseCount: 3, companiesCount: 8, diseases: ["Neuroendocrine Tumors", "Gastric", "Pancreatic"], companies: ["Company D", "Novartis", "Ipsen", "AAA", "Curium", "GE Healthcare", "Lantheus", "Siemens"]
    },
    {
        name: "CXCR4",
        fullName: "C-X-C Motif Chemokine Receptor 4",
        description: "CXCR4 is involved in chemotaxis and cell migration, playing roles in cancer metastasis and hematopoiesis.",
        clinicalTrials: 24, phase1: 14, phase2: 8, phase3: 2, diseaseCount: 5, companiesCount: 6, diseases: ["Hematologic Malignancies", "Leukemia", "Lymphoma", "Myeloma", "Stem Cell Mobilization"], companies: ["Company F", "Sanofi", "Pfizer", "BMS", "Takeda", "Amgen"]
    },
  ];

  // --- Data Processing & Sorting (Updated for New Structure) ---
  const getSortedTargets = (): TargetSummary[] => {
    if (!apiData || !apiData.target) {
        // Use sample data only if there was an error and sample data exists
      return error && sampleTargets.length > 0 ? sampleTargets : [];
    }

    const processedTargets = Object.entries(apiData.target)
        .map(([name, data]): TargetSummary => {
            // Access data using the new keys
            const totalData = data["total"];
            const phase1Data = data["phase_1"];
            const phase2Data = data["phase_2"];
            const phase3Data = data["phase_3"];

            const apiFullName = data.fullName;
            const apiDescription = data.description;
            // Fallback logic remains the same
            const sampleMatch = sampleTargets.find(st => st.name === name.toUpperCase());
            const placeholderFullName = `${name.toUpperCase()} Full Name`;
            const placeholderDescription = `Placeholder description for ${name.toUpperCase()}. More details needed.`;

            return {
                name: name.toUpperCase(),
                fullName: apiFullName ?? sampleMatch?.fullName ?? placeholderFullName,
                description: apiDescription ?? sampleMatch?.description ?? placeholderDescription,
                // Use 'total' for overall clinical trials count
                clinicalTrials: totalData?.study_counts?.all ?? 0,
                // Use specific phase keys for phase counts
                phase1: phase1Data?.study_counts?.all ?? 0,
                phase2: phase2Data?.study_counts?.all ?? 0,
                phase3: phase3Data?.study_counts?.all ?? 0,
                // Use 'total' for overall disease/company counts and lists
                diseaseCount: totalData?.diseases?.count ?? 0,
                companiesCount: totalData?.companies?.count ?? 0,
                diseases: totalData?.diseases?.list ?? [],
                companies: totalData?.companies?.list ?? [],
            };
        });

    // First sort all targets by the active tab criteria
    const allSortedTargets = processedTargets.sort((a, b) => {
      switch (activeTab) {
        case "clinical": return b.clinicalTrials - a.clinicalTrials;
        case "phase1": return b.phase1 - a.phase1;
        case "phase2": return b.phase2 - a.phase2;
        case "phase3": return b.phase3 - a.phase3;
        default: return b.clinicalTrials - a.clinicalTrials;
      }
    });
    
    return allSortedTargets;
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-black font-helvetica-now">
            Promising Molecular Targets
          </h2>

          {/* Controls: Tabs & View Toggle */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Tabs - Updated styling to match RadioisotopePeriodicDisplay */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              {(["clinical", "phase1", "phase2", "phase3"] as TabType[]).map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-md text-body-small font-helvetica-now transition-colors duration-150 ease-in-out ${activeTab === tab ? 'bg-black text-white' : 'bg-gray-200 text-black hover:bg-gray-400 hover:text-white'}`}
                  >
                    {tab === 'clinical' ? 'Clinical Trials' : getTabDisplayText()}
                  </button>
                ),
              )}
            </div>
            {/* View Mode Toggle - Remove shadow-sm */}
            <ToggleGroup
              value={viewMode}
              onValueChange={(value: string) => {
                if (value) setViewMode(value as ViewModeType);
              }}
              className="justify-center sm:justify-end"
            >
              <ToggleGroupItem value="grid" aria-label="Grid View">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" > <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor" /> <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor" /> <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor" /> <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor" /> </svg>
              </ToggleGroupItem>
              <ToggleGroupItem value="table" aria-label="Table View">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M3 5H21V7H3V5Z" fill="currentColor" /> <path d="M3 11H21V13H3V11Z" fill="currentColor" /> <path d="M3 17H21V19H3V17Z" fill="currentColor" /> </svg>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center p-10 text-gray-500"><p>Loading target data...</p></div>
          )}

          {/* Error Message */}
          {error && !isLoading && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md text-center">
              <p>{error}</p>
            </div>
          )}

          {/* ---- GRID VIEW ---- */}
          {!isLoading && viewMode === "grid" && getGridTargets().length > 0 && (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {getGridTargets().map((target) => {
                 const displayValue = getDisplayValue(target);
                 // Updated label logic for consistency
                 const displayLabel = `${getTabDisplayText().toLowerCase()} trials`;

                 return (
                     <div
                       key={target.name}
                       className="h-full bg-white rounded outline outline-1 outline-offset-[-1px] outline-gray-200 flex flex-col justify-between group transition-shadow duration-150 ease-in-out overflow-hidden"
                     >
                       {/* Top Section */}
                       <div className="px-6 pt-12 pb-4 text-right">
                           <span className="text-black text-7xl lg:text-8xl font-medium font-helvetica-now leading-tight align-baseline">{displayValue}</span>
                           <span className="block text-black text-xs md:text-sm font-medium font-helvetica-now leading-none mt-1">{displayLabel}</span>
                       </div>
                       {/* Middle Section Spacer */}
                        <div className="flex-grow px-6 min-h-[50px]"></div>
                       {/* Bottom Section */}
                       <div className="px-6 pb-6 flex flex-col justify-start items-start gap-3">
                         <h3 className="self-stretch text-black text-4xl md:text-5xl font-medium font-helvetica-now leading-tight">
                           {target.name}
                         </h3>
                         <div className="self-stretch flex flex-col justify-start items-start gap-1">
                           {target.fullName && (
                             <span className="text-black text-lg font-bold font-helvetica-now leading-tight">
                               {target.fullName}
                             </span>
                           )}
                           <p className="text-black text-sm font-medium font-helvetica-now leading-snug line-clamp-4">
                             {target.description || "No description available."}
                           </p>
                         </div>
                         {/* Badges with Individual Tooltips */}
                         <div className="flex flex-wrap justify-start items-start gap-2 mt-2">
                           {/* Disease Badge */}
                           <Tooltip>
                             <TooltipTrigger asChild>
                               <div className="px-3 py-1 bg-light-diagnostic rounded-full flex justify-center items-center gap-1.5 cursor-help">
                                 <span className="text-black text-xs sm:text-sm font-medium font-helvetica-now leading-none">
                                   {target.diseaseCount} Disease Types
                                 </span>
                               </div>
                             </TooltipTrigger>
                             <TooltipContent className="bg-white text-black p-0 rounded-md max-w-xs z-50 border border-light-grey shadow-none overflow-hidden" side="bottom" align="center">
                               {/* Updated tooltip format - Similar to RadioisotopePeriodicDisplay */}
                               <div className="w-full">
                                 <ul className="max-h-40 overflow-y-auto w-full">
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
                                 <div className="px-3 py-1 bg-light-grey rounded-full flex justify-center items-center gap-1.5 cursor-help">
                                   <span className="text-black text-xs sm:text-sm font-medium font-helvetica-now leading-none">
                                     {target.companiesCount} Companies
                                   </span>
                                 </div>
                               </TooltipTrigger>
                               <TooltipContent className="bg-white text-black p-0 rounded-md max-w-xs z-50 border border-light-grey shadow-none overflow-hidden" side="bottom" align="center">
                                 {/* Updated tooltip format - Similar to RadioisotopePeriodicDisplay */}
                                 <div className="w-full">
                                   <ul className="max-h-40 overflow-y-auto w-full">
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
          )}

          {/* ---- TABLE VIEW ---- */}
          {!isLoading && viewMode === "table" && targetsToDisplay.length > 0 && (
            <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
              <div className="max-h-[600px] overflow-y-auto">
                <Table>
                  <TableHeader className="bg-gray-50 sticky top-0 z-10">
                    <TableRow>
                      <TableHead className="text-left pl-4">Target</TableHead>
                      <TableHead className="text-center">Clinical Trials</TableHead>
                      <TableHead className="text-center">Phase 1</TableHead>
                      <TableHead className="text-center">Phase 2</TableHead>
                      <TableHead className="text-center">Phase 3</TableHead>
                      <TableHead className="text-center">Diseases</TableHead>
                      <TableHead className="text-center pr-4">Companies</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="bg-white divide-y divide-gray-200">
                    {targetsToDisplay.map((target) => {
                      return (
                        <TableRow key={target.name} className="hover:bg-gray-50">
                          <TableCell className="font-medium text-left pl-4">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help">{target.name}</span>
                              </TooltipTrigger>
                              <TooltipContent className="bg-white text-black p-0 rounded-md max-w-xs z-50 border border-light-grey shadow-none overflow-hidden" side="top" align="center">
                                <div className="px-3 py-2">
                                  <h4 className="font-semibold">{target.name}</h4>
                                  {target.fullName && <p className="text-sm mt-1">{target.fullName}</p>}
                                  {target.description && !target.description.startsWith('Placeholder description') && (
                                    <p className="text-xs mt-2 max-h-20 overflow-y-auto">{target.description}</p>
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell className="text-center">{target.clinicalTrials}</TableCell>
                          <TableCell className="text-center">{target.phase1}</TableCell>
                          <TableCell className="text-center">{target.phase2}</TableCell>
                          <TableCell className="text-center">{target.phase3}</TableCell>
                          <TableCell className="text-center">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help">{target.diseaseCount}</span>
                              </TooltipTrigger>
                              <TooltipContent className="bg-white text-black p-0 rounded-md max-w-xs z-50 border border-light-grey shadow-none overflow-hidden" side="top" align="center">
                                <div className="w-full">
                                  <ul className="max-h-40 overflow-y-auto w-full">
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
                          </TableCell>
                          <TableCell className="text-center pr-4">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help">{target.companiesCount}</span>
                              </TooltipTrigger>
                              <TooltipContent className="bg-white text-black p-0 rounded-md max-w-xs z-50 border border-light-grey shadow-none overflow-hidden" side="top" align="center">
                                <div className="w-full">
                                  <ul className="max-h-40 overflow-y-auto w-full">
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
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* No Data Message */}
          {!isLoading && targetsToDisplay.length === 0 && (
             <div className="text-center p-10 text-gray-500">
               <p>
                 {error
                   ? "Sample data is currently unavailable due to a loading error."
                   // Updated message slightly
                   : "No target data found or API returned empty target list."}
               </p>
             </div>
           )}

          {/* Placeholder Summary Text */}
          <div className="mt-12 md:mt-16 border-t border-gray-200 pt-8">
            <div className="max-w-3xl mx-auto text-center">
               {/* Use dynamic text based on active tab */}
              <h4 className="text-lg font-semibold mb-2 text-black font-helvetica-now">{getTabDisplayText()} by Target</h4>
              <p className="text-sm text-gray-600">
                 {/* Updated placeholder text to reflect different views */}
                [Placeholder: Displaying {viewMode === 'grid' ? 'top 12' : 'all'} targets sorted by {activeTab === 'clinical' ? 'clinical trials' : getTabDisplayText().toLowerCase()}.
                {viewMode === 'grid' ? ' Hover over badges for disease/company lists.' : ' Scroll to see all targets and hover over cells for details.'}
                 {apiData && !error && !isLoading && " Data loaded successfully."}
                 {error && !isLoading && " Displaying available sample data due to a loading error."} ]
              </p>
            </div>
          </div>

        </div> {/* End Container */}
      </section>
    </TooltipProvider>
  );
};

export default TargetDisplay;