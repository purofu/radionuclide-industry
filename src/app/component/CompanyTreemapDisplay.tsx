// components/CompanyTreemapDisplay.tsx
"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"; // Assuming path is correct
import { Tabs, GridIcon, TableIcon } from "@/components/ui"; // Import our new Tabs component
import * as d3 from 'd3-hierarchy';
import * as d3Array from 'd3-array';
import { treemapSquarify } from 'd3-hierarchy';
import styles from "@/theme/components"; // Import component styles
// Import our new table components
import { 
    Table as TableComponent, 
    TableHeader as TableHeaderComponent, 
    TableBody as TableBodyComponent, 
    TableRow as TableRowComponent, 
    TableHead as TableHeadComponent, 
    TableCell as TableCellComponent, 
    TableWithTooltips,
    TooltipList
} from "@/components/ui/table";

// --- Define Prop Types for Toggle Components ---
interface ToggleGroupProps {
    children: React.ReactNode;
    value?: string;
    onValueChange?: (value: string) => void;
    className?: string;
}

interface ToggleGroupItemProps {
    children: React.ReactNode;
    value: string;
    className?: string;
    "aria-label"?: string;
    isActive?: boolean;
    onClick?: () => void;
}

// --- Custom Toggle Components (Styled like TargetDisplay) ---
const ToggleGroup = ({
    children,
    value,
    onValueChange,
    className = "",
}: ToggleGroupProps) => {
    const handleChildClick = (childValue: string) => {
        if (onValueChange && childValue !== value) {
            onValueChange(childValue);
        }
    };
    return (
        <div className={`inline-flex rounded-md ${className}`}>
            {React.Children.map(children, (child) => {
                if (React.isValidElement<ToggleGroupItemProps>(child)) {
                    const childValue = child.props?.value;
                    if (typeof childValue === 'string') {
                        return React.cloneElement(child, {
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
    className = "",
    "aria-label": ariaLabel,
    isActive,
    onClick,
}: ToggleGroupItemProps) => {
    return (
        <button
            type="button"
            // Style matches tab buttons
            className={`px-4 py-2 rounded-md text-sm font-medium font-helvetica-now transition-colors duration-150 ease-in-out ${isActive ? 'bg-black text-white' : 'bg-gray-200 text-black hover:bg-gray-400 hover:text-white'} ${className}`}
            aria-label={ariaLabel}
            aria-pressed={isActive}
            onClick={onClick}
            disabled={isActive} // Keep active button disabled
        >
            {children}
        </button>
    );
};

// --- Interfaces (Expanded for phase data) ---
interface StudyCounts { all: number; diagnostic: number; therapy: number; }
interface NctDetails { count: number; list: string[]; }
interface DiseaseDetail { count: number; list: string[]; }
interface CompanyPhaseData_New { study_counts: StudyCounts; nct_ids: NctDetails; diseases: DiseaseDetail; }
interface CompanySpecificData_New { phase_1?: CompanyPhaseData_New; phase_2?: CompanyPhaseData_New; phase_3?: CompanyPhaseData_New; phase_other?: CompanyPhaseData_New; total: CompanyPhaseData_New; }
interface ApiData { company?: { [key: string]: CompanySpecificData_New }; metadata?: { total_trials_processed?: number; }; }
// Data node used for processing and rendering with phase-specific numbers
interface CompanyTreemapNodeData {
    name: string;
    value: number; // Value for active tab (sorting/sizing)
    allTrials: number; // Total trials
    phase1Trials: number; // Phase 1 trials
    phase2Trials: number; // Phase 2 trials 
    phase3Trials: number; // Phase 3 trials
    diagnosticTrials: number; // Total Dx trials
    therapyTrials: number; // Total Tx trials
    diseaseCount: number; // Total disease count
    diseases: string[]; // Total disease list
}
interface TreemapHierarchyNode extends d3.HierarchyRectangularNode<CompanyTreemapNodeData> { data: CompanyTreemapNodeData; }
type TabType = "clinical" | "phase1" | "phase2" | "phase3";
type ViewModeType = "treemap" | "table";

// --- Color Constants & Styling Helpers ---
// Using CSS variables with fallbacks for broader compatibility
const COLOR_LIGHT_THERAPY = 'var(--color-light-therapy, #ebeef4)';
const COLOR_LIGHT_DIAGNOSTIC = 'var(--color-light-diagnostic, #d8cece)';
const COLOR_BLACK = 'var(--color-black, #000000)';
const COLOR_PURPLE = 'var(--color-purple, #8A2BE2)';
const COLOR_PRIMARY_BLUE = 'var(--color-primary-blue, #007bff)';
const COLOR_BADGE_TEXT = 'var(--color-light-therapy, #ffffff)';
const TEXT_COLOR_ON_GRADIENT = 'var(--color-black, #000000)';

// Helper function to generate background style for treemap tiles
const getTileBackgroundStyle = (diag: number, therapy: number, total: number): React.CSSProperties => {
    if (total <= 0 || (diag <= 0 && therapy <= 0)) {
        return { background: `linear-gradient(to right, ${COLOR_LIGHT_THERAPY} 50%, ${COLOR_LIGHT_DIAGNOSTIC} 50%)` };
    }
    const therapyPercent = Math.min((therapy / total) * 100, 100);
    // Gradient: Therapy color first, then Diagnostic fills the rest
    return { background: `linear-gradient(to right, ${COLOR_LIGHT_THERAPY} ${therapyPercent}%, ${COLOR_LIGHT_DIAGNOSTIC} ${therapyPercent}%)`};
};

// Get the correct value for the active tab
const getValueForActiveTab = (data: CompanyTreemapNodeData, activeTab: TabType): number => {
    switch (activeTab) {
        case "phase1": return data.phase1Trials || 0;
        case "phase2": return data.phase2Trials || 0;
        case "phase3": return data.phase3Trials || 0;
        case "clinical": 
        default: return data.allTrials;
    }
};

// --- Main Component ---
const CompanyTreemapDisplay = () => {
    const [apiData, setApiData] = useState<ApiData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<TabType>("clinical");
    const [viewMode, setViewMode] = useState<ViewModeType>("treemap");
    const treemapContainerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

    // --- Resize Observer (Keep as before) ---
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
             animationFrameId = requestAnimationFrame(() => { setDimensions({ width: initialWidth, height: initialHeight }); });
        }
        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            resizeObserver.disconnect();
        };
    }, [isLoading, viewMode, dimensions.width, dimensions.height]);

    // --- Data Fetching (Enhanced error handling) ---
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true); 
            setError(null);
            
            // Add timeout for fetch operation
            const timeoutPromise = new Promise<never>((_, reject) => 
                setTimeout(() => reject(new Error("Request timed out after 15 seconds")), 15000)
            );
            
            const apiUrl = "https://r-eco-52zl8.ondigitalocean.app/visualising";
            try {
                // Race between fetch and timeout
                const response = await Promise.race([
                    fetch(apiUrl),
                    timeoutPromise
                ]) as Response;
                
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const rawData = await response.json();
                
                // More detailed validation
                if (!rawData) throw new Error("Empty response received");
                if (typeof rawData !== 'object') throw new Error(`Invalid data type: ${typeof rawData}`);
                if (Array.isArray(rawData)) throw new Error("Received array instead of object");
                
                // Check for company data
                if (!rawData.company || Object.keys(rawData.company).length === 0) {
                    console.warn("API response missing or empty 'company' key:", rawData);
                    setError("Data structure is incomplete. No company information found.");
                } else {
                    console.log("Data loaded successfully:", 
                        `Companies: ${Object.keys(rawData.company).length}`, 
                        `Total trials: ${rawData.metadata?.total_trials_processed || 'unknown'}`);
                }
                setApiData(rawData as ApiData);
            } catch (err) {
                console.error("Failed to fetch/process data:", err);
                setError(err instanceof Error ? `Error: ${err.message}` : "Unknown error occurred while loading data.");
            } finally { 
                setIsLoading(false); 
            }
        };
        fetchData();
    }, []);

    // --- Data Processing (Updated to extract phase data) ---
    const getProcessedCompanies = (): CompanyTreemapNodeData[] => {
        if (!apiData || !apiData.company) return [];
        const phaseKeyMap: Record<TabType, keyof CompanySpecificData_New> = { clinical: "total", phase1: "phase_1", phase2: "phase_2", phase3: "phase_3" };
        const currentPhaseKey = phaseKeyMap[activeTab];

        const processedNodes: CompanyTreemapNodeData[] = Object.entries(apiData.company)
            .filter(([, companyData]) => companyData?.total?.study_counts && companyData?.total?.diseases) // Ensure total data exists
            .map(([name, companyData]): CompanyTreemapNodeData | null => {
                const phaseData = companyData[currentPhaseKey];
                const totalData = companyData.total;

                // If specific phase data is needed for filtering and doesn't exist, skip
                if (!phaseData?.study_counts) return null;

                const valueForSort = phaseData.study_counts.all ?? 0;
                // Filter out based on the active tab's value *before* creating node
                if (valueForSort <= 0 && activeTab !== 'clinical') return null; // Allow clinical even if 0 if we want to show all companies? No, filter needed.
                if (valueForSort <= 0) return null;

                return {
                    name: name,
                    value: valueForSort, // Use active tab's value for sorting/sizing
                    // Extract all phase data 
                    allTrials: totalData.study_counts.all ?? 0,
                    phase1Trials: companyData.phase_1?.study_counts.all ?? 0,
                    phase2Trials: companyData.phase_2?.study_counts.all ?? 0,
                    phase3Trials: companyData.phase_3?.study_counts.all ?? 0,
                    diagnosticTrials: totalData.study_counts.diagnostic ?? 0,
                    therapyTrials: totalData.study_counts.therapy ?? 0,
                    diseaseCount: totalData.diseases.count ?? 0,
                    diseases: totalData.diseases.list ?? [],
                };
            })
            .filter((data): data is CompanyTreemapNodeData => data !== null);

        processedNodes.sort((a, b) => b.value - a.value); // Sort by active tab's value
        return processedNodes;
    };
    const processedData = useMemo(getProcessedCompanies, [apiData, activeTab]); // All data for table view
    const top15Companies = useMemo(() => processedData.slice(0, 15), [processedData]); // Top 15 for treemap view

    // --- Calculate Treemap Layout (Optimized for box proportions) ---
    const treemapLayout = useMemo(() => {
        if (!top15Companies || top15Companies.length === 0 || dimensions.width <= 0 || dimensions.height <= 0) return null;
        type RootNodeData = { name: string; children: CompanyTreemapNodeData[] };
        const root = d3.hierarchy<RootNodeData | CompanyTreemapNodeData>({ name: "root", children: top15Companies })
            .sum(d => Math.max((d as CompanyTreemapNodeData).value, 1)) // Use value, ensure minimum size for visibility
            .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
        const treemapGenerator = d3.treemap<CompanyTreemapNodeData>()
            .size([dimensions.width, dimensions.height])
            .paddingOuter(10) // Slightly increased outer padding
            .paddingTop(10)
            .paddingRight(10)
            .paddingBottom(10)
            .paddingLeft(10)
            .paddingInner(10) // Slightly increased inner padding
            .tile(treemapSquarify.ratio(1)) // Using ratio of 1 forces more square-like boxes
            .round(true);
        return treemapGenerator(root as d3.HierarchyNode<CompanyTreemapNodeData>);
    }, [top15Companies, dimensions.width, dimensions.height]);

    // --- Helper to get Tab Display Text (Keep as before) ---
    const getTabDisplayText = (tab: TabType): string => {
        switch (tab) { case "clinical": return "All Trials"; case "phase1": return "Phase 1"; case "phase2": return "Phase 2"; case "phase3": return "Phase 3"; default: return "Unknown"; }
    };

    // --- Render Component ---
    return (
        <TooltipProvider delayDuration={100}>
            <section className="relative w-full bg-white py-12 md:py-16">
                <div className="px-4 md:px-6 lg:px-8">
                    <h2 className="text-h3 font-helvetica-now text-black mb-8">Market leaders by volume of studies,  clinical stage and diseases</h2>

                    {/* Legend Section */}
                    <div className="mb-6 px-4 md:px-6 lg:px-8">
                        <div className="flex flex-wrap gap-3 items-center justify-center">
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLOR_BLACK }}></div>
                                <span className="text-xs font-helvetica-now">Number of Diseases</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLOR_PURPLE }}></div>
                                <span className="text-xs font-helvetica-now">Diagnostic Trials</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLOR_PRIMARY_BLUE }}></div>
                                <span className="text-xs font-helvetica-now">Therapy Trials</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 mb-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between sm:gap-8 gap-4">
                            {/* Replace tab buttons and toggle with our new Tabs component */}
                            <Tabs
                                titleTabs={[
                                    { id: 'clinical', label: 'Clinical Trials' },
                                    { id: 'phase1', label: 'Phase 1' },
                                    { id: 'phase2', label: 'Phase 2' },
                                    { id: 'phase3', label: 'Phase 3' },
                                ]}
                                iconTabs={[
                                    { id: 'treemap', icon: <GridIcon />, ariaLabel: 'Treemap View' },
                                    { id: 'table', icon: <TableIcon />, ariaLabel: 'Table View' },
                                ]}
                                defaultTitleTab={activeTab}
                                defaultIconTab={viewMode}
                                onTitleTabChange={(tabId) => setActiveTab(tabId as TabType)}
                                onIconTabChange={(tabId) => setViewMode(tabId as ViewModeType)}
                                className="w-full"
                            />
                        </div>

                        {/* Loading / Error States */}
                        {isLoading && <div className="flex-grow min-h-[400px] flex items-center justify-center text-muted-foreground"><p>Loading company data...</p></div>}
                        {error && !isLoading && <div role="alert" className="my-6 p-4 bg-destructive/10 text-destructive border border-destructive/30 rounded-md text-center"><p className="font-semibold">Error Loading Data</p><p className="text-sm">{error}</p></div>}

                        {/* Content Area */}
                        {!isLoading && !error && apiData?.company && ( // Ensure company data exists before rendering views
                            <div className="flex-grow w-full min-h-[600px]">

                                {/* ---- TREEMAP VIEW (Rendering Cards as Tiles) ---- */}
                                {viewMode === 'treemap' && (
                                    <div
                                        ref={treemapContainerRef}
                                        className="relative w-full h-[700px] overflow-hidden mb-6 bg-muted/20" // Consistent height
                                        aria-label={`Treemap of top 15 companies by ${getTabDisplayText(activeTab)} trials`}
                                    >
                                        {treemapLayout && treemapLayout.leaves().length > 0 ? (
                                            treemapLayout.leaves().map((leaf: TreemapHierarchyNode) => {
                                                const leafData = leaf.data;
                                                const tileWidth = leaf.x1 - leaf.x0;
                                                const tileHeight = leaf.y1 - leaf.y0;
                                                // Use TOTAL counts for background and display
                                                const backgroundStyle = getTileBackgroundStyle(leafData.diagnosticTrials, leafData.therapyTrials, leafData.allTrials);
                                                const textColor = TEXT_COLOR_ON_GRADIENT;
                                                const badgeTextColor = COLOR_BADGE_TEXT;

                                                // --- More refined Adaptive Rendering Conditions ---
                                                const isExtremelySmallTile = tileWidth < 70 || tileHeight < 60;
                                                const isVerySmallTile = (tileWidth < 90 || tileHeight < 70) && !isExtremelySmallTile;
                                                const isSmallTile = (tileWidth < 120 || tileHeight < 90) && !isVerySmallTile && !isExtremelySmallTile;
                                                const isNarrowTile = tileWidth < 100 && tileHeight > 120; // Tall but narrow tiles
                                                const isWideTile = tileWidth > 200 && tileHeight < 100; // Wide but short tiles

                                                // Determine badge layout orientation based on tile shape
                                                const useBadgesVerticalLayout = isNarrowTile || tileWidth < 140;
                                                const showBadges = !isExtremelySmallTile; // Hide badges on extremely small tiles
                                                const showCompanyName = true; // Always show, but smaller on small tiles 
                                                const showLargeNumber = true; // Always show, but adjust size

                                                // Adjust font size based on tile area and dimensions
                                                const area = tileWidth * tileHeight;
                                                let numberFontSize = area < 5000 ? '1rem' : area < 10000 ? '1.5rem' : area < 25000 ? '2.5rem' : '3.5rem';
                                                if (numberFontSize === '3.5rem' && tileHeight < 100) numberFontSize = '2.5rem';
                                                if (isNarrowTile && numberFontSize === '2.5rem') numberFontSize = '1.5rem';

                                                // Badge size adjustment - make them smaller overall
                                                const badgeFontSize = isVerySmallTile || isSmallTile ? 'text-xs' : (isWideTile ? 'text-sm' : 'text-xs');
                                                const badgePadding = isVerySmallTile || isSmallTile ? 'px-2 py-0.5' : 'px-2 py-0.5';

                                                // Company name size adjustment - based on area AND company importance
                                                const getCompanyNameSize = () => {
                                                    // Calculate area and aspect ratio of the tile
                                                    const aspectRatio = tileWidth / tileHeight;
                                                    
                                                    // Get the company's actual value (for the active tab)
                                                    const companyValue = getValueForActiveTab(leafData, activeTab);
                                                    
                                                    // Calculate importance factor (0.7 to 1.3 range)
                                                    // Higher values get larger fonts, lower values get smaller fonts
                                                    const importanceFactor = Math.min(1.3, Math.max(0.7, 0.9 + (companyValue / 50 * 0.4)));
                                                    
                                                    // Detect extremely skewed rectangles (very thin or very short)
                                                    const isExtremeAspectRatio = aspectRatio < 0.4 || aspectRatio > 2.5;
                                                    
                                                    // Base size primarily on area, with adjustments for aspect ratio
                                                    let baseSize = 'text-[7px]';
                                                    if (area < 3000) baseSize = 'text-[7px]';
                                                    else if (area < 5000) baseSize = isExtremeAspectRatio ? 'text-[8px]' : 'text-[9px]';
                                                    else if (area < 8000) baseSize = isExtremeAspectRatio ? 'text-[9px]' : 'text-[10px]';
                                                    else if (area < 12000) baseSize = isExtremeAspectRatio ? 'text-xs' : 'text-sm';
                                                    else if (area < 18000) baseSize = isExtremeAspectRatio ? 'text-sm' : 'text-base';
                                                    else if (area < 25000) baseSize = isExtremeAspectRatio ? 'text-base' : 'text-lg';
                                                    else baseSize = isExtremeAspectRatio ? 'text-lg' : 'text-[21px]';
                                                    
                                                    // Now adjust based on company value
                                                    // For high value companies, try to use a larger font size regardless of box dimensions
                                                    if (companyValue > 30) {
                                                        if (baseSize === 'text-[7px]') return 'text-[9px]';
                                                        if (baseSize === 'text-[8px]') return 'text-[10px]';
                                                        if (baseSize === 'text-[9px]') return 'text-xs';
                                                        if (baseSize === 'text-[10px]') return 'text-sm';
                                                        if (baseSize === 'text-xs') return 'text-sm';
                                                        if (baseSize === 'text-sm') return 'text-base';
                                                        if (baseSize === 'text-base') return 'text-lg';
                                                        return 'text-[21px]';
                                                    }
                                                    
                                                    // For low value companies, use a smaller font
                                                    if (companyValue < 10) {
                                                        if (baseSize === 'text-lg' || baseSize === 'text-[21px]') return 'text-base';
                                                        if (baseSize === 'text-base') return 'text-sm';
                                                        if (baseSize === 'text-sm') return 'text-xs';
                                                        if (baseSize === 'text-xs') return 'text-[10px]';
                                                        if (baseSize === 'text-[10px]') return 'text-[9px]';
                                                        if (baseSize === 'text-[9px]') return 'text-[8px]';
                                                        return 'text-[7px]';
                                                    }
                                                    
                                                    // For medium values, keep the base size
                                                    return baseSize;
                                                };

                                                const companyNameSize = getCompanyNameSize();

                                                // More adaptive line clamping based on both area and height
                                                const nameLineClamp = () => {
                                                    const area = tileWidth * tileHeight;
                                                    if (area < 5000 || tileHeight < 70) return 'line-clamp-1';
                                                    if (area < 15000 || tileHeight < 100) return 'line-clamp-2';
                                                    return 'line-clamp-3';
                                                };

                                                return (
                                                    <div
                                                        key={leafData.name}
                                                        className="absolute overflow-hidden rounded-lg cursor-pointer outline outline-1 outline-offset-[-0.98px] outline-white"
                                                        style={{
                                                            left: `${leaf.x0}px`,
                                                            top: `${leaf.y0}px`,
                                                            width: `${tileWidth}px`,
                                                            height: `${tileHeight}px`,
                                                            ...backgroundStyle,
                                                            color: textColor,
                                                        }}
                                                    >
                                                        {/* Inner structure for card content */}
                                                        <div className={`w-full h-full ${isVerySmallTile ? 'p-2' : isSmallTile ? 'p-3' : 'p-6'} flex flex-col justify-between items-start`}>
                                                            {/* Top Section */}
                                                            <div className="w-full flex justify-between items-start gap-1">
                                                                {/* Large Number */}
                                                                {showLargeNumber ? (
                                                                    <div
                                                                        className="font-medium font-['Helvetica_Now_Display']"
                                                                        style={{ fontSize: numberFontSize, lineHeight: 1.1 }}
                                                                    >
                                                                        {getValueForActiveTab(leafData, activeTab)}
                                                                    </div>
                                                                ) : (
                                                                    <div />
                                                                )}

                                                                {/* Badges */}
                                                                {showBadges && (
                                                                    <div
                                                                        className={`flex ${useBadgesVerticalLayout ? 'flex-col' : 'flex-row'} ${
                                                                            useBadgesVerticalLayout ? 'gap-1' : 'gap-2'
                                                                        } shrink-0 items-end`}
                                                                    >
                                                                        {leafData.diseaseCount > 0 && (
                                                                            <div
                                                                                className={`${badgePadding} rounded-full flex justify-center items-center`}
                                                                                style={{ backgroundColor: COLOR_BLACK }}
                                                                            >
                                                                                <div
                                                                                    className={`text-center ${badgeFontSize} font-medium font-['Helvetica_Now_Display'] leading-tight`}
                                                                                    style={{ color: COLOR_BADGE_TEXT }}
                                                                                >
                                                                                    {leafData.diseaseCount}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        {leafData.diagnosticTrials > 0 && (
                                                                            <div
                                                                                className={`${badgePadding} rounded-full flex justify-center items-center`}
                                                                                style={{ backgroundColor: COLOR_PURPLE }}
                                                                            >
                                                                                <div
                                                                                    className={`text-center ${badgeFontSize} font-medium font-['Helvetica_Now_Display'] leading-tight`}
                                                                                    style={{ color: COLOR_BADGE_TEXT }}
                                                                                >
                                                                                    {leafData.diagnosticTrials}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                        {leafData.therapyTrials > 0 && (
                                                                            <div
                                                                                className={`${badgePadding} rounded-full flex justify-center items-center`}
                                                                                style={{ backgroundColor: COLOR_PRIMARY_BLUE }}
                                                                            >
                                                                                <div
                                                                                    className={`text-center ${badgeFontSize} font-medium font-['Helvetica_Now_Display'] leading-tight`}
                                                                                    style={{ color: COLOR_BADGE_TEXT }}
                                                                                >
                                                                                    {leafData.therapyTrials}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Bottom Section: Company Name */}
                                                            {showCompanyName && (
                                                                <div className="self-stretch inline-flex justify-between items-center mt-auto">
                                                                    <div
                                                                        className={`flex-1 justify-start text-Black ${companyNameSize} font-medium font-['Helvetica_Now_Display'] leading-tight ${nameLineClamp()}`}
                                                                    >
                                                                        {leafData.name}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground p-4 text-center">
                                                <p>{dimensions.width <= 0 || dimensions.height <= 0 ? "Adjusting treemap layout..." : `No company data available for the '${getTabDisplayText(activeTab)}' category.`}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* ---- TABLE VIEW ---- */}
                                {!isLoading && viewMode === "table" && getProcessedCompanies().length > 0 && (
                                    <TableWithTooltips className="mb-6">
                                        <TableComponent>
                                            <TableHeaderComponent className="sticky top-0 z-20">
                                                <TableRowComponent>
                                                    <TableHeadComponent align="left">Company</TableHeadComponent>
                                                    <TableHeadComponent align="center">Clinical Trials</TableHeadComponent>
                                                    <TableHeadComponent align="center">Phase 1</TableHeadComponent>
                                                    <TableHeadComponent align="center">Phase 2</TableHeadComponent>
                                                    <TableHeadComponent align="center">Phase 3</TableHeadComponent>
                                                    <TableHeadComponent align="center">Diseases</TableHeadComponent>
                                                    <TableHeadComponent align="center">Diagnostic / Therapy</TableHeadComponent>
                                                </TableRowComponent>
                                            </TableHeaderComponent>
                                            <TableBodyComponent>
                                                {getProcessedCompanies().map((company) => {
                                                    return (
                                                        <TableRowComponent key={company.name}>
                                                            <TableCellComponent align="left" 
                                                                hasTooltip={true} 
                                                                tooltipContent={
                                                                    <div className="px-3 py-2">
                                                                        <h4 className={styles.typography.cardSubtitle()}>{company.name}</h4>
                                                                    </div>
                                                                }
                                                            >
                                                                {company.name}
                                                            </TableCellComponent>
                                                            <TableCellComponent align="center">
                                                                {company.allTrials}
                                                            </TableCellComponent>
                                                            <TableCellComponent align="center">
                                                                {company.phase1Trials}
                                                            </TableCellComponent>
                                                            <TableCellComponent align="center">
                                                                {company.phase2Trials}
                                                            </TableCellComponent>
                                                            <TableCellComponent align="center">
                                                                {company.phase3Trials}
                                                            </TableCellComponent>
                                                            <TableCellComponent align="center" 
                                                                hasTooltip={company.diseaseCount > 0} 
                                                                tooltipContent={company.diseases.length > 0 ? 
                                                                    <TooltipList items={company.diseases} /> : 
                                                                    <div className="px-3 py-2 text-body-small text-grey">No diseases listed</div>
                                                                }
                                                            >
                                                                {company.diseaseCount}
                                                            </TableCellComponent>
                                                            <TableCellComponent align="center">
                                                                <div className="flex justify-center space-x-4">
                                                                    {company.diagnosticTrials > 0 && (
                                                                        <span className="px-4 py-1.5 text-xs rounded-full bg-light-diagnostic">
                                                                            {company.diagnosticTrials}
                                                                        </span>
                                                                    )}
                                                                    {company.therapyTrials > 0 && (
                                                                        <span className="px-4 py-1.5 text-xs rounded-full bg-light-therapy">
                                                                            {company.therapyTrials}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </TableCellComponent>
                                                        </TableRowComponent>
                                                    );
                                                })}
                                            </TableBodyComponent>
                                        </TableComponent>
                                    </TableWithTooltips>
                                )}
                            </div>
                        )}
                         {/* Handle case where apiData exists but apiData.company is missing/empty */}
                         {!isLoading && !error && apiData && !apiData.company && (
                             <div className="text-center p-10 text-muted-foreground min-h-[400px] flex items-center justify-center">
                                 <p>Data loaded, but no company information was found in the response.</p>
                             </div>
                         )}

                        {/* Footer */}
                        <div className="text-left text-body-small font-helvetica-now text-grey md:my-8">
                            <p>Last updated: June, 2025</p>
                            <p className="mt-1">
                                Help us keep things accurate. If you notice any outdated or incorrect information, email us at <a href="mailto:info@firm.inc" className="text-primary-blue hover:underline">info@firm.inc</a>
                            </p>
                        </div>

                        <div className="border-t border-borde text-muted-foreground text-sm text-center">
                            {apiData?.metadata?.total_trials_processed && !isLoading && !error && apiData?.company && (
                                <p>
                                    Analysis based on {apiData.metadata.total_trials_processed.toLocaleString()} processed trials.
                                    {viewMode === 'treemap' && top15Companies.length > 0 && ` Displaying top ${top15Companies.length} companies via treemap for '${getTabDisplayText(activeTab)}'.`}
                                    {viewMode === 'table' && processedData.length > 0 && ` Displaying ${processedData.length} companies via table for '${getTabDisplayText(activeTab)}'.`}
                                    {((viewMode === 'treemap' && top15Companies.length === 0) || (viewMode === 'table' && processedData.length === 0)) && ` No companies found matching the criteria for '${getTabDisplayText(activeTab)}'.`}
                                </p>
                            )}
                            {!isLoading && !error && apiData && processedData.length === 0 && apiData.company && (
                                <p>No companies met the criteria for display in the &apos;{getTabDisplayText(activeTab)}&apos; category.</p>
                            )}
                            {!isLoading && !error && apiData && !apiData.company && (
                                <p>Data loaded, but required &apos;company&apos; information was missing.</p>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </TooltipProvider>
    );
};


// --- Tooltip Content Component (Keep as refined before) ---
const CompanyTooltipContent = React.memo(({ data, activeTab, showOnly, getTabDisplayText }: { 
    data: CompanyTreemapNodeData | null, 
    activeTab: TabType, 
    showOnly?: 'diseases' | 'all',
    getTabDisplayText: (tab: TabType) => string 
}) => {
    if (!data) return null;
    const isOnlyDiseases = showOnly === 'diseases';

    const renderList = (items: string[], maxToShow = 5, title: string) => {
        if (!items || items.length === 0) return <p className="text-muted-foreground/70 text-[10px] italic mt-1">{title}: None listed.</p>;
        const displayItems = items.slice(0, maxToShow);
        const remainingCount = items.length - maxToShow;
        return (
            <div className={isOnlyDiseases ? "" : "pt-1.5 mt-1.5 border-t border-border/50"}> {/* Slightly more padding */}
                <p className="font-semibold text-foreground/90 mb-1 text-xs">{title}:</p>
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

    // More descriptive phase text for tooltip
    const phaseTextMap: Record<TabType, string> = { clinical: "Trials (All Phases)", phase1: "Phase 1 Trials", phase2: "Phase 2 Trials", phase3: "Phase 3 Trials" };
    const sortValueLabel = activeTab === 'clinical' ? 'Total Trials' : `${getTabDisplayText(activeTab)} Trials`;

    return (
        <div className="space-y-1.5 text-xs font-helvetica-now-text">
            <h4 className="font-bold text-sm text-foreground mb-1.5">{data.name}</h4>

             {!isOnlyDiseases && (
                 <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[11px]">
                    {/* Show the value used for sorting/sizing */}
                    <div className="font-medium text-foreground/90">{sortValueLabel} (Sort):</div>
                    <div className="text-right text-muted-foreground font-semibold">{data.value}</div>

                    {/* Always show totals */}
                    <div className="font-medium text-foreground/90">Total Trials:</div>
                    <div className="text-right text-muted-foreground">{data.allTrials}</div>
                    <div className="font-medium text-foreground/90">Diagnostic:</div>
                    <div className="text-right text-muted-foreground">{data.diagnosticTrials}</div>
                    <div className="font-medium text-foreground/90">Therapy:</div>
                    <div className="text-right text-muted-foreground">{data.therapyTrials}</div>
                    <div className="font-medium text-foreground/90">Diseases:</div>
                    <div className="text-right text-muted-foreground">{data.diseaseCount}</div>
                 </div>
             )}

            {renderList(data.diseases, isOnlyDiseases ? 10 : 5, isOnlyDiseases ? `Top Diseases (${data.diseaseCount} total)` : "Top Diseases (Overall)")}
        </div> 
    );
});
CompanyTooltipContent.displayName = 'CompanyTooltipContent';

export default CompanyTreemapDisplay;