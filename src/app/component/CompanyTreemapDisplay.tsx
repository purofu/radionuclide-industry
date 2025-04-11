// components/CompanyTreemapDisplay.tsx
"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import * as d3 from 'd3-hierarchy';

// --- Define Prop Types for Toggle Components ---
interface ToggleGroupProps {
    children: React.ReactNode;
    value?: string; // The currently active value
    onValueChange?: (value: string) => void; // Callback when value changes
    className?: string; // Optional additional classes for the group container
}

interface ToggleGroupItemProps {
    children: React.ReactNode;
    value: string; // The value associated with this item
    className?: string; // Optional additional classes for the item button
    "aria-label"?: string;
    isActive?: boolean; // Injected by ToggleGroup
    onClick?: () => void;  // Injected by ToggleGroup
}


// --- Custom Toggle Components (Corrected) ---
const ToggleGroup = ({
    children,
    value,
    onValueChange,
    className = "", // Destructure props correctly, provide default for className
}: ToggleGroupProps) => {
    const handleChildClick = (childValue: string) => {
        if (onValueChange && childValue !== value) { // Only call if value changes
            onValueChange(childValue);
        }
    };

    return (
        // Use the destructured 'className' prop here
        <div className={`inline-flex rounded-md shadow-sm ${className}`}>
            {React.Children.map(children, (child) => {
                if (React.isValidElement<ToggleGroupItemProps>(child)) {
                    // Ensure the child has a 'value' prop before cloning
                    const childValue = child.props?.value;
                    if (typeof childValue === 'string') {
                        return React.cloneElement(child, { // Pass type argument to cloneElement
                            isActive: childValue === value,
                            onClick: () => handleChildClick(childValue),
                        });
                    }
                }
                return child;
            })}
        </div>
    );
};

const ToggleGroupItem = ({
    children,
    // 'value' prop is needed internally by ToggleGroup but not directly used here for rendering logic
    // value, // Can be omitted from destructuring if only needed via props in ToggleGroup
    className = "",
    "aria-label": ariaLabel,
    isActive, // Injected by ToggleGroup
    onClick,  // Injected by ToggleGroup
}: ToggleGroupItemProps) => { // Use the defined props type
    return (
        <button
            type="button"
            className={`relative inline-flex items-center px-3 py-1.5 text-caption font-medium border border-border focus:z-10 focus:outline-none focus:ring-1 focus:ring-ring ${isActive ? 'bg-primary text-primary-foreground z-10 ring-1 ring-ring' : 'bg-background text-foreground hover:bg-muted'} first:rounded-l-md last:rounded-r-md disabled:opacity-50 disabled:pointer-events-none ${className}`} // Adjusted styling
            aria-label={ariaLabel}
            aria-pressed={isActive}
            onClick={onClick}
            disabled={isActive} // Optionally disable the active button
        >
            {children}
        </button>
    );
};


// --- Custom Table Components (Keep As Is) ---
const Table = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => ( <table className={`w-full border-collapse ${className}`}>{children}</table> );
const TableHeader = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => ( <thead className={className}>{children}</thead> );
const TableBody = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => ( <tbody className={className}>{children}</tbody> );
const TableRow = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => ( <tr className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${className}`}>{children}</tr> );
const TableHead = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => ( <th className={`h-10 px-3 text-left align-middle text-caption font-medium text-muted-foreground uppercase tracking-wider ${className}`}>{children}</th> );
const TableCell = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => ( <td className={`p-3 align-middle text-caption text-foreground ${className}`}>{children}</td> );


// --- Interfaces (UPDATED for new JSON structure) ---
interface StudyCounts {
    all: number;
    diagnostic: number;
    therapy: number;
}
interface NctDetails {
    count: number;
    list: string[];
}
interface DiseaseDetail {
    count: number;
    list: string[];
}
interface CompanyPhaseData_New { // Represents data for a specific phase or total
    study_counts: StudyCounts;
    nct_ids: NctDetails;
    diseases: DiseaseDetail;
}
// Represents the structure for a single company in the API response
interface CompanySpecificData_New {
    phase_1?: CompanyPhaseData_New; // Optional fields
    phase_2?: CompanyPhaseData_New;
    phase_3?: CompanyPhaseData_New;
    phase_other?: CompanyPhaseData_New; // Keep if potentially present
    total: CompanyPhaseData_New; // Assume 'total' is always present for listed companies
}
// Main API Data structure - Allows other top-level keys
interface ApiData {

    company?: { [key: string]: CompanySpecificData_New }; // Optional top-level key
    metadata?: { total_trials_processed?: number; }; // Optional top-level key
    // Allow any other keys that might be present at the top level

}

// Represents the *processed* data structure used for rendering (Treemap nodes, Table rows)
interface CompanyTreemapNodeData {
    name: string;           // Company name
    value: number;          // Value used for treemap size (usually total trials for the selected phase/tab)
    allTrials: number;      // Total trials for the selected phase/tab
    diagnosticTrials: number;// Diagnostic trials for the selected phase/tab
    therapyTrials: number;    // Therapy trials for the selected phase/tab
    diseaseCount: number;   // Unique disease count for the selected phase/tab
    diseases: string[];       // List of unique diseases for the selected phase/tab
}
interface TreemapHierarchyNode extends d3.HierarchyRectangularNode<CompanyTreemapNodeData> {
    data: CompanyTreemapNodeData;
}
type TabType = "clinical" | "phase1" | "phase2" | "phase3";
type ViewModeType = "treemap" | "table";


// --- Color Constants (Removed unused badge colors) ---
const COLOR_THERAPY = '#ebeef4'; // Example: Light Grayish Blue
const COLOR_DIAGNOSTIC = '#d8cece'; // Example: Light Grayish Pink

// --- Main Component ---
const CompanyTreemapDisplay = () => {
    const [apiData, setApiData] = useState<ApiData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>("clinical");
    const [viewMode, setViewMode] = useState<ViewModeType>("treemap");
    const treemapContainerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

    // --- Resize Observer (Logic remains the same, structure checked) ---
    useEffect(() => {
        const container = treemapContainerRef.current;
        if (!container || viewMode !== 'treemap' || isLoading) return;
        let animationFrameId: number | null = null;
        const handleResize = (entries: ResizeObserverEntry[]) => {
            if (!entries || entries.length === 0) return;
            const { width, height } = entries[0].contentRect;
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(() => {
                if (width > 0 && height > 0 && (dimensions.width !== width || dimensions.height !== height)) {
                    setDimensions({ width, height });
                }
            });
        };
        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(container);
        const initialWidth = container.clientWidth;
        const initialHeight = container.clientHeight;
        if (initialWidth > 0 && initialHeight > 0 && (dimensions.width !== initialWidth || dimensions.height !== initialHeight)) {
             if (animationFrameId) cancelAnimationFrame(animationFrameId);
             animationFrameId = requestAnimationFrame(() => {
                  setDimensions({ width: initialWidth, height: initialHeight });
             });
        }
        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            resizeObserver.disconnect();
        };
    }, [isLoading, viewMode, dimensions.width, dimensions.height]);


    // --- Data Fetching (Logic remains the same, structure checked) ---
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            const apiUrl = "https://r-eco-52zl8.ondigitalocean.app/visualising";
            // console.log(`Workspaceing data from: ${apiUrl}`); // Keep console logs minimal if not debugging

            try {
                const response = await fetch(apiUrl);
                // console.log("API Response Status:", response.status);

                if (!response.ok) {
                    let errorBody = `HTTP error! status: ${response.status}`;
                    try {
                        const bodyText = await response.text();
                        errorBody += ` - ${bodyText.substring(0, 200)}`;
                    } catch { /* Ignore error during error text retrieval */ }
                    throw new Error(errorBody);
                }

                const rawData = await response.json();
                // console.log("API Data Received (raw):", rawData);

                // **Data Validation (remains the same)**
                if (!rawData || typeof rawData !== 'object' || Array.isArray(rawData)) {
                    console.error("Fetched data is not a valid JSON object:", rawData);
                    throw new Error("Invalid data structure received from API. Expected a JSON object.");
                }
                if (!rawData.company) {
                    console.warn("API response received, but it does not contain a 'company' key. Visualizations requiring company data may be empty.", rawData);
                }
                setApiData(rawData as ApiData);

            } catch (err) {
                console.error("Failed to fetch or process company data:", err);
                setError(err instanceof Error ? err.message : "An unknown error occurred during data fetching or processing.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []); // Fetch only on component mount


    // --- Data Processing (Logic remains the same, structure checked, unused '_' removed) ---
    const getProcessedCompanies = (): CompanyTreemapNodeData[] => {
        if (!apiData || !apiData.company) {
            // console.log("getProcessedCompanies: No apiData or apiData.company found.");
            return [];
        }
        const phaseKeyMap: Record<TabType, keyof CompanySpecificData_New> = {
            clinical: "total", // Assuming "clinical trials" in example was typo for "total" or based on old data
            phase1: "phase_1",
            phase2: "phase_2",
            phase3: "phase_3",
        };
        const currentPhaseKey = phaseKeyMap[activeTab];
        const processedNodes: CompanyTreemapNodeData[] = Object.entries(apiData.company)
             // Removed unused key variable '_' from filter destructuring
            .filter(([, companyData]) => companyData && typeof companyData === 'object')
            .map(([name, companyData]): CompanyTreemapNodeData | null => {
                const phaseData = companyData[currentPhaseKey];
                if (!phaseData || !phaseData.study_counts || !phaseData.diseases) {
                    return null;
                }
                const value = phaseData.study_counts.all ?? 0;
                // Filter out companies with zero trials *here* before sorting
                if (value <= 0) {
                    return null;
                }
                return {
                    name: name,
                    value: value,
                    allTrials: value,
                    diagnosticTrials: phaseData.study_counts.diagnostic ?? 0,
                    therapyTrials: phaseData.study_counts.therapy ?? 0,
                    diseaseCount: phaseData.diseases.count ?? 0,
                    diseases: phaseData.diseases.list ?? [],
                };
            })
            .filter((data): data is CompanyTreemapNodeData => data !== null); // Filter out nulls
        processedNodes.sort((a, b) => b.value - a.value);
        return processedNodes;
    };
    const processedData = useMemo(getProcessedCompanies, [apiData, activeTab]);
    const top15Companies = useMemo(() => processedData.slice(0, 15), [processedData]);

    // --- Calculate Treemap Layout (Corrected D3 logic preserved) ---
    const treemapLayout = useMemo(() => {
        if (!top15Companies || top15Companies.length === 0 || dimensions.width <= 0 || dimensions.height <= 0) {
            return null;
        }
        type RootNodeData = { name: string; children: CompanyTreemapNodeData[] };
        const root = d3.hierarchy<RootNodeData | CompanyTreemapNodeData>({ name: "root", children: top15Companies })
            .sum(d => (d as CompanyTreemapNodeData).value ?? 0)
            .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
        const treemapGenerator = d3.treemap<CompanyTreemapNodeData>()
            .size([dimensions.width, dimensions.height])
            .paddingOuter(5)
            .paddingInner(2)
            .round(true);
        return treemapGenerator(root as d3.HierarchyNode<CompanyTreemapNodeData>);
    }, [top15Companies, dimensions.width, dimensions.height]);

    // --- Helper to get Tab Display Text (Logic remains same, checked) ---
    const getTabDisplayText = (tab: TabType): string => {
        switch (tab) {
            case "clinical": return "All Trials"; // Matches example "All Trials"
            case "phase1": return "Phase 1";
            case "phase2": return "Phase 2";
            case "phase3": return "Phase 3";
            default: return "Unknown";
        }
    };

    // --- Helper for calculating text color (Logic remains same, checked, unused 'e' removed) ---
    const getTextColor = (backgroundColor: string): string => {
        try {
            const color = backgroundColor.substring(1);
            const rgb = parseInt(color, 16);
            const r = (rgb >> 16) & 0xff;
            const g = (rgb >> 8) & 0xff;
            const b = (rgb >> 0) & 0xff;
            const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            return luma < 140 ? 'white' : 'black';
        } catch { // Removed unused 'e' variable
            return 'black';
        }
    };

    // --- Render Component (Applying styling from example, fixed unescaped entities) ---
    return (
        <TooltipProvider delayDuration={100}>
            {/* Restore section classes */}
            <section className="w-full bg-background py-12 md:py-16">
                {/* Restore container classes */}
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
                    {/* Restore title classes */}
                    <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-foreground font-helvetica-now">
                        Top 15 Companies by Trial Activity
                    </h2>

                    {/* Restore controls layout classes */}
                    <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* Restore tabs container classes */}
                        <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                            {(["clinical", "phase1", "phase2", "phase3"] as TabType[]).map(
                                (tab) => (
                                    // Use Shadcn Button as in example
                                    <Button
                                        key={tab}
                                        variant={activeTab === tab ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setActiveTab(tab)}
                                        disabled={isLoading}
                                    >
                                        {getTabDisplayText(tab)}
                                    </Button>
                                ),
                            )}
                        </div>
                        {/* Restore ToggleGroup usage and classes */}
                        <ToggleGroup
                            value={viewMode}
                            onValueChange={(value: string) => { if (value) setViewMode(value as ViewModeType); }}
                            className="justify-center sm:justify-end" // Class from example
                        >
                            <ToggleGroupItem value="treemap" aria-label="Treemap View">
                                {/* Use SVG from example or keep existing one */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                  <path d="M1.5 0A1.5 1.5 0 0 0 0 1.5v13A1.5 1.5 0 0 0 1.5 16h13a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 14.5 0h-13zM1 1.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-3zm4 0a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-5zm4 0a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-3zM1 5.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5h-6a.5.5 0 0 1-.5-.5v-5zm10 2a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-6zM8 7.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-3zM1 11.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-6a.5.5 0 0 1-.5-.5v-3z"/>
                                </svg>
                            </ToggleGroupItem>
                            <ToggleGroupItem value="table" aria-label="Table View">
                                {/* Use SVG from example or keep existing one */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z"/>
                                </svg>
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>

                    {/* Restore Loading State styling */}
                    {isLoading && (
                        <div className="flex-grow w-full min-h-[600px] flex items-center justify-center text-center p-10 text-muted-foreground">
                            <p>Loading company data...</p>
                        </div>
                    )}

                    {/* Restore Error Message styling */}
                     {error && !isLoading && (
                         <div role="alert" className="my-6 p-4 bg-destructive/10 text-destructive border border-destructive/30 rounded-md text-center">
                             <p className="font-semibold">Error Loading Data</p> {/* Match text */}
                             <p className="text-sm">{error}</p> {/* Add text-sm */}
                         </div>
                     )}


                    {/* Content Area: Treemap or Table */}
                    {/* Restore outer content div classes */}
                    {!isLoading && !error && apiData && (
                        <div className="flex-grow w-full min-h-[600px]">
                            {/* ---- TREEMAP VIEW ---- */}
                            {viewMode === 'treemap' && (
                                // Restore treemap container classes
                                <div
                                    ref={treemapContainerRef}
                                    className="relative w-full h-[600px] md:h-[700px] overflow-hidden mb-6 border border-border rounded-md" // Added border/rounded
                                    aria-label={`Treemap of top 15 companies by ${getTabDisplayText(activeTab)} trials`}
                                >
                                    {/* Restore treemap rendering logic and classes */}
                                    {treemapLayout && treemapLayout.leaves().length > 0 ? (
                                        treemapLayout.leaves().map((leaf: TreemapHierarchyNode) => {
                                            const leafData = leaf.data;
                                            const tileWidth = leaf.x1 - leaf.x0;
                                            const tileHeight = leaf.y1 - leaf.y0;
                                            const tileBgColor = leafData.diagnosticTrials > leafData.therapyTrials ? COLOR_DIAGNOSTIC : COLOR_THERAPY;
                                            const textColor = getTextColor(tileBgColor);
                                            const showDetails = tileWidth > 80 && tileHeight > 40;

                                            return (
                                                <Tooltip key={leafData.name}>
                                                    <TooltipTrigger asChild>
                                                        {/* Restore tile div classes */}
                                                        <div
                                                            className="absolute overflow-hidden border border-background/50 flex flex-col justify-start items-start p-1.5 md:p-2 text-xs transition-all duration-200 ease-in-out hover:ring-2 hover:ring-ring hover:z-10"
                                                            style={{
                                                                left: `${leaf.x0}px`,
                                                                top: `${leaf.y0}px`,
                                                                width: `${tileWidth}px`,
                                                                height: `${tileHeight}px`,
                                                                backgroundColor: tileBgColor,
                                                                color: textColor,
                                                            }}
                                                        >
                                                            <span className="font-bold text-xs md:text-sm line-clamp-1">{leafData.name}</span>
                                                            {showDetails && (
                                                                <>
                                                                    <span className="text-[10px] md:text-xs opacity-90 mt-0.5">Trials: {leafData.allTrials}</span>
                                                                     {leafData.diagnosticTrials > 0 && <span className="text-[10px] opacity-80">Dx: {leafData.diagnosticTrials}</span>}
                                                                     {leafData.therapyTrials > 0 && <span className="text-[10px] opacity-80">Tx: {leafData.therapyTrials}</span>}
                                                                </>
                                                            )}
                                                            {!showDetails && tileWidth > 10 && tileHeight > 10 && (
                                                                <span className="text-[10px] font-medium mt-0.5 opacity-90">{leafData.allTrials}</span>
                                                            )}
                                                        </div>
                                                    </TooltipTrigger>
                                                    {/* Restore TooltipContent classes */}
                                                    <TooltipContent side="top" align="center" className="bg-background/95 text-foreground border-border shadow-lg rounded-md p-3 max-w-xs">
                                                        <CompanyTooltipContent data={leafData} activeTab={activeTab} />
                                                    </TooltipContent>
                                                </Tooltip>
                                            );
                                        })
                                    ) : (
                                        // Restore "no data" message styling for treemap
                                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground p-4 text-center">
                                             {/* Fixed unescaped entities */}
                                             <p>{dimensions.width <= 0 || dimensions.height <= 0 ? "Treemap container has no dimensions." : `No company data available for the &apos;${getTabDisplayText(activeTab)}&apos; category to display the treemap.`}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ---- TABLE VIEW ---- */}
                            {viewMode === 'table' && (
                                // Restore table container classes
                                <div className="mb-6 border border-border rounded-lg overflow-x-auto shadow-sm bg-card">
                                    {/* Restore table rendering logic and classes */}
                                    {top15Companies.length > 0 ? (
                                        <Table>
                                            {/* Restore TableHeader classes */}
                                            <TableHeader className="bg-muted/50">
                                                {/* Restore TableRow classes */}
                                                <TableRow className="border-b-0">
                                                    {/* Restore TableHead classes */}
                                                    <TableHead className="w-[40%] min-w-[200px]">Company</TableHead>
                                                    <TableHead className="text-right">Total Trials ({getTabDisplayText(activeTab)})</TableHead>
                                                    <TableHead className="text-right">Diagnostic Trials</TableHead>
                                                    <TableHead className="text-right">Therapy Trials</TableHead>
                                                    <TableHead className="text-right">Disease Count</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            {/* Restore TableBody classes */}
                                            <TableBody className="divide-y divide-border">
                                                {top15Companies.map((company) => (
                                                    <Tooltip key={company.name}>
                                                        <TooltipTrigger asChild>
                                                            {/* Restore TableRow */}
                                                            <TableRow>
                                                                {/* Restore TableCell classes */}
                                                                <TableCell className="font-medium">{company.name}</TableCell>
                                                                <TableCell className="text-right font-semibold">{company.allTrials}</TableCell>
                                                                <TableCell className="text-right">{company.diagnosticTrials}</TableCell>
                                                                <TableCell className="text-right">{company.therapyTrials}</TableCell>
                                                                <TableCell className="text-right">{company.diseaseCount}</TableCell>
                                                            </TableRow>
                                                        </TooltipTrigger>
                                                        {/* Restore TooltipContent classes */}
                                                        <TooltipContent side="top" align="start" className="bg-background/95 text-foreground border-border shadow-lg rounded-md p-3 max-w-xs">
                                                            <CompanyTooltipContent data={company} activeTab={activeTab} />
                                                        </TooltipContent>
                                                    </Tooltip>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        // Restore "no data" message styling for table
                                        <div className="text-center p-10 text-muted-foreground">
                                            {/* Fixed unescaped entities */}
                                            <p>No company data available for the &apos;{getTabDisplayText(activeTab)}&apos; category to display the table.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                    {/* Restore handling for apiData being null after load */}
                     {!isLoading && !error && !apiData && (
                          <div className="text-center p-10 text-muted-foreground">
                               <p>Data could not be loaded or processed correctly.</p>
                          </div>
                      )}


                    {/* Restore Footer Summary Text structure and classes */}
                    <div className="mt-8 border-t border-border pt-8 text-muted-foreground text-sm text-center">
                        {/* Conditional rendering logic remains the same, fixed unescaped entities */}
                        {apiData?.metadata?.total_trials_processed && !isLoading && !error && (
                          <p>
                               Analysis based on {apiData.metadata.total_trials_processed.toLocaleString()} processed trials.
                               {/* Fixed unescaped entities */}
                               {top15Companies.length > 0 ? ` Displaying top ${top15Companies.length} companies for the &apos;${getTabDisplayText(activeTab)}&apos; category.` : ` No companies found matching the criteria for the &apos;${getTabDisplayText(activeTab)}&apos; category.`}
                          </p>
                        )}
                        {!isLoading && !error && apiData && top15Companies.length === 0 && (
                            // Fixed unescaped entities
                            <p>No companies met the criteria for display in the &apos;{getTabDisplayText(activeTab)}&apos; category.</p>
                        )}
                        {!isLoading && !error && apiData && !apiData.company && (
                            // Fixed unescaped entities
                            <p>Data loaded, but the expected &apos;company&apos; information was not found in the response.</p>
                        )}
                    </div>
                </div> {/* End Container */}
            </section>
        </TooltipProvider>
    );
};

// --- Helper Component for Tooltip Content (Restore styling from example) ---
const CompanyTooltipContent = React.memo(({ data, activeTab }: { data: CompanyTreemapNodeData | null, activeTab: TabType }) => {
    if (!data) return null;

    // renderList function structure remains the same
    const renderList = (items: string[], maxToShow = 5, title: string) => {
        if (!items || items.length === 0) return null;
        const displayItems = items.slice(0, maxToShow);
        const remainingCount = items.length - maxToShow;
        return (
            <div>
                <p className="font-semibold text-foreground/90 mb-0.5">{title}:</p>
                <ul className="list-disc list-inside pl-1 space-y-0.5">
                    {displayItems.map((item, index) => (
                        <li key={index} className="text-muted-foreground text-[11px] leading-tight">{item}</li>
                    ))}
                </ul>
                {remainingCount > 0 && (
                    <p className="text-muted-foreground/80 text-[10px] mt-0.5 italic">...and {remainingCount} more</p>
                )}
            </div>
        );
    };

    const phaseTextMap: Record<TabType, string> = {
        clinical: "All Clinical Trials", // Matches example
        phase1: "Phase 1 Trials",       // Matches example
        phase2: "Phase 2 Trials",       // Matches example
        phase3: "Phase 3 Trials"        // Matches example
    };

    // Restore main div classes and internal structure/classes
    return (
        <div className="space-y-2 text-xs font-helvetica-now-text"> {/* Restore space-y-2 */}
            <h4 className="font-bold text-sm text-foreground mb-1.5">{data.name}</h4>
            {/* Restore grid classes */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
                 <div className="font-medium text-foreground/90">Category:</div>
                 <div className="text-right text-muted-foreground">{phaseTextMap[activeTab]}</div>

                 <div className="font-medium text-foreground/90">Total Trials:</div>
                 <div className="text-right text-muted-foreground">{data.allTrials}</div>

                 <div className="font-medium text-foreground/90">Diagnostic:</div>
                 <div className="text-right text-muted-foreground">{data.diagnosticTrials}</div>

                 <div className="font-medium text-foreground/90">Therapy:</div>
                 <div className="text-right text-muted-foreground">{data.therapyTrials}</div>

                 <div className="font-medium text-foreground/90">Unique Diseases:</div>
                 <div className="text-right text-muted-foreground">{data.diseaseCount}</div>
            </div>
            {/* Restore disease list section classes */}
            {data.diseases && data.diseases.length > 0 && (
                <div className="pt-1 mt-1 border-t border-border/50">
                    {renderList(data.diseases, 5, "Top Diseases")}
                </div>
            )}
             {(!data.diseases || data.diseases.length === 0) && (
                 <p className="text-muted-foreground/70 text-[10px] italic pt-1 mt-1 border-t border-border/50">No specific diseases listed for this category.</p>
             )}
        </div>
    );
});
CompanyTooltipContent.displayName = 'CompanyTooltipContent';

export default CompanyTreemapDisplay;