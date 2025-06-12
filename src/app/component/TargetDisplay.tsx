"use client";

import React, { useEffect, useMemo, useState } from "react";

// ---------------------------------------------------------------------------
//  UI primitives ------------------------------------------------------------
// ---------------------------------------------------------------------------
import { Tabs, GridIcon, TableIcon } from "@/components/ui";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableWithTooltips,
  TooltipList,
} from "@/components/ui/table";

// ---------------------------------------------------------------------------
// 1) API types --------------------------------------------------------------
// ---------------------------------------------------------------------------
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
  study_counts?: StudyCounts;
  diseases?: DetailEntry;
  companies?: DetailEntry;
  nct_ids?: DetailEntry;
}

interface TargetSpecificData {
  total?: PhaseData;
  phase_1?: PhaseData;
  phase_2?: PhaseData;
  phase_3?: PhaseData;
  phase_4?: PhaseData;
  preclinical?: PhaseData;
  phase_other?: PhaseData;
}

interface ApiData {
  target?: Record<string, TargetSpecificData>;
}

// ---------------------------------------------------------------------------
// 2) Internal model ---------------------------------------------------------
// ---------------------------------------------------------------------------
interface TargetSummary {
  abbrev: string;
  display: string;
  fullName: string;
  description: string;
  image: string;
  clinical: number;
  p1: number;
  p2: number;
  p3: number;
  diseases: string[];
  companies: string[];
}

// ---------------------------------------------------------------------------
// 3)   *** MASTER LIST OF 9 TARGETS *** ------------------------------------
//      Edit fullName / description / image as desired.
// ---------------------------------------------------------------------------
const META = [
  {
    abbrev: "PSMA",
    display: "PSMA",
    labels: ["PSMA", "Prostate‑specific membrane antigen"],
    fullName: "Prostate‑Specific Membrane Antigen (PSMA)",
    description:
      "PSMA is highly over‑expressed on prostate cancer cells and internalises upon ligand binding – basis of [177Lu]Lu‑PSMA‑617 therapy.",
    image: "psma.png",
  },
  {
    abbrev: "SSTR2",
    display: "SSTR2",
    labels: [
      "SSTR2",
      "Somatostatin receptor 2",
      "Somatostatin receptors",
      "SSTR",
    ],
    fullName: "Somatostatin Receptor 2 (SSTR2)",
    description:
      "Neuroendocrine tumors over‑express SSTR2; DOTATATE/DOTATOC peptides deliver β‑emitters for PRRT.",
    image: "sstr.png",
  },
  {
    abbrev: "Bone Hydroxyapatite",
    display: "Bones",
    labels: ["Bones", "Bone", "Bone metabolism", "Hydroxyapatite"],
    fullName: "Bone Metabolism / Hydroxyapatite Turnover",
    description:
      "Bone‑seeking radiopharmaceuticals (e.g. 223Ra) lodge in osteoblastic lesions, relieving pain and extending survival in metastatic prostate cancer.",
    image: "bones.png",
  },
  {
    abbrev: "GLUT1",
    display: "GLUT1",
    labels: [
      "Glucose metabolism",
      "GLUT1",
      "Glucose transport",
      "Glucose transporter 1",
    ],
    fullName: "Glucose Transporter 1 (GLUT1)",
    description:
      "Cancer cells consume glucose avidly via GLUT1; [18F]FDG exploits this for PET imaging – transporter itself is less suited for direct radionuclide therapy.",
    image: "glut1.png",
  },
  {
    abbrev: "dart",
    display: "DART",
    labels: ["DART", "Dual‑Affinty Re‑Targeting", "Dual Affinity Retargeting"],
    fullName: "Dual‑Affinity Re‑Targeting (DART) Bispecifics",
    description:
      "DARTs are engineered bispecific antibodies whose two Fv arms engage tumor and effector antigens; DOTA‑conjugated DARTs can carry therapeutic radionuclides.",
    image: "dart.png",
  },
  {
    abbrev: "CD8A",
    display: "CD8 αβ",
    labels: ["CD8", "CD8 αβ", "CD8 alpha beta"],
    fullName: "CD8 αβ T‑Cell Co‑receptor",
    description:
      "CD8 αβ marks cytotoxic T‑cells; radiolabelling CD8‑binding antibodies enables imaging/therapy of tumor‑infiltrating lymphocytes.",
    image: "cd8.png",
  },
  {
    abbrev: "GRPR",
    display: "GRPR",
    labels: [
      "GRPR",
      "Gastrin‑releasing peptide receptor",
      "Gastrin releasing peptide receptor",
    ],
    fullName: "Gastrin‑Releasing Peptide Receptor (GRPR)",
    description:
      "GRPR is up‑regulated in prostate and breast cancers; bombesin analogues bearing 177Lu/225Ac deliver targeted radiation.",
    image: "grpr.png",
  },
  {
    abbrev: "CAIX",
    display: "CAIX",
    labels: [
      "CAIX",
      "Carbonic‑anhydrase IX",
      "Carbonic anhydrase IX",
      "CA IX",
    ],
    fullName: "Carbonic‑Anhydrase IX (CAIX)",
    description:
      "Hypoxia‑inducible membrane enzyme; sulfonamide radioconjugates irradiate hypoxic tumor regions.",
    image: "caix.png",
  },
  {
    abbrev: "FAP",
    display: "FAP",
    labels: [
      "FAP",
      "Fibroblast‑activation protein",
      "Fibroblast activation protein",
      "FAPα",
    ],
    fullName: "Fibroblast‑Activation Protein α (FAP)",
    description:
      "Radiolabelled FAP inhibitors target cancer‑associated fibroblasts and irradiate adjacent tumor cells.",
    image: "fap.png",
  },
] as const;

// ---------------------------------------------------------------------------
// 4) Helper maps ------------------------------------------------------------
// ---------------------------------------------------------------------------
const canon = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const LABEL_TO_ABBREV = new Map<string, string>();
const ABBREV_TO_LABELS: Record<string, string[]> = {};
META.forEach((m) => {
  const clist = m.labels.map(canon);
  ABBREV_TO_LABELS[m.abbrev] = clist;
  clist.forEach((c) => LABEL_TO_ABBREV.set(c, m.abbrev));
});
const ORDER = META.map((m) => m.abbrev);

// ---------------------------------------------------------------------------
// 5) Component --------------------------------------------------------------
// ---------------------------------------------------------------------------

type Tab = "clinical" | "p1" | "p2" | "p3";
const TAB_KEY: Record<Tab, keyof TargetSummary> = {
  clinical: "clinical",
  p1: "p1",
  p2: "p2",
  p3: "p3",
};
const TAB_LABEL: Record<Tab, string> = {
  clinical: "Clinical Trials",
  p1: "Phase 1",
  p2: "Phase 2",
  p3: "Phase 3",
};

type View = "grid" | "table";

const TargetDisplay = () => {
  // -----------------------------------------------------------------------
  // Local state -----------------------------------------------------------
  // -----------------------------------------------------------------------
  const [apiData, setApiData] = useState<ApiData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("clinical");
  const [viewMode, setViewMode] = useState<View>("grid");

  // -----------------------------------------------------------------------
  // Fetch API data --------------------------------------------------------
  // -----------------------------------------------------------------------
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://r-eco-52zl8.ondigitalocean.app/visualising", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setApiData(await res.json());
      } catch (e: any) {
        setError(e.message || "Failed to fetch API");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // -----------------------------------------------------------------------
  // Build summaries -------------------------------------------------------
  // -----------------------------------------------------------------------
  const summaries: TargetSummary[] = useMemo(() => {
    /* create zeroed summary objects for each of our 12 targets */
    const blank: Record<string, TargetSummary> = {};
    ORDER.forEach((ab) => {
      const m = META.find((x) => x.abbrev === ab)!;
      blank[ab] = {
        abbrev: ab,
        display: m.display,
        fullName: m.fullName,
        description: m.description,
        image: m.image,
        clinical: 0,
        p1: 0,
        p2: 0,
        p3: 0,
        diseases: [],
        companies: [],
      };
    });

    if (!apiData?.target) return Object.values(blank);

    /* iterate over *all* keys returned by the API, including synonyms */
    for (const [rawKey, t] of Object.entries(apiData.target)) {
      const ck = canon(rawKey);

      // map to one of our canonical 12 abbreviations ------------------
      let ab = LABEL_TO_ABBREV.get(ck);
      if (!ab) {
        outer: for (const [abbr, labels] of Object.entries(ABBREV_TO_LABELS)) {
          for (const lab of labels) {
            if (ck.includes(lab) || lab.includes(ck)) {
              ab = abbr;
              break outer;
            }
          }
        }
      }
      if (!ab) continue; // not one of the 12 we visualise

      const target = blank[ab];
      const total = (t as TargetSpecificData).total;

      // --------------------------------------------------------------
      // 1️⃣ gather candidate counts from *this* synonym --------------
      // --------------------------------------------------------------
      const tc = total?.study_counts?.all ?? 0;
      const p1c = t.phase_1?.study_counts?.all ?? 0;
      const p2c = t.phase_2?.study_counts?.all ?? 0;
      const p3c = t.phase_3?.study_counts?.all ?? 0;

      // --------------------------------------------------------------
      // 2️⃣ keep the *largest* value seen so far for each metric ------
      //     (swap Math.max → + if rows never overlap)
      // --------------------------------------------------------------
      target.clinical = Math.max(target.clinical, tc);
      target.p1 = Math.max(target.p1, p1c);
      target.p2 = Math.max(target.p2, p2c);
      target.p3 = Math.max(target.p3, p3c);

      // --------------------------------------------------------------
      // 3️⃣ merge diseases & companies lists -------------------------
      // --------------------------------------------------------------
      const merge = (src?: DetailEntry) => {
        if (!src?.list) return;
        src.list.forEach((x) => {
          if (!x) return;
          if (!target.diseases.includes(x) && (src === total?.diseases || t.phase_1?.diseases?.list?.includes(x) || t.phase_2?.diseases?.list?.includes(x) || t.phase_3?.diseases?.list?.includes(x))) {
            target.diseases.push(x);
          }
          if (!target.companies.includes(x) && (src === total?.companies || t.phase_1?.companies?.list?.includes(x) || t.phase_2?.companies?.list?.includes(x) || t.phase_3?.companies?.list?.includes(x))) {
            target.companies.push(x);
          }
        });
      };
      merge(total?.diseases);
      merge(total?.companies);
    }

    return Object.values(blank);
  }, [apiData]);

  /* sort summaries by current tab metric */
  const sorted = [...summaries].sort(
    (a, b) => (b[TAB_KEY[activeTab]] as number) - (a[TAB_KEY[activeTab]] as number)
  );

  // -----------------------------------------------------------------------
  // JSX -------------------------------------------------------------------
  // -----------------------------------------------------------------------
  return (
    <TooltipProvider delayDuration={80}>
      <section className="w-full bg-white ">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          {/* Header -----------------------------------------------------*/}
          <div className="mb-8 md:w-3/4">
            <h2 className="text-h4 mb-3">Tumor targets by study volume and stage</h2>
            <p className="text-body text-grey">
              Live snapshot of clinical and preclinical activity across 9 key tumor targets.
            </p>
          </div>

          {/* Tabs */}
          <Tabs
            titleTabs={[
              { id: "clinical", label: "Clinical Trials" },
              { id: "p1", label: "Phase 1" },
              { id: "p2", label: "Phase 2" },
              { id: "p3", label: "Phase 3" },
            ]}
            iconTabs={[
              { id: "grid", icon: <GridIcon />, ariaLabel: "Grid view" },
              { id: "table", icon: <TableIcon />, ariaLabel: "Table view" },
            ]}
            defaultTitleTab={activeTab}
            defaultIconTab={viewMode}
            onTitleTabChange={(id) => setActiveTab(id as Tab)}
            onIconTabChange={(id) => setViewMode(id as View)}
            className="mb-8"
          />

          {/* Loading & error */}
          {isLoading && <p className="text-center text-gray-500 py-10">Loading target data…</p>}
          {error && !isLoading && (
            <p className="text-center text-red-600 py-10">{error}</p>
          )}

          {/* GRID VIEW */}
          {!isLoading && !error && viewMode === "grid" && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sorted.map((t) => (
                <div
                  key={t.abbrev}
                  className="border rounded-xl shadow-sm flex flex-col hover:shadow-md transition-shadow"
                >
                  {/* Metric */}
                  <div className="px-6 pt-10 pb-4 text-right">
                    <span className="text-5xl font-bold">{t[TAB_KEY[activeTab]]}</span>
                    <span className="block mt-1 text-sm text-gray-500 uppercase tracking-wide">
                      {TAB_LABEL[activeTab]}
                    </span>
                  </div>
                  {/* Image */}
                  <div className="flex items-center justify-center flex-grow">
                    <img
                      src={`/images/${t.image}`}
                      alt={t.display}
                      className="w-full h-auto object-contain aspect-[4/3]"
                    />
                  </div>
                  {/* Text */}
                  <div className="px-6 pb-6 flex flex-col gap-2">
                    <h3 className="text-xl font-semibold">{t.display}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {t.description}
                    </p>
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 text-xs font-medium mt-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800">
                            {t.diseases.length} Disease Types
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" align="center">
                          <TooltipList items={t.diseases} />
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                            {t.companies.length} Companies
                          </span>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" align="center">
                          <TooltipList items={t.companies} />
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TABLE VIEW */}
          {!isLoading && !error && viewMode === "table" && (
            <div className="overflow-x-auto">
              <TableWithTooltips className="mb-6 w-full">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-white">
                    <TableRow>
                      <TableHead align="left" className="pl-4">
                        Target
                      </TableHead>
                      <TableHead align="center">Clinical</TableHead>
                      <TableHead align="center">Phase 1</TableHead>
                      <TableHead align="center">Phase 2</TableHead>
                      <TableHead align="center">Phase 3</TableHead>
                      <TableHead align="center">Diseases</TableHead>
                      <TableHead align="center" className="pr-4">
                        Companies
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ORDER.map((abbr) => summaries.find((s) => s.abbrev === abbr)!)
                      .filter(Boolean)
                      .map((t) => (
                        <TableRow key={t.abbrev}>
                          <TableCell
                            align="left"
                            className="pl-4"
                            hasTooltip
                            tooltipContent={
                              <div className="px-3 py-2 max-w-md">
                                <h4 className="text-sm font-medium mb-1">{t.display}</h4>
                                <img
                                  src={`/images/${t.image}`}
                                  alt={t.display}
                                  className="w-full object-contain my-2"
                                />
                                <p className="text-xs whitespace-pre-wrap">
                                  {t.description}
                                </p>
                              </div>
                            }
                          >
                            <div className="font-medium">{t.display}</div>
                            <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                              {t.fullName}
                            </div>
                          </TableCell>
                          <TableCell align="center">{t.clinical}</TableCell>
                          <TableCell align="center">{t.p1}</TableCell>
                          <TableCell align="center">{t.p2}</TableCell>
                          <TableCell align="center">{t.p3}</TableCell>
                          <TableCell
                            align="center"
                            hasTooltip={t.diseases.length > 0}
                            tooltipContent={<TooltipList items={t.diseases} />}
                          >
                            {t.diseases.length}
                          </TableCell>
                          <TableCell
                            align="center"
                            className="pr-4"
                            hasTooltip={t.companies.length > 0}
                            tooltipContent={<TooltipList items={t.companies} />}
                          >
                            {t.companies.length}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableWithTooltips>
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 text-xs text-gray-500">
            Data source: latest fetch from API • Updated June 2025
          </div>
        </div>
      </section>
    </TooltipProvider>
  );
};

export default TargetDisplay;