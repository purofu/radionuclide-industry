import React from "react";

const MethodologySection = () => (
  <section
    id="methodology"
    className="relative w-screen left-1/2 right-1/2 -mx-[50vw] bg-per-background text-white"
  >
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-24">
      {/* header */}
      <div className="flex flex-col gap-8 mb-8 md:mb-12 lg:mb-[73px]">
        <h2 className="text-h2 font-helvetica-now">Methodology and references</h2>
        <div className="h-px w-full bg-per-line" />
      </div>

      {/* trial‑data narrative */}
      <div className="flex flex-col gap-6 mb-8 md:mb-12 lg:mb-[73px]">
        <h3 className="text-h5 font-helvetica-now text-per-text font-bold">
          Clinical trial data collection process
        </h3>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          <div className="lg:w-1/2 space-y-4 text-body font-medium">
            <p>
              The dataset was sourced from ClinicalTrials.gov and processed to
              filter only interventional studies with industry sponsorship…
            </p>
            <p>
              Verification combines random sampling for manual review with
              automated statistical checks against a curated baseline.
            </p>
          </div>

          <div className="lg:w-1/2 space-y-4 text-body font-medium">
            <p>
              Therapeutic intent is verified by phase, keyword scanning and
              synonym mapping. The pipeline also aggregates distributions by
              phase, company and application for visualisation.
            </p>
            <p>
              Remaining edge‑cases (e.g. ambiguous sponsor IDs) are flagged for
              manual QA.
            </p>
          </div>
        </div>
      </div>

      {/* contact */}
      <div className="mb-8 md:mb-12 lg:mb-[73px]">
        <p className="text-h4 font-helvetica-now">
          For access to the raw data, including APIs, please contact{" "}
          <span className="text-per-text">info@firm.inc</span>
        </p>
      </div>

      {/* refs */}
      <div className="space-y-6">
        <h3 className="text-h3 font-helvetica-now text-per-text">References</h3>
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-[73px]">
          <div className="lg:w-1/2 text-body font-medium text-per-text">
            Weber, W. A. et al. *What is theranostics?* J. Nucl. Med. 64,
            669‑670 (2023).
          </div>
          <div className="lg:w-1/2 text-body font-medium text-per-text">
            Weber, W. A. et al. *What is theranostics?* J. Nucl. Med. 64,
            669‑670 (2023).
          </div>
        </div>
        <button className="text-per-text text-body font-medium">Show all</button>
        <div className="h-px w-full bg-per-line" />
      </div>
    </div>
  </section>
);

export default MethodologySection;