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
  <th className={`p-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-left ${className}`}>{children}</th>
);
const TableCell = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <td className={`p-3 text-sm text-gray-700 ${className}`}>{children}</td>
);

// --- Custom Toggle Components ---
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
    <div className={`inline-flex rounded-md shadow-sm ${className}`}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            isActive: child.props.value === value,
            onClick: () => handleChildClick(child.props.value),
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
}: {
  children: React.ReactNode,
  value: string,
  className?: string,
  "aria-label"?: string,
  isActive?: boolean,
  onClick?: () => void,
}) => {
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

    // Sorting logic remains the same, using the processed TargetSummary fields
    return processedTargets.sort((a, b) => {
        switch (activeTab) {
            case "clinical": return b.clinicalTrials - a.clinicalTrials;
            case "phase1": return b.phase1 - a.phase1;
            case "phase2": return b.phase2 - a.phase2;
            case "phase3": return b.phase3 - a.phase3;
            default: return b.clinicalTrials - a.clinicalTrials;
        }
    });
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
      case "phase1": return "Phase 1 Trials";
      case "phase2": return "Phase 2 Trials";
      case "phase3": return "Phase 3 Trials";
      default: return "Clinical Trials";
    }
  };

  // Prepare original tooltip data (used only for table view now) - No change needed
  const prepareTargetTooltipData = (target: TargetSummary): TargetTooltipData => {
    return target;
  };

  // Get data ready for display
  const targetsToDisplay = getSortedTargets();

  // --- Render Component (Minor label update for clarity) ---
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
            {/* Tabs */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              {(["clinical", "phase1", "phase2", "phase3"] as TabType[]).map(
                (tab) => (
                  <Button
                    key={tab}
                    variant={activeTab === tab ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab(tab)}
                    className={`${activeTab === tab ? 'bg-black text-white hover:bg-gray-800' : 'text-black border-gray-300 hover:bg-gray-100'}`}
                  >
                    {/* Display "Total" instead of "Clinical" for the first tab if preferred */}
                    {tab === 'clinical' ? 'Total Trials' : getTabDisplayText()}
                  </Button>
                ),
              )}
            </div>
            {/* View Mode Toggle */}
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
          {!isLoading && viewMode === "grid" && targetsToDisplay.length > 0 && (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
               {targetsToDisplay.map((target) => {
                 const displayValue = getDisplayValue(target);
                 // Updated label logic slightly for clarity
                 const displayLabel = `${activeTab === 'clinical' ? 'total ' : ''}${getTabDisplayText().replace(' Trials', '').toLowerCase()} trials`;

                 return (
                     <div
                       key={target.name}
                       className="h-full bg-white rounded outline outline-1 outline-offset-[-1px] outline-gray-200 flex flex-col justify-between group transition-shadow duration-150 ease-in-out hover:shadow-lg overflow-hidden"
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
                             <TooltipContent className="max-w-xs w-auto p-3 bg-black text-white rounded-md shadow-lg" side="bottom" align="center">
                                {/* ListTooltipContent remains the same */}
                               <ListTooltipContent items={target.diseases} label="Diseases" />
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
                              <TooltipContent className="max-w-xs w-auto p-3 bg-black text-white rounded-md shadow-lg" side="bottom" align="center">
                                {/* ListTooltipContent remains the same */}
                                <ListTooltipContent items={target.companies} label="Companies" />
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
            <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="text-left pl-4">Target</TableHead>
                    {/* Changed Header for clarity */}
                    <TableHead className="text-center">Total Trials</TableHead>
                    <TableHead className="text-center">Phase 1</TableHead>
                    <TableHead className="text-center">Phase 2</TableHead>
                    <TableHead className="text-center">Phase 3</TableHead>
                    <TableHead className="text-center">Diseases (Count)</TableHead>
                    <TableHead className="text-center pr-4">Companies (Count)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="bg-white divide-y divide-gray-200">
                  {targetsToDisplay.map((target) => {
                      // Tooltip data preparation and display logic remain the same
                      const tooltipData = prepareTargetTooltipData(target);
                      return (
                        <Tooltip key={target.name}>
                            <TooltipTrigger asChild>
                                <TableRow className="cursor-help">
                                  <TableCell className="font-medium text-left pl-4">{target.name}</TableCell>
                                  <TableCell className="text-center">{target.clinicalTrials}</TableCell>
                                  <TableCell className="text-center">{target.phase1}</TableCell>
                                  <TableCell className="text-center">{target.phase2}</TableCell>
                                  <TableCell className="text-center">{target.phase3}</TableCell>
                                  <TableCell className="text-center">{target.diseaseCount}</TableCell>
                                  <TableCell className="text-center pr-4">{target.companiesCount}</TableCell>
                                </TableRow>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs w-auto p-3 text-xs bg-black text-white rounded-md shadow-lg" side="top" align="center">
                                {/* Use the original full tooltip content component */}
                                <TargetTooltipContent data={tooltipData} />
                            </TooltipContent>
                        </Tooltip>
                      );
                    })}
                </TableBody>
              </Table>
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
              <h4 className="text-lg font-semibold mb-2 text-black font-helvetica-now">{activeTab === 'clinical' ? 'Total Trials' : getTabDisplayText()} by Target</h4>
              <p className="text-sm text-gray-600">
                 {/* Updated placeholder text */}
                [Placeholder: Displaying targets sorted by {activeTab === 'clinical' ? 'total trials' : getTabDisplayText().toLowerCase()}.
                {viewMode === 'grid' ? ' Hover over badges for disease/company lists.' : ' Hover over table rows for details.'}
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

// --- Helper Component for Original Tooltip Content (Table View) ---
// No changes needed in TargetTooltipContent
const TargetTooltipContent = ({ data }: { data: TargetTooltipData | null }) => {
    if (!data) return null;

    const renderList = (items: string[] | undefined, label: string, limit: number = 5) => {
        if (!items || items.length === 0) {
            return <p className="mt-1 pt-1 border-t border-gray-600 text-xs opacity-70">No specific {label.toLowerCase()} listed.</p>;
        }
        return (
            <div className="mt-1 pt-1 border-t border-gray-600">
                <p className="font-semibold mb-0.5">{label} ({items.length}):</p>
                <ul className="list-disc list-inside pl-1 max-h-24 overflow-y-auto text-left text-xs">
                    {items.slice(0, limit).map((item, i) => <li key={`${label}-${i}`}>{item}</li>)}
                    {items.length > limit && <li className="opacity-70">...and {items.length - limit} more</li>}
                </ul>
            </div>
        );
    };

    return (
        <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-sm">{data.name}</h4>
            {data.fullName && <p className="italic opacity-90 text-xs -mt-1 mb-1">{data.fullName}</p> }
            <div className="space-y-1">
                {/* Changed label for consistency */}
                <p><span className="font-medium">Total Trials:</span> {data.clinicalTrials}</p>
                <p><span className="font-medium">Phase Breakdown:</span> P1: {data.phase1}, P2: {data.phase2}, P3: {data.phase3}</p>
            </div>
            {data.description && !data.description.startsWith('Placeholder description') && ( // Avoid showing generic placeholder in tooltip
                <div className="mt-1 pt-1 border-t border-gray-600">
                    <p className="font-semibold mb-0.5">Description:</p>
                    <p className="text-xs max-h-20 overflow-y-auto">{data.description}</p>
                </div>
            )}
            {/* Uses diseases/companies derived from 'total' in getSortedTargets */}
            {renderList(data.diseases, "Diseases")}
            {renderList(data.companies, "Companies")}
        </div>
    );
}

// --- Helper Component for Badge Tooltip Content (Grid View) ---
// No changes needed in ListTooltipContent
const ListTooltipContent = ({ items, label, limit = 10 }: { items: string[], label: string, limit?: number }) => {
  if (!items || items.length === 0) {
    return <p className="text-xs opacity-70">No {label.toLowerCase()} listed.</p>;
  }

  return (
    <div className="space-y-1">
      <p className="font-semibold text-sm mb-0.5">{label} ({items.length}):</p>
      <ul className="list-disc list-inside pl-1 max-h-40 overflow-y-auto text-left text-xs">
        {items.slice(0, limit).map((item, i) => <li key={`${label}-${i}`}>{item}</li>)}
        {items.length > limit && <li className="opacity-70">...and {items.length - limit} more</li>}
      </ul>
    </div>
  );
};


export default TargetDisplay;