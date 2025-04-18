// components/RadioisotopePeriodicDisplay.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { Tabs } from "@/components/ui";

/* -------------------------------------------------------------------------- */
/*                               Type helpers                                 */
/* -------------------------------------------------------------------------- */

interface StudyCounts {
  all: number;
  diagnostic: number;
  therapy: number;
}

interface DataDetail {
  study_counts: StudyCounts;
  nct_ids: { count: number; list: string[] };
  diseases: { count: number; list: string[] };
  companies: { count: number; list: string[] };
}

interface IsotopeDataEntry {
  phase_1: DataDetail;
  phase_2: DataDetail;
  phase_3: DataDetail;
  phase_other: DataDetail;
  total: DataDetail;
}

interface ApiResponse {
  [key: string]: any;
}

/* -------------------------------------------------------------------------- */
/*                   Merging logic & dealing with different keys              */
/* -------------------------------------------------------------------------- */

const emptyDataDetail: DataDetail = {
  study_counts: { all: 0, diagnostic: 0, therapy: 0 },
  nct_ids: { count: 0, list: [] },
  diseases: { count: 0, list: [] },
  companies: { count: 0, list: [] },
};

const emptyIsotopeEntry: IsotopeDataEntry = {
  phase_1: emptyDataDetail,
  phase_2: emptyDataDetail,
  phase_3: emptyDataDetail,
  phase_other: emptyDataDetail,
  total: emptyDataDetail,
};

// aliases → canonical keys ---------------------------------------------------
const aliasToCanonical: Record<string, string> = {
  "pb-203": "lead-203",
  "pb203": "lead-203",
  "ra-224": "radium-224",
  "ra224": "radium-224",
  "sm-153": "samarium-153",
  "sm153": "samarium-153",
  // new additions
  "ga-68": "gallium-68",
  "ga68": "gallium-68",
  "zr-89": "zirconium-89",
  "zr89": "zirconium-89",
};

const canonicalise = (raw: string) => {
  const normalizedKey = raw
    .trim()
    .toLowerCase()
    // catch all unicode dash varieties (‑ – — −)
    .replace(/[\u2010-\u2015\u2212]/g, "-")
    .replace(/\s+/g, "");
  
  return aliasToCanonical[normalizedKey] || normalizedKey;
};

const uniq = (a: string[] = [], b: string[] = []) =>
  Array.from(new Set([...a, ...b]));

const mergeCounts = (a?: StudyCounts, b?: StudyCounts): StudyCounts => ({
  all: (a?.all ?? 0) + (b?.all ?? 0),
  diagnostic: (a?.diagnostic ?? 0) + (b?.diagnostic ?? 0),
  therapy: (a?.therapy ?? 0) + (b?.therapy ?? 0),
});

const mergeDetail = (a?: DataDetail, b?: DataDetail): DataDetail => {
  if (!a && !b) return emptyDataDetail;
  
  const aNctIds = a?.nct_ids?.list || [];
  const bNctIds = b?.nct_ids?.list || [];
  
  const aDiseases = a?.diseases?.list || [];
  const bDiseases = b?.diseases?.list || [];
  
  const aCompanies = a?.companies?.list || [];
  const bCompanies = b?.companies?.list || [];

  return {
    study_counts: mergeCounts(a?.study_counts, b?.study_counts),
    nct_ids: {
      count: aNctIds.length + bNctIds.length,
      list: uniq(aNctIds, bNctIds),
    },
    diseases: {
      count: aDiseases.length + bDiseases.length,
      list: uniq(aDiseases, bDiseases),
    },
    companies: {
      count: aCompanies.length + bCompanies.length,
      list: uniq(aCompanies, bCompanies),
    },
  };
};

const mergeEntries = (a: IsotopeDataEntry, b: IsotopeDataEntry): IsotopeDataEntry => ({
  phase_1: mergeDetail(a.phase_1, b.phase_1),
  phase_2: mergeDetail(a.phase_2, b.phase_2),
  phase_3: mergeDetail(a.phase_3, b.phase_3),
  phase_other: mergeDetail(a.phase_other, b.phase_other),
  total: mergeDetail(a.total, b.total),
});

/**
 * Creates a standardized IsotopeDataEntry from raw API data
 */
function createIsotopeEntry(rawData: any): IsotopeDataEntry {
  // Handle case where data might not match expected structure
  if (!rawData) return emptyIsotopeEntry;
  
  // Extract phase data or use empty defaults
  const phase_1 = rawData.phase_1 || emptyDataDetail;
  const phase_2 = rawData.phase_2 || emptyDataDetail;
  const phase_3 = rawData.phase_3 || emptyDataDetail;
  
  // Combine phase 4 and preclinical into phase_other
  const phase4      = rawData.phase_4 || emptyDataDetail;
  const preclinical = rawData.preclinical || emptyDataDetail;
  const existing    = rawData.phase_other || emptyDataDetail;
  const phase_other = mergeDetail(existing, mergeDetail(phase4, preclinical));
  
  // Use total from raw data or create it by merging all phases
  const providedTotal = rawData.total;
  const calculatedTotal = providedTotal || mergeDetail(
    mergeDetail(phase_1, phase_2),
    mergeDetail(phase_3, phase_other)
  );

  return {
    phase_1,
    phase_2,
    phase_3,
    phase_other,
    total: calculatedTotal
  };
}

/* -------------------------------------------------------------------------- */
/*                         Static data for display                            */
/* -------------------------------------------------------------------------- */

interface RadioisotopeElement {
  atomic: number;
  symbol: string;
}

const radioisotopeHalfLives: Record<string, string> = {
  "actinium-225": "9.92 d",
  "carbon-11": "20.36 m",
  "copper-64": "12.70 h",
  "copper-67": "61.83 h",
  "fluorine-18": "109.77 m",
  "gallium-68": "67.71 m",
  "holmium-166": "26.82 h",
  "iodine-123": "13.22 h",
  "iodine-124": "4.17 d",
  "iodine-131": "8.03 d",
  "indium-111": "2.80 d",
  "lutetium-177": "6.65 d",
  "phosphorus-32": "14.27 d",
  "lead-203": "51.9 h",
  "lead-212": "10.62 h",
  "radium-223": "11.43 d",
  "radium-224": "3.66 d",
  "rhenium-186": "3.72 d",
  "rhenium-188": "17.00 h",
  "samarium-153": "46.3 h",
  "strontium-89": "50.56 d",
  "technetium-99m": "6.00 h",
  "thorium-227": "18.70 d",
  "yttrium-90": "64.05 h",
  "zirconium-89": "78.41 h",
};

const radioisotopeElements: Record<string, RadioisotopeElement> = {
  "actinium-225": { atomic: 89, symbol: "Ac" },
  "carbon-11": { atomic: 6, symbol: "C" },
  "copper-64": { atomic: 29, symbol: "Cu" },
  "copper-67": { atomic: 29, symbol: "Cu" },
  "fluorine-18": { atomic: 9, symbol: "F" },
  "gallium-68": { atomic: 31, symbol: "Ga" },
  "holmium-166": { atomic: 67, symbol: "Ho" },
  "iodine-123": { atomic: 53, symbol: "I" },
  "iodine-124": { atomic: 53, symbol: "I" },
  "iodine-131": { atomic: 53, symbol: "I" },
  "indium-111": { atomic: 49, symbol: "In" },
  "lutetium-177": { atomic: 71, symbol: "Lu" },
  "phosphorus-32": { atomic: 15, symbol: "P" },
  "lead-203": { atomic: 82, symbol: "Pb" },
  "lead-212": { atomic: 82, symbol: "Pb" },
  "radium-223": { atomic: 88, symbol: "Ra" },
  "radium-224": { atomic: 88, symbol: "Ra" },
  "rhenium-186": { atomic: 75, symbol: "Re" },
  "rhenium-188": { atomic: 75, symbol: "Re" },
  "samarium-153": { atomic: 62, symbol: "Sm" },
  "strontium-89": { atomic: 38, symbol: "Sr" },
  "technetium-99m": { atomic: 43, symbol: "Tc" },
  "thorium-227": { atomic: 90, symbol: "Th" },
  "yttrium-90": { atomic: 39, symbol: "Y" },
  "zirconium-89": { atomic: 40, symbol: "Zr" },
};

const radioisotopeCategories: Record<string, string[]> = {
  "α-emitters": [
    "actinium-225",
    "radium-223",
    "radium-224",
    "thorium-227",
  ],
  "β-emitters": [
    "phosphorus-32",
    "holmium-166",
    "lutetium-177",
    "rhenium-186",
    "rhenium-188",
    "samarium-153",
    "strontium-89",
  ],
  "Positron emitters": [
    "carbon-11",
    "fluorine-18",
    "gallium-68",
    "copper-64",
    "zirconium-89",
    "iodine-124",
  ],
  "γ-emitters": [
    "copper-67",
    "gallium-68",
    "iodine-123",
    "iodine-131",
    "indium-111",
    "lead-203",
    "lead-212",
    "technetium-99m",
    "yttrium-90",
  ],
};

const categoryColors: Record<string, { bg: string; text: string }> = {
  "α-emitters": { bg: "bg-a-colour", text: "text-a-text" },
  "β-emitters": { bg: "bg-primary-blue", text: "text-white" },
  "Positron emitters": { bg: "bg-purple", text: "text-white" },
  "γ-emitters": { bg: "bg-g-color", text: "text-g-text" },
};

/* -------------------------------------------------------------------------- */
/*                    Tooltip & tab type definitions                          */
/* -------------------------------------------------------------------------- */

interface TooltipDataType {
  name: string;
  relevantDiseases?: string[];
  relevantCompanies?: string[];
  contextLabel: string;
}

type TabType =
  | "halflife"
  | "phase1"
  | "phase2"
  | "phase3"
  | "disease"
  | "companies";

/* -------------------------------------------------------------------------- */
/*                                Component                                   */
/* -------------------------------------------------------------------------- */

const RadioisotopePeriodicDisplay = () => {
  const [apiData, setApiData] = useState<Record<string, IsotopeDataEntry> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("halflife");
  const [debugInfo, setDebugInfo] = useState<string | null>(null);

  // Fetch & unify data -------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch the data
        const res = await fetch(
          "https://r-eco-52zl8.ondigitalocean.app/visualising"
        );
        
        if (!res.ok) {
          throw new Error(`API request failed with status: ${res.status}`);
        }
        
        // Parse the JSON response
        const rawData: ApiResponse = await res.json();
        let isotopeData: ApiResponse;
        
        // Check if the data has a nested 'isotope' property
        if (rawData.isotope && typeof rawData.isotope === 'object') {
          isotopeData = rawData.isotope;
          setDebugInfo("Using nested isotope data");
        } else {
          // Otherwise, treat the entire response as the isotope data
          isotopeData = rawData;
          setDebugInfo("Using top-level data as isotope data");
        }
        
        // Debug: Check what keys we have
        console.log("API Keys:", Object.keys(isotopeData));
        
        // Process the isotope data into our standardized format
        const processedData: Record<string, IsotopeDataEntry> = {};
        
        for (const [rawKey, rawValue] of Object.entries(isotopeData)) {
          // Skip non-object properties
          if (typeof rawValue !== 'object' || rawValue === null) continue;
          
          // Canonicalize the isotope key name
          const canonicalKey = canonicalise(rawKey);
          
          // Create a standardized entry from the raw data
          const isotopeEntry = createIsotopeEntry(rawValue);
          
          // If we already have data for this isotope, merge it 
          if (processedData[canonicalKey]) {
            processedData[canonicalKey] = mergeEntries(
              processedData[canonicalKey],
              isotopeEntry
            );
          } else {
            // Otherwise, add the new entry
            processedData[canonicalKey] = isotopeEntry;
          }
        }
        
        console.log("Processed data keys:", Object.keys(processedData));
        setApiData(processedData);
        
      } catch (err) {
        console.error("Error fetching isotope data:", err);
        setError(err instanceof Error ? err.message : String(err));
        setApiData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ----------------------------- helpers ---------------------------------- */

  const prettyName = (iso: string) =>
    iso.replace(/^([a-z])/, (m) => m.toUpperCase());

  const tabLabel = (): string => {
    switch (activeTab) {
      case "phase1":
        return "Phase 1 Trials";
      case "phase2":
        return "Phase 2 Trials";
      case "phase3":
        return "Phase 3 Trials";
      case "disease":
        return "Total Diseases";
      case "companies":
        return "Total Companies";
      default:
        return "Half Life";
    }
  };

  const getDisplayValue = (iso: string): string | number => {
    if (!apiData) return "?";
    const entry = apiData[iso];
    if (!entry) return "?";

    switch (activeTab) {
      case "halflife":
        return radioisotopeHalfLives[iso] ?? "?";
      case "phase1":
        return entry.phase_1?.study_counts?.all ?? 0;
      case "phase2":
        return entry.phase_2?.study_counts?.all ?? 0;
      case "phase3":
        return entry.phase_3?.study_counts?.all ?? 0;
      case "disease":
        return entry.total?.diseases?.count ?? 0;
      case "companies":
        return entry.total?.companies?.count ?? 0;
      default:
        return radioisotopeElements[iso]?.symbol ?? "?";
    }
  };

  const prepareTooltipData = (iso: string): TooltipDataType | null => {
    if (!apiData) return null;
    const entry = apiData[iso];
    if (!entry) return null;

    let diseases: string[] | undefined;
    let companies: string[] | undefined;
    let show = false;

    if (["phase1", "phase2", "phase3"].includes(activeTab)) {
      const phaseMap: Record<string, DataDetail> = {
        phase1: entry.phase_1,
        phase2: entry.phase_2,
        phase3: entry.phase_3,
      };
      const phase = phaseMap[activeTab];
      diseases  = phase?.diseases?.list;
      companies = phase?.companies?.list;
      show = true;
    } else if (activeTab === "disease") {
      diseases = entry.total?.diseases?.list;
      show = true;
    } else if (activeTab === "companies") {
      companies = entry.total?.companies?.list;
      show = true;
    }

    if (!show) return null;

    return {
      name: prettyName(iso),
      relevantDiseases: diseases,
      relevantCompanies: companies,
      contextLabel: tabLabel(),
    };
  };

  const getOpacityClass = (val: string | number): string => {
    if (activeTab === "halflife" && typeof val === "string") {
      if (val.includes("m")) return "opacity-40";
      if (val.includes("h")) return "opacity-60";
      if (val.includes("d")) return "opacity-80";
      return "opacity-100";
    }
    const n = Number(val);
    if (!n) return "opacity-40";
    if (n <= 2) return "opacity-60";
    if (n <= 5) return "opacity-80";
    return "opacity-100";
  };

  /* ------------------------------------------------------------------------ */
  /*                                Render                                    */
  /* ------------------------------------------------------------------------ */
  return (
    <TooltipProvider delayDuration={100}>
      <section className="w-full bg-white py-12 md:py-16">
        <div className="px-8 md:px-16 lg:px-24">
          <h2 className="text-h3 font-helvetica-now text-black mb-6 md:mb-8">
            Radioisotopes by study volume, clinical stage, diseases and companies
          </h2>

          {debugInfo && (
            <div className="text-sm text-gray-500 mb-4">
              {debugInfo}
            </div>
          )}

          <Tabs
            titleTabs={[
              { id: "halflife",  label: "Half Life" },
              { id: "phase1",   label: "Phase 1" },
              { id: "phase2",   label: "Phase 2" },
              { id: "phase3",   label: "Phase 3" },
              { id: "disease",  label: "Disease" },
              { id: "companies",label: "Companies" },
            ]}
            defaultTitleTab={activeTab}
            onTitleTabChange={(id) => setActiveTab(id as TabType)}
            className="mb-8"
          />

          {isLoading && (
            <div className="text-center p-6 text-body text-gray-500">
              Loading…
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md text-center">
              <p className="text-body-small">Error: {error}</p>
            </div>
          )}

          {!isLoading && !error && apiData && (
            <div className="space-y-8 md:space-y-12">
              {Object.entries(radioisotopeCategories).map(([category, isotopes]) => {
                const colors = categoryColors[category] ?? {
                  bg: "bg-gray-200",
                  text: "text-black",
                };

                const validIsotopes = isotopes.filter(
                  (iso) => radioisotopeElements[iso]
                );

                return (
                  <div key={category}>
                    <h3 className="text-h5 font-helvetica-now text-black mb-4">
                      {category}
                    </h3>

                    <div className="grid grid-cols-4 gap-3 sm:grid-cols-none sm:flex sm:flex-wrap sm:gap-3 md:gap-4">
                      {validIsotopes.map((iso) => {
                        const displayVal   = getDisplayValue(iso);
                        const tooltipData  = prepareTooltipData(iso);
                        const opacityClass = getOpacityClass(displayVal);
                        const elementInfo  = radioisotopeElements[iso];

                        return (
                          <Tooltip key={iso}>
                            <TooltipTrigger asChild>
                              <div
                                className={`
                                  ${colors.bg} ${colors.text}
                                  w-full sm:w-24 sm:h-24 md:w-28 md:h-28
                                  rounded-md p-2
                                  flex flex-col justify-between items-center relative
                                  transition-transform duration-150 ease-in-out
                                  hover:scale-105
                                  ${opacityClass}
                                  ${tooltipData ? "cursor-pointer" : "cursor-default"}
                                `}
                                style={{ aspectRatio: "1/1" }}
                                title={`${prettyName(iso)} – ${tabLabel()}: ${
                                  activeTab === "halflife" ? displayVal || "N/A" : displayVal
                                }`}
                              >
                                <div className="absolute top-1 left-1.5 text-xs opacity-70">
                                  {elementInfo?.atomic ?? ""}
                                </div>

                                <div className="flex-grow flex items-center justify-center">
                                  <span
                                    className={`${
                                      activeTab === "halflife"
                                        ? "text-xl sm:text-xl md:text-2xl"
                                        : "text-2xl sm:text-3xl md:text-3xl"
                                    } font-bold`}
                                  >
                                    {displayVal}
                                  </span>
                                </div>

                                <div className="w-full text-center text-xs whitespace-nowrap overflow-hidden text-ellipsis">
                                  {prettyName(iso)}
                                </div>
                              </div>
                            </TooltipTrigger>

                            {tooltipData && (
                              <TooltipContent
                                side="bottom"
                                align="center"
                                className="bg-white text-black p-0 rounded-md max-w-xs z-50 border border-light-grey shadow-none overflow-hidden"
                              >
                                {/* Diseases */}
                                {tooltipData.relevantDiseases?.length ? (
                                  <div className="w-full">
                                    <ul className="max-h-40 overflow-y-auto w-full">
                                      {tooltipData.relevantDiseases.map((d, i) => (
                                        <li key={i} className="w-full">
                                          <div className="px-3 py-2 text-body-small">{d}</div>
                                          {i < (tooltipData.relevantDiseases?.length ?? 0) - 1 && (
                                            <div className="w-full border-b border-light-grey"></div>
                                          )}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ) : null}

                                {tooltipData.relevantDiseases?.length === 0 &&
                                  ["disease", "phase1", "phase2", "phase3"].includes(activeTab) && (
                                    <p className="px-3 py-2 text-body-small text-grey">
                                      No specific diseases listed
                                    </p>
                                  )}

                                {/* Companies */}
                                {tooltipData.relevantCompanies?.length ? (
                                  <div className="w-full">
                                    {tooltipData.relevantDiseases?.length ? (
                                      <div className="w-full border-t border-light-grey mt-2"></div>
                                    ) : null}

                                    <ul
                                      className={`max-h-40 overflow-y-auto w-full ${
                                        tooltipData.relevantDiseases?.length ? "pt-2" : ""
                                      }`}
                                    >
                                      {tooltipData.relevantCompanies.map((c, i) => (
                                        <li key={i} className="w-full">
                                          <div className="px-3 py-2 text-body-small">{c}</div>
                                          {i < (tooltipData.relevantCompanies?.length ?? 0) - 1 && (
                                            <div className="w-full border-b border-light-grey"></div>
                                          )}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ) : null}

                                {tooltipData.relevantCompanies?.length === 0 &&
                                  activeTab === "companies" && (
                                    <p className="px-3 py-2 text-body-small text-grey">
                                      No specific companies listed
                                    </p>
                                  )}
                              </TooltipContent>
                            )}
                          </Tooltip>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!isLoading && !error && (
            <footer className="mt-12 md:mt-16">
              <p className="text-left text-body-small font-helvetica-now text-grey">
                Last updated: April 2025
              </p>
              <p className="text-left text-body-small font-helvetica-now text-grey mt-1">
                Spot an error? Email{" "}
                <a
                  href="mailto:info@firm.inc"
                  className="text-primary-blue hover:underline"
                >
                  info@firm.inc
                </a>
              </p>
              <hr className="border-t border-light-grey w-full my-12 md:my-16" />
            </footer>
          )}
        </div>
      </section>
    </TooltipProvider>
  );
};

export default RadioisotopePeriodicDisplay;