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
        {/* Main grid container - Using exactly the same structure as LigandsAndTargets */}
        <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-12">
          {/* Content container with identical padding to LigandsAndTargets */}
          <div className="col-span-4 sm:col-span-8 md:col-span-12 lg:col-span-12 px-8 md:px-16 lg:px-24">
            {/* Title */}
            <div className="mb-8 w-full md:w-8/12">
              <h3 className="text-h4">
                Tumor targets by volume of studies and clinical stage
              </h3>
              <span className="text-body text-grey">Tumor-targets are emerging as promising clinical approaches that offer noninvasive, real-time diagnosis of tumour lesions and highly effective, safe treatments with strong antitumour efficacy. </span>
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
                        {/* Bottom Section */}
                        <div className="px-6 pb-6 flex flex-col justify-start items-start gap-3">
                          <h3 className="text-xl font-semibold self-stretch">
                            {target.name}
                          </h3>
                          <div className="self-stretch flex flex-col justify-start items-start gap-1">
                            {target.fullName && (
                              <span className="text-base text-black">
                                {target.fullName}
                              </span>
                            )}
                            <p className="text-sm text-gray-500 line-clamp-4">
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
                                <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800">
                                  <span className="text-xs font-medium">
                                    {target.companiesCount} Companies
                                  </span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="bg-white text-black p-0 rounded-md max-w-xs z-50 border border-light-grey shadow-none overflow-hidden" side="bottom" align="center">
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
                                <div className="px-3 py-2">
                                  <h4 className="text-sm text-gray-600 font-medium">{target.name}</h4>
                                  {target.fullName && <p className="text-base text-black mt-1">{target.fullName}</p>}
                                  {target.description && !target.description.startsWith('Placeholder description') && (
                                    <p className="text-xs mt-2 max-h-20 overflow-y-auto">{target.description}</p>
                                  )}
                                </div>
                              }
                            >
                              {target.name}
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
            <div className="mt-12 md:mt-16 border-t border-gray-200 pt-8 w-full">
              <div className="max-w-3xl mx-auto text-center">
                {/* Use dynamic text based on active tab */}
                <h4 className="text-sm text-gray-600 font-medium mb-2">
                  {getTabDisplayText()} by Target
                </h4>
                <p className="text-sm text-gray-600">
                  {/* Updated placeholder text to reflect different views */}
                  [Placeholder: Displaying {viewMode === 'grid' ? 'top 12' : 'all'} targets sorted by {activeTab === 'clinical' ? 'clinical trials' : getTabDisplayText().toLowerCase()}.
                  {viewMode === 'grid' ? ' Hover over badges for disease/company lists.' : ' Scroll to see all targets and hover over cells for details.'}
                  {apiData && !error && !isLoading && " Data loaded successfully."}
                  {error && !isLoading && " Displaying available sample data due to a loading error."} ]
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </TooltipProvider>
  );
};

export default TargetDisplay;