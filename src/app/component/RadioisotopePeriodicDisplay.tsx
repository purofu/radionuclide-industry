// components/RadioisotopePeriodicDisplay.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip"; // Assuming this path is correct
import { Tabs } from "@/components/ui"; // Import our new Tabs component

// --- Interfaces (Updated to match provided JSON structure) ---
interface StudyCounts {
  all: number;
  diagnostic: number;
  therapy: number;
}

interface DataDetail {
  study_counts: StudyCounts;
  nct_ids: { // Added to match JSON
    count: number;
    list: string[];
  };
  diseases: {
    count: number;
    list: string[];
  };
  companies: { // Changed to non-optional based on JSON example
    count: number;
    list: string[];
  };
}

interface IsotopeDataEntry {
  phase_1: DataDetail;     // Renamed from "phase 1"
  phase_2: DataDetail;     // Renamed from "phase 2"
  phase_3: DataDetail;     // Renamed from "phase 3"
  phase_other: DataDetail; // Added
  total: DataDetail;       // Added, replacing "clinical trials" concept for totals
}

interface FullApiResponse {
  isotope: { [isotopeName: string]: IsotopeDataEntry };
}

interface RadioisotopeElement {
  atomic: number;
  symbol: string;
}

// This interface describes the *content* for the tooltip
interface TooltipDataType {
  name: string;
  relevantDiseases?: string[];
  relevantCompanies?: string[];
  contextLabel: string; // Label indicating the source of the data (e.g., "Phase 1", "Total Diseases")
}

type TabType =
  | "halflife"
  | "phase1"
  | "phase2"
  | "phase3"
  | "disease"
  | "companies";

// --- Component Implementation ---
const RadioisotopePeriodicDisplay = () => {
  const [apiData, setApiData] = useState<FullApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("halflife");

  // --- Hardcoded Data (Keep as is) ---
  const radioisotopeHalfLives: { [key: string]: string } = { "astatine-211": "7.21 h", "bismuth-213": "45.59 m", "actinium-225": "9.92 d", "radium-223": "11.43 d", "thorium-227": "18.70 d", "phosphorus-32": "14.27 d", "scandium-47": "3.35 d", "copper-67": "61.83 h", "strontium-89": "50.56 d", "yttrium-90": "64.05 h", "iodine-131": "8.03 d", "holmium-166": "26.82 h", "lutetium-177": "6.65 d", "rhenium-186": "3.72 d", "rhenium-188": "17.00 h", "lead-212": "10.62 h", "carbon-11": "20.36 m", "nitrogen-13": "9.97 m", "oxygen-15": "2.13 m", "fluorine-18": "109.77 m", "copper-61": "3.34 h", "copper-64": "12.70 h", "gallium-66": "9.49 h", "gallium-68": "67.71 m", "rubidium-82": "1.26 m", "zirconium-89": "78.41 h", "iodine-124": "4.17 d", "gallium-67": "3.26 d", "technetium-99m": "6.00 h", "indium-111": "2.80 d", "iodine-123": "13.22 h" };
  const radioisotopeElements: { [key: string]: RadioisotopeElement } = { "astatine-211": { atomic: 85, symbol: "At" }, "bismuth-213": { atomic: 83, symbol: "Bi" }, "actinium-225": { atomic: 89, symbol: "Ac" }, "radium-223": { atomic: 88, symbol: "Ra" }, "thorium-227": { atomic: 90, symbol: "Th" }, "phosphorus-32": { atomic: 15, symbol: "P" }, "scandium-47": { atomic: 21, symbol: "Sc" }, "copper-67": { atomic: 29, symbol: "Cu" }, "strontium-89": { atomic: 38, symbol: "Sr" }, "yttrium-90": { atomic: 39, symbol: "Y" }, "iodine-131": { atomic: 53, symbol: "I" }, "holmium-166": { atomic: 67, symbol: "Ho" }, "lutetium-177": { atomic: 71, symbol: "Lu" }, "rhenium-186": { atomic: 75, symbol: "Re" }, "rhenium-188": { atomic: 75, symbol: "Re" }, "lead-212": { atomic: 82, symbol: "Pb" }, "carbon-11": { atomic: 6, symbol: "C" }, "nitrogen-13": { atomic: 7, symbol: "N" }, "oxygen-15": { atomic: 8, symbol: "O" }, "fluorine-18": { atomic: 9, symbol: "F" }, "copper-61": { atomic: 29, symbol: "Cu" }, "copper-64": { atomic: 29, symbol: "Cu" }, "gallium-66": { atomic: 31, symbol: "Ga" }, "gallium-68": { atomic: 31, symbol: "Ga" }, "rubidium-82": { atomic: 37, symbol: "Rb" }, "zirconium-89": { atomic: 40, symbol: "Zr" }, "iodine-124": { atomic: 53, symbol: "I" }, "gallium-67": { atomic: 31, symbol: "Ga" }, "technetium-99m": { atomic: 43, symbol: "Tc" }, "indium-111": { atomic: 49, symbol: "In" }, "iodine-123": { atomic: 53, symbol: "I" } };
  const radioisotopeCategories: { [key: string]: string[] } = { "α-emitters": ["astatine-211", "bismuth-213", "actinium-225", "radium-223", "thorium-227"], "β-emitters": ["phosphorus-32", "scandium-47", "copper-67", "strontium-89", "yttrium-90", "iodine-131", "holmium-166", "lutetium-177", "rhenium-186", "rhenium-188", "lead-212"], "Positron emitters": ["carbon-11", "nitrogen-13", "oxygen-15", "fluorine-18", "copper-61", "copper-64", "gallium-66", "gallium-68", "rubidium-82", "zirconium-89", "iodine-124"], "γ-emitters": ["gallium-67", "technetium-99m", "indium-111", "iodine-123"] };
  const categoryColors: { [key: string]: { bg: string; text: string } } = {
    "α-emitters": { bg: "bg-a-colour", text: "text-a-text" }, // Ensure these Tailwind classes exist in your config
    "β-emitters": { bg: "bg-primary-blue", text: "text-white" },
    "Positron emitters": { bg: "bg-purple", text: "text-white" },
    "γ-emitters": { bg: "bg-g-color", text: "text-g-text" }
  };

  // --- API Fetching (Keep as is) ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "https://r-eco-52zl8.ondigitalocean.app/visualising" // Using the provided URL
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data: FullApiResponse = await response.json();
        setApiData(data);
         // console.log("API Data Loaded:", data); // Debugging
      } catch (err) {
        console.error("Error loading data:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setApiData(null); // Clear data on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []); // Empty dependency array ensures this runs only once on mount

  // --- Data Logic (Updated for new JSON structure) ---
  const getDisplayValue = (isotopeName: string): string | number => {
    const isotopeData = apiData?.isotope?.[isotopeName];
    const element = radioisotopeElements[isotopeName];
    let value: string | number = 0; // Default to 0 or appropriate indicator

    switch (activeTab) {
      case "halflife":
        // Show half-life instead of element symbol
        value = radioisotopeHalfLives[isotopeName] || "?";
        break;
      case "phase1":
        // Access using the new key 'phase_1'
        value = isotopeData?.phase_1?.study_counts?.all ?? 0;
        break;
      case "phase2":
        // Access using the new key 'phase_2'
        value = isotopeData?.phase_2?.study_counts?.all ?? 0;
        break;
      case "phase3":
        // Access using the new key 'phase_3'
        value = isotopeData?.phase_3?.study_counts?.all ?? 0;
        break;
      case "disease":
        // Access disease count from the 'total' object
        value = isotopeData?.total?.diseases?.count ?? 0;
        break;
      case "companies":
        // Access company count from the 'total' object
        value = isotopeData?.total?.companies?.count ?? 0;
        break;
      default:
        value = element?.symbol || "?"; // Fallback to symbol
        break;
    }
    return value;
  };

  const getTabDisplayText = (): string => {
     switch (activeTab) {
       case "halflife": return "Symbol (Half Life)";
       case "phase1": return "Phase 1 Trials";
       case "phase2": return "Phase 2 Trials";
       case "phase3": return "Phase 3 Trials";
       case "disease": return "Total Diseases Targeted (Count)"; // Updated label
       case "companies": return "Total Companies Involved (Count)"; // Updated label
       default: return "Symbol (Half Life)";
     }
  };

  const formatIsotopeName = (name: string): string => {
     // Simple capitalization: "holmium-166" -> "Holmium-166"
     return name.replace(/^([a-z])/, (match) => match.toUpperCase());
  };

  // --- Tooltip Data Preparation Logic (Updated for new JSON structure) ---
  const prepareTooltipData = (isotopeName: string): TooltipDataType | null => {
    if (!apiData) return null; // Need API data

    const isotopeData = apiData.isotope?.[isotopeName];
    const elementInfo = radioisotopeElements[isotopeName];

    // If no basic element info or no specific API data for *this* isotope, no tooltip details.
    if (!elementInfo || !isotopeData) {
      // console.log(`No API data for ${isotopeName}, cannot prepare tooltip.`); // Debugging
      return null;
    }

    let relevantDiseases: string[] | undefined = undefined;
    let relevantCompanies: string[] | undefined = undefined;
    let contextLabel = "Details"; // Default/fallback label
    let showTooltip = false; // Determine if there's relevant detail to show

    // Only prepare detailed data if a relevant tab is active
    if (activeTab !== 'halflife') {
      // Map the active tab ('phase1') to the corresponding JSON key ('phase_1')
      const phaseMap: { [key in TabType]?: keyof IsotopeDataEntry } = {
        phase1: "phase_1",
        phase2: "phase_2",
        phase3: "phase_3",
      };
      const currentPhaseJsonKey = phaseMap[activeTab];

      if (currentPhaseJsonKey) {
          // It's a phase tab (phase1, phase2, or phase3)
          const phaseData = isotopeData[currentPhaseJsonKey];
          if (phaseData) { // Check if data exists for this specific phase
              relevantDiseases = phaseData.diseases?.list;
              // Optionally add companies for phase-specific view if needed
              // relevantCompanies = phaseData.companies?.list;
              contextLabel = `Phase ${activeTab.slice(-1)}`; // "Phase 1", "Phase 2", etc.
              showTooltip = true;
          }
      } else if (activeTab === 'disease') {
          // Disease tab - show total diseases
          if (isotopeData.total) { // Check if 'total' data exists
            relevantDiseases = isotopeData.total.diseases?.list;
            contextLabel = "Total Diseases";
            showTooltip = true;
          }
      } else if (activeTab === 'companies') {
          // Companies tab - show total companies
          if (isotopeData.total) { // Check if 'total' data exists
            relevantCompanies = isotopeData.total.companies?.list;
            contextLabel = "Total Companies";
            showTooltip = !!isotopeData.total.companies; // Show tooltip if companies data exists within total
          }
      }
    } else {
      // Optionally handle tooltip for 'halflife' tab if needed
      // contextLabel = `Half Life: ${radioisotopeHalfLives[isotopeName] || 'N/A'}`;
      // showTooltip = true; // If you want a tooltip even on the half-life tab
    }

    // Only return data if we determined a tooltip should be shown
    if (showTooltip) {
      return {
        name: formatIsotopeName(isotopeName),
        relevantDiseases,
        relevantCompanies,
        contextLabel, // Use the determined context label
      };
    }

    return null; // Return null if no relevant details for the current tab/isotope
  };


  // --- Tab Click Handler (Keep as is) ---
   const handleTabClick = (tab: TabType) => {
     setActiveTab(tab);
   };

  // Helper to determine color intensity based on value
  const getOpacityBasedOnValue = (value: string | number): string => {
    if (activeTab === 'halflife') {
      // For half-life tab, adjust opacity based on the half-life time
      if (typeof value === 'string') {
        // Check for minutes (m)
        if (value.includes('m')) return 'opacity-40';
        // Check for hours (h)
        if (value.includes('h')) return 'opacity-60';
        // Check for days (d)
        if (value.includes('d')) return 'opacity-80';
        // Default opacity
        return 'opacity-100';
      }
      return 'opacity-100';
    }
    
    // For other tabs - numeric value - determine opacity based on relative scale
    const numValue = Number(value);
    if (numValue === 0) return 'opacity-40';
    if (numValue <= 2) return 'opacity-60';
    if (numValue <= 5) return 'opacity-80';
    return 'opacity-100';
  };

  // --- Render Component ---
  return (
    // Wrap the component (or relevant part) in TooltipProvider
    <TooltipProvider delayDuration={100}> {/* Adjust delay as needed */}
      <section className="w-full bg-white py-12 md:py-16">
        <div className="px-8 md:px-16 lg:px-24">
          <h2 className="text-h3 font-helvetica-now text-black mb-6 md:mb-8 ">
          Radioisotopes by study volume, clinical stage, diseases and companies
          </h2>

          {/* Replace existing tabs with our new Tabs component */}
          <Tabs
            titleTabs={[
              { id: 'halflife', label: 'Half Life' },
              { id: 'phase1', label: 'Phase 1' },
              { id: 'phase2', label: 'Phase 2' },
              { id: 'phase3', label: 'Phase 3' },
              { id: 'disease', label: 'Disease' },
              { id: 'companies', label: 'Companies' },
            ]}
            defaultTitleTab={activeTab}
            onTitleTabChange={(tabId) => handleTabClick(tabId as TabType)}
            className="mb-8"
          />

          {/* Loading / Error States (Keep as is) */}
          {isLoading && <div className="text-center p-6 text-body text-gray-500"><p>Loading...</p></div>}
          {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md text-center"><p className="text-body-small">Error: {error}</p></div>}

          {/* Main Display Area */}
          {!isLoading && !error && apiData && (
            <div className="space-y-8 md:space-y-12">
              {Object.entries(radioisotopeCategories).map(([category, isotopes]) => {
                const colors = categoryColors[category] || { bg: 'bg-gray-200', text: 'text-black' };
                // Filter out any isotopes in categories that don't have basic element data
                const validIsotopes = isotopes.filter(iso => radioisotopeElements[iso]);

                return (
                  <div key={category}>
                    <h3 className="text-h5 font-helvetica-now text-black mb-4">{category}</h3>
                    <div className="grid grid-cols-4 gap-3 sm:grid-cols-none sm:flex sm:flex-wrap sm:gap-3 md:gap-4">
                      {validIsotopes.map((isotopeName) => {
                        // Prepare data needed for display and tooltip
                        const displayValue = getDisplayValue(isotopeName);
                        const element = radioisotopeElements[isotopeName];
                        const hasApiData = !!apiData?.isotope?.[isotopeName]; // Check if any data exists for this isotope
                        const tooltipData = prepareTooltipData(isotopeName); // Get potential tooltip content
                        const opacityClass = getOpacityBasedOnValue(displayValue);

                        return (
                          // Tooltip Root wraps each item
                          <Tooltip key={isotopeName}>
                            {/* Tooltip Trigger is the element to hover over */}
                            <TooltipTrigger asChild>
                              <div // Isotope Tile - Acts as Trigger
                                className={`
                                  ${colors.bg} ${colors.text}
                                  w-full sm:w-24 sm:h-24 md:w-28 md:h-28
                                  rounded-md p-2
                                  flex flex-col justify-between items-center relative
                                  transition-transform duration-150 ease-in-out hover:scale-105
                                  ${!hasApiData ? 'opacity-50' : opacityClass} 
                                  ${tooltipData ? 'cursor-pointer' : 'cursor-default'} 
                                `}
                                style={{ aspectRatio: '1/1' }}
                                // Standard title attribute for basic info / accessibility fallback
                                title={`${formatIsotopeName(isotopeName)} - ${getTabDisplayText()}: ${activeTab === 'halflife' ? radioisotopeHalfLives[isotopeName] || 'N/A' : displayValue}`}
                              >
                                <div className="absolute top-1 left-1.5 text-xs opacity-70">{element?.atomic || ""}</div>
                                <div className="flex-grow flex items-center justify-center">
                                  {/* Display the value determined by getDisplayValue */}
                                  <span className={`${activeTab === 'halflife' ? 'text-xl sm:text-xl md:text-2xl' : 'text-2xl sm:text-3xl md:text-3xl'} font-bold`}>{displayValue}</span>
                                </div>
                                <div className="w-full text-center text-xs whitespace-nowrap overflow-hidden text-ellipsis">{formatIsotopeName(isotopeName)}</div>
                              </div>
                            </TooltipTrigger>

                            {/* Tooltip Content - Renders only if tooltipData was successfully prepared */}
                            {tooltipData && (
                              <TooltipContent
                                side="bottom" // Position preference
                                align="center"
                                className="bg-white text-black p-0 rounded-md max-w-xs z-50 border border-light-grey shadow-none overflow-hidden"
                              >
                                {/* Show Diseases if relevant and available */}
                                {tooltipData.relevantDiseases && tooltipData.relevantDiseases.length > 0 && (
                                  <div className="w-full">
                                    <ul className="max-h-40 overflow-y-auto w-full">
                                      {tooltipData.relevantDiseases.map((d, i) => (
                                        <li key={i} className="w-full">
                                          <div className="px-3 py-2 text-body-small">{d}</div>
                                          {i < tooltipData.relevantDiseases!.length - 1 && (
                                            <div className="w-full border-b border-light-grey"></div>
                                          )}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {/* Show message if disease list is empty for the relevant context */}
                                {tooltipData.relevantDiseases?.length === 0 && (activeTab === 'disease' || activeTab.startsWith('phase')) && (
                                  <p className="px-3 py-2 text-body-small text-grey">No specific diseases listed</p>
                                )}

                                {/* Show Companies if relevant and available */}
                                {tooltipData.relevantCompanies && tooltipData.relevantCompanies.length > 0 && (
                                   <div className="w-full">
                                     {tooltipData.relevantDiseases && tooltipData.relevantDiseases.length > 0 && (
                                       <div className="w-full border-t border-light-grey mt-2"></div>
                                     )}
                                     <ul className={`max-h-40 overflow-y-auto w-full ${tooltipData.relevantDiseases && tooltipData.relevantDiseases.length > 0 ? "pt-2" : ""}`}>
                                        {tooltipData.relevantCompanies.map((c, i) => (
                                          <li key={i} className="w-full">
                                            <div className="px-3 py-2 text-body-small">{c}</div>
                                            {i < tooltipData.relevantCompanies!.length - 1 && (
                                              <div className="w-full border-b border-light-grey"></div>
                                            )}
                                          </li>
                                        ))}
                                     </ul>
                                   </div>
                                )}
                                {/* Show message if company list is empty for the relevant context */}
                                {tooltipData.relevantCompanies?.length === 0 && activeTab === 'companies' && (
                                   <p className="px-3 py-2 text-body-small text-grey">No specific companies listed</p>
                                )}
                              </TooltipContent>
                            )}
                          </Tooltip> // End Tooltip Root
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div> // End main display grid
          )}

          {/* Updated Footer Information */}
           {!isLoading && !error && apiData && (
             <div className="mt-12 md:mt-16 border-ts">               
               <div className="text-left text-body-small font-helvetica-now text-grey md:my-8">
                  <p>Last updated: {new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric'})}</p>
                  <p className="mt-1">
                  Help us keep things accurate. If you notice any outdated or incorrect information, email us at <a href="mailto:info@firm.inc" className="text-primary-blue hover:underline">info@firm.inc</a>
                  </p>
               </div>
               
               {/* Divider before footer text - using config border color */}
               <hr className="border-t border-light-grey w-full my-12 md:my-16" />
             </div>
           )}
        </div> {/* End container padding */}
      </section>
    </TooltipProvider>
  );
};

export default RadioisotopePeriodicDisplay;