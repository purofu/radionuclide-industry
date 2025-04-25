"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import styles from "@/theme/components";

// --- Custom Table Components ---
const Table = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <table className={styles.viz.container(className)}>{children}</table>
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

// --- Interface for ToggleGroupItem props ---
interface ToggleGroupItemProps {
  children: React.ReactNode;
  value: string;
  className?: string;
  'aria-label'?: string;
  isActive?: boolean;
  onClick?: () => void;
}

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
        if (React.isValidElement<ToggleGroupItemProps>(child)) {
          return React.cloneElement(child, {
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

// --- Interfaces for API Structure ---
interface StudyCounts {
  all: number;
  diagnostic: number;
  therapy: number;
}

interface DetailEntry {
  count: number;
  list: string[];
}

interface PhaseData {
  study_counts: StudyCounts;
  nct_ids?: DetailEntry;
  diseases: DetailEntry;
  companies: DetailEntry;
}

interface TargetSpecificData {
  total?: PhaseData;
  phase_1?: PhaseData;
  phase_2?: PhaseData;
  phase_3?: PhaseData;
  phase_other?: PhaseData;
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

// --- Interface for Processed Data ---
interface TargetSummary {
  name: string;
  fullName?: string;
  description?: string;
  clinicalTrials: number;
  phase1: number;
  phase2: number;
  phase3: number;
  diseaseCount: number;
  companiesCount: number;
  diseases: string[];
  companies: string[];
}

// Interface for Tooltip Content Data
type TargetTooltipData = TargetSummary;

// Tab/View Types
type TabType = "clinical" | "phase1" | "phase2" | "phase3";
type ViewModeType = "grid" | "table";

// --- Main Component ---
const RefactoredTargetDisplay = () => {
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
        setApiData(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Sample Fallback Data ---
  const sampleTargets: TargetSummary[] = [
    {
        name: "PSMA",
        fullName: "Prostate-Specific Membrane Antigen",
        description: "PSMA is highly expressed in prostate cancer cells, making it a prime target for diagnostic imaging and targeted radionuclide therapy.",
        clinicalTrials: 74, phase1: 32, phase2: 27, phase3: 12, diseaseCount: 4, companiesCount: 12, 
        diseases: ["Prostate Cancer", "Kidney Cancer", "Lung Cancer", "Thyroid Cancer"], 
        companies: ["Company A", "Company B", "Company C", "Novartis", "Bayer", "GE", "Pfizer", "Janssen", "Sanofi", "Roche", "AstraZeneca", "Merck"]
    },
    {
        name: "FAP",
        fullName: "Fibroblast Activation Protein-α",
        description: "FAP expression under physiological conditions is very low in the majority of adult tissues. FAP is nevertheless expressed during embryonic development,[16] and in adults in pancreatic alpha cells[17] in multipotent bone marrow stromal cells (BM-MSC)[18] and uterine stroma.[19]",
        clinicalTrials: 60, phase1: 28, phase2: 22, phase3: 8, diseaseCount: 6, companiesCount: 9, 
        diseases: ["Various Cancers", "Lung", "Breast", "Ovarian", "Pancreatic", "Colorectal"], 
        companies: ["Company C", "Roche", "Boehringer", "Merck", "Pfizer", "GSK", "AbbVie", "Lilly", "Amgen"]
    },
    // Additional sample data can be kept as is
  ];

  // --- Data Processing & Sorting ---
  const getSortedTargets = (): TargetSummary[] => {
    if (!apiData || !apiData.target) {
      return error && sampleTargets.length > 0 ? sampleTargets : [];
    }

    const processedTargets = Object.entries(apiData.target)
        .map(([name, data]): TargetSummary => {
            const totalData = data["total"];
            const phase1Data = data["phase_1"];
            const phase2Data = data["phase_2"];
            const phase3Data = data["phase_3"];

            const apiFullName = data.fullName;
            const apiDescription = data.description;
            const sampleMatch = sampleTargets.find(st => st.name === name.toUpperCase());
            const placeholderFullName = `${name.toUpperCase()} Full Name`;
            const placeholderDescription = `Placeholder description for ${name.toUpperCase()}. More details needed.`;

            return {
                name: name.toUpperCase(),
                fullName: apiFullName ?? sampleMatch?.fullName ?? placeholderFullName,
                description: apiDescription ?? sampleMatch?.description ?? placeholderDescription,
                clinicalTrials: totalData?.study_counts?.all ?? 0,
                phase1: phase1Data?.study_counts?.all ?? 0,
                phase2: phase2Data?.study_counts?.all ?? 0,
                phase3: phase3Data?.study_counts?.all ?? 0,
                diseaseCount: totalData?.diseases?.count ?? 0,
                companiesCount: totalData?.companies?.count ?? 0,
                diseases: totalData?.diseases?.list ?? [],
                companies: totalData?.companies?.list ?? [],
            };
        });

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

  // --- Helper Functions ---
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

  // Prepare tooltip data
  const prepareTargetTooltipData = (target: TargetSummary): TargetTooltipData => {
    return target;
  };

  // Get data ready for display
  const targetsToDisplay = getSortedTargets();

  // --- Render Component ---
  return (
    <TooltipProvider delayDuration={100}>
      <section className={styles.section.wrapper()}>
        <div className={styles.section.container()}>
          {/* Title */}
          <h2 className={styles.section.title("text-center")}>
            Promising Molecular Targets
          </h2>

          {/* Controls: Tabs & View Toggle */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Tabs */}
            <div className={styles.tabs.container("justify-center sm:justify-start")}>
              {(["clinical", "phase1", "phase2", "phase3"] as TabType[]).map(
                (tab) => (
                  <Button
                    key={tab}
                    variant={activeTab === tab ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab(tab)}
                    className={`${activeTab === tab ? 'bg-black text-white hover:bg-gray-800' : 'text-black border-gray-300 hover:bg-gray-100'}`}
                  >
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
            <div className={styles.status.loading()}>
              <p>Loading target data...</p>
            </div>
          )}

          {/* Error Message */}
          {error && !isLoading && (
            <div className={styles.status.error()}>
              <p>{error}</p>
            </div>
          )}

          {/* ---- GRID VIEW ---- */}
          {!isLoading && viewMode === "grid" && targetsToDisplay.length > 0 && (
             <div className={styles.grid.four()}>
               {targetsToDisplay.map((target) => {
                 const displayValue = getDisplayValue(target);
                 const displayLabel = `${activeTab === 'clinical' ? 'total ' : ''}${getTabDisplayText().replace(' Trials', '').toLowerCase()} trials`;

                 return (
                     <div
                       key={target.name}
                       className={styles.card.base(styles.card.hover("h-full justify-between group overflow-hidden"))}
                     >
                       {/* Top Section */}
                       <div className="px-6 pt-12 pb-4 text-right">
                           <span className={styles.typography.displayValue("align-baseline")}>{displayValue}</span>
                           <span className={styles.typography.displayLabel("block mt-1")}>{displayLabel}</span>
                       </div>
                       {/* Middle Section Spacer */}
                        <div className="flex-grow px-6 min-h-[50px]"></div>
                       {/* Bottom Section */}
                       <div className="px-6 pb-6 flex flex-col justify-start items-start gap-3">
                         <h3 className={styles.typography.cardTitle("self-stretch")}>
                           {target.name}
                         </h3>
                         <div className="self-stretch flex flex-col justify-start items-start gap-1">
                           {target.fullName && (
                             <span className={styles.typography.cardSubtitle()}>
                               {target.fullName}
                             </span>
                           )}
                           <p className={styles.typography.cardBody("line-clamp-4")}>
                             {target.description || "No description available."}
                           </p>
                         </div>
                         {/* Badges with Individual Tooltips */}
                         <div className="flex flex-wrap justify-start items-start gap-2 mt-2">
                           {/* Disease Badge */}
                           <Tooltip>
                             <TooltipTrigger asChild>
                               <div className={styles.badge.base(styles.badge.disease())}>
                                 <span className={styles.typography.displayLabel()}>
                                   {target.diseaseCount} Disease Types
                                 </span>
                               </div>
                             </TooltipTrigger>
                             <TooltipContent className={styles.viz.tooltip("w-auto")} side="bottom" align="center">
                               <ListTooltipContent items={target.diseases} label="Diseases" />
                             </TooltipContent>
                           </Tooltip>
                           {/* Company Badge */}
                           <Tooltip>
                              <TooltipTrigger asChild>
                                <div className={styles.badge.base(styles.badge.company())}>
                                  <span className={styles.typography.displayLabel()}>
                                    {target.companiesCount} Companies
                                  </span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className={styles.viz.tooltip("w-auto")} side="bottom" align="center">
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
                            <TooltipContent className={styles.viz.tooltip("w-auto text-xs")} side="top" align="center">
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
             <div className={styles.status.empty()}>
               <p>
                 {error
                   ? "Sample data is currently unavailable due to a loading error."
                   : "No target data found or API returned empty target list."}
               </p>
             </div>
           )}

          {/* Placeholder Summary Text */}
          <div className="mt-12 md:mt-16 border-t border-gray-200 pt-8">
            <div className="max-w-3xl mx-auto text-center">
              <h4 className="text-lg font-semibold mb-2 text-black font-helvetica-now">
                {activeTab === 'clinical' ? 'Total Trials' : getTabDisplayText()} by Target
              </h4>
              <p className="text-sm text-gray-600">
                [Placeholder: Displaying targets sorted by {activeTab === 'clinical' ? 'total trials' : getTabDisplayText().toLowerCase()}.
                {viewMode === 'grid' ? ' Hover over badges for disease/company lists.' : ' Hover over table rows for details.'}
                {apiData && !error && !isLoading && " Data loaded successfully."}
                {error && !isLoading && " Displaying available sample data due to a loading error."} ]
              </p>
            </div>
          </div>

        </div>
      </section>
    </TooltipProvider>
  );
};

// --- Helper Component for Tooltip Content (Table View) ---
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
                <p><span className="font-medium">Total Trials:</span> {data.clinicalTrials}</p>
                <p><span className="font-medium">Phase Breakdown:</span> P1: {data.phase1}, P2: {data.phase2}, P3: {data.phase3}</p>
            </div>
            {data.description && !data.description.startsWith('Placeholder description') && (
                <div className="mt-1 pt-1 border-t border-gray-600">
                    <p className="font-semibold mb-0.5">Description:</p>
                    <p className="text-xs max-h-20 overflow-y-auto">{data.description}</p>
                </div>
            )}
            {renderList(data.diseases, "Diseases")}
            {renderList(data.companies, "Companies")}
        </div>
    );
}

// --- Helper Component for Badge Tooltip Content (Grid View) ---
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

export default RefactoredTargetDisplay; 