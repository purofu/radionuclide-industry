import React from 'react';

const Perspective = () => {
  return (
    <section className="relative w-screen left-1/2 right-1/2 -mx-[50vw] bg-per-background text-white overflow-hidden z-0">
      {/* Main content container with responsive padding */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 pt-12 md:pt-16 lg:pt-24 pb-8 md:pb-12 lg:pb-16">
        {/* Heading Section */}
        <div className="flex flex-col gap-8 mb-8 md:mb-12 lg:mb-[73px]">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium font-helvetica-now leading-tight">
            Our perspective
          </h1>
          <div className="h-px w-full bg-per-line"></div>
        </div>

        {/* Two Column Section - Main Content */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 mb-8 md:mb-12 lg:mb-[73px]">
          <div className="lg:w-1/2">
            <p className="text-base md:text-lg font-bold font-helvetica-now leading-tight mb-6">
              As we've built Firm, we've searched extensively for resources to refine our holistic understanding of the radionuclide industry. Despite reviewing studies, research papers, and industry reports, we found comprehensive overviews to be rare and incomplete.
            </p>
            <p className="text-base md:text-lg font-bold font-helvetica-now leading-tight mb-6">
              We combined and interrogated vast amounts of data to find "the edges" of this booming industry: creating an exhaustive view of isotope types and their attributes, ligands and targets, companies in the space, manufacturing methods, global demand, and current access.
            </p>
            <p className="text-base md:text-lg font-bold font-helvetica-now leading-tight">
              We've decided to contribute our Radionuclide Industry overview as a resource to the community, providing what we couldn't find ourselves: a comprehensive view highlighting advances made by businesses invested in RLT, successful products expected to reach market in 2-3 years, and emerging newcomers progressing through early clinical phases.
            </p>
          </div>
          <div className="lg:w-1/2">
            <p className="text-xl md:text-2xl lg:text-[26px] font-bold font-helvetica-now leading-relaxed">
              <span className="text-per-text">With numerous products advancing through clinical phases, competition across the industry will intensify. Companies must prepare to deliver these revolutionary </span>
              <span className="text-white">therapies to growing patient populations by orchestrating multiple systems and platforms in pursuit of building simplified, reliable services that can scale to meet demand.</span>
            </p>
          </div>
        </div>

        <div className="h-px w-full bg-per-line mb-8 md:mb-12 lg:mb-[73px]"></div>

        {/* Updates Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 mb-8 md:mb-12 lg:mb-[73px] items-center">
          {/* Column 1 - 6/12 columns */}
          <div className="lg:col-span-6 flex flex-col gap-6 justify-center">
            <p className="text-xl md:text-2xl lg:text-[26px] font-bold font-helvetica-now leading-relaxed">
              There's more to explore. We'll be adding new content regularly, including deep dives into regulations and market access.
            </p>
          </div>
          
          {/* Column 2 - 2/12 columns */}
          <div className="lg:col-span-2">
            <div className="max-w-[325px]">
              <p className="text-lg md:text-xl lg:text-[21px] font-medium font-helvetica-now leading-[1.4]">
                <sup className="text-white">1 </sup>
                <span className="text-white">Industry</span><br/>
                
                <sup className="text-per-text">2 </sup>
                <span className="text-per-text">Regulation </span>
                <sup className="text-per-text font-extrabold">COMING SOON</sup><br/>
                
                <sup className="text-[#59607a]">3 </sup>
                <span className="text-[#59607a]">Technology & Systems</span><br/>
                
                <sup className="text-[#59607a]">4 </sup>
                <span className="text-[#59607a]">CDMOs</span><br/>
                
                <sup className="text-[#59607a]">5 </sup>
                <span className="text-[#59607a]">Market</span><br/>
                
                <sup className="text-[#59607a]">6 </sup>
                <span className="text-[#59607a]">Distribution</span>
              </p>
            </div>
          </div>
          
          {/* Column 3 - 4/12 columns */}
          <div className="lg:col-span-4 flex flex-col gap-6 justify-center">
            <p className="text-xl md:text-2xl lg:text-[26px] font-bold font-helvetica-now leading-relaxed">
              Sign up to be notified of future updates.
            </p>
            <button className="w-full py-3.5 px-6 md:px-[50px] bg-per-text rounded text-white text-base md:text-lg font-medium font-helvetica-now hover:bg-opacity-90 transition-colors">
              Subscribe to future updates
            </button>
          </div>
        </div>

        {/* Methodology Section Header */}
        <div className="flex flex-col gap-8 mb-8 md:mb-12 lg:mb-[73px]">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium font-helvetica-now">
            Methodology and references
          </h2>
          <div className="h-px w-full bg-per-line"></div>
        </div>

        {/* Clinical Trial Data Section */}
        <div className="flex flex-col gap-6 mb-8 md:mb-12 lg:mb-[73px]">
          <h3 className="text-lg md:text-xl lg:text-[21px] font-bold font-helvetica-now text-per-text">
            Clinical trial data collection process
          </h3>
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            <div className="lg:w-1/2">
              <p className="text-base md:text-lg font-medium font-helvetica-now leading-tight mb-4">
                The dataset was sourced from ClinicalTrials.gov and processed to filter only interventional studies with industry sponsorship, ensuring the inclusion of trials with a clearly defined therapeutic focus. In the preprocessing stage, text normalization and regex-based extraction were employed specifically on intervention names—rather than titles—to capture radioisotope mentions accurately using a robust synonym mapping. This mapping standardizes various forms of isotope nomenclature, and each isotope is then evaluated based on its established therapeutic or diagnostic classification.
              </p>
              <p className="text-base md:text-lg font-medium font-helvetica-now leading-tight">
                Verification is achieved through a dual approach: a correctness check that randomly samples studies to display key details (e.g., NCT IDs, phases, interventions, and sponsors) for manual review, and a comparison process where aggregated statistics are matched against a pre-defined manual pipeline.
              </p>
            </div>
            <div className="lg:w-1/2">
              <p className="text-base md:text-lg font-medium font-helvetica-now leading-tight mb-4">
                Therapeutic intent is further verified by cross-referencing recognized clinical trial phases, scanning for an extensive list of therapeutic-related keywords in both titles and intervention details, and subsequently flagging studies that fulfill any of these criteria. The pipeline also aggregates statistical summaries (such as the distribution of trial phases, isotope frequency, and sponsor counts), and visualization data is built to stratify the results by phase, company, and clinical application.
              </p>
              <p className="text-base md:text-lg font-medium font-helvetica-now leading-tight">
                Although potential challenges remain—such as deviations in input formatting, ambiguous sponsor identifiers, or limitations in the static keyword and synonym lists—the comprehensive verification steps embedded in the pipeline offer a robust mechanism for validating data extraction and categorization.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mb-8 md:mb-12 lg:mb-[73px]">
          <p className="text-xl md:text-2xl lg:text-[26px] font-bold font-helvetica-now">
            <span className="text-white">For access to the raw data, including APIs, please contact</span>
            <span className="text-per-text"> info@firm.inc</span>
          </p>
        </div>

        {/* References Section */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-6">
            <h3 className="text-xl md:text-2xl lg:text-[26px] font-medium font-helvetica-now text-per-text">
              References
            </h3>
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-[73px]">
              <div className="lg:w-1/2">
                <p className="text-base font-medium font-helvetica-now text-per-text">
                  Weber, W. A. et al. What is theranostics?. J. Nucl. Med. 64, 669–670 (2023).
                </p>
              </div>
              <div className="lg:w-1/2">
                <p className="text-base font-medium font-helvetica-now text-per-text">
                  Weber, W. A. et al. What is theranostics?. J. Nucl. Med. 64, 669–670 (2023).
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <button className="text-per-text text-lg font-medium font-helvetica-now">
                Show all
              </button>
              <div className="w-4 h-4 bg-per-text transform rotate-180"></div>
            </div>
            <div className="h-px w-full bg-per-line"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Perspective; 