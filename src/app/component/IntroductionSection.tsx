"use client";

import React from 'react';
import DonutChart from './DonutChart';
import RadiopharmaceuticalsSection from './RadiopharmaceuticalsSection';

const IntroductionSection = () => {
  return (
    <>
      <section className="w-full py-8 md:py-16 lg:py-20 relative min-h-screen">
        {/* Main grid container - 12-col for large, with smaller spacing on mobile */}
        <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-12 px-8 md:px-16 lg:px-24">
          {/* Title section - 7 cols on md/lg, smaller margin for mobile */}
          <div className="col-span-4 sm:col-span-8 md:col-span-7 lg:col-span-7 my-16 md:my-28">
            <div className="w-full">
              
              <h2 className="text-h2 font-helvetica-now text-black mb-4">
                Targeted radionuclide therapy & diagnostics represent one of the most promising frontiers in modern medicine.
              </h2>
              <p className="text-h5 font-helvetica-now text-grey">
                
                Delivering on this promise is challenging. Every isotope and target selection dramatically impacts the
                entire delivery ecosystem – determining production requirements, supply chain complexity, and the ability
                to scale treatments to patients. In today’s fast-moving targeted Radionuclide therapies and diagnostics landscape, understanding these connections is
                essential for success.
              </p>
            </div>
          </div>

          {/* Stats boxes - 2 columns on mobile, 4 on md+ */}
          <div className="col-span-4 sm:col-span-8 md:col-span-12 lg:col-span-12 mb-8 md:mb-20"><h5 className="text-h5 font-helvetica-now text-black mb-4">
                 The scope of overall radionuclide clinical studies
                </h5>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-6">
            
              <div className="flex flex-col rounded-md border border-light-grey bg-white p-4 md:p-6">
                <h5 className="text-black text-lg font-bold font-helvetica-now leading-tight mb-4">Clinical trials</h5>
                <div className="flex flex-col items-center md:items-end w-full">
                  <span className="text-black text-h1 lg:text-h1 font-medium font-helvetica-now leading-none">1060</span>
                  <span className="text-grey text-xs md:text-sm font-medium font-helvetica-now leading-none mt-1">
                    Total amount of studies
                  </span>
                </div>
              </div>

              <div className="flex flex-col rounded-md border border-light-grey bg-white p-4 md:p-6">
                <h5 className="text-black text-lg font-bold font-helvetica-now leading-tight mb-4">Radioisotopes</h5>
                <div className="flex flex-col items-center md:items-end w-full">
                  <span className="text-black text-h1 lg:text-h1 font-medium font-helvetica-now leading-none">27</span>
                  <span className="text-grey text-xs md:text-sm font-medium font-helvetica-now leading-none mt-1">
                    Studied radioisotopes
                  </span>
                </div>
              </div>

              <div className="flex flex-col rounded-md border border-light-grey bg-white p-4 md:p-6">
                <h5 className="text-black text-lg font-bold font-helvetica-now leading-tight mb-4">Companies</h5>
                <div className="flex flex-col items-center md:items-end w-full">
                  <span className="text-black text-h1 lg:text-h1 font-medium font-helvetica-now leading-none">103</span>
                  <span className="text-grey text-xs md:text-sm font-medium font-helvetica-now leading-none mt-1">
                    Industry sponsors
                  </span>
                </div>
              </div>

              <div className="flex flex-col rounded-md border border-light-grey bg-white p-4 md:p-6">
                <h5 className="text-black text-lg font-bold font-helvetica-now leading-tight mb-4">Diseases</h5>
                <div className="flex flex-col items-center md:items-end w-full">
                  <span className="text-black text-h1 lg:text-h1 font-medium font-helvetica-now leading-none">138</span>
                  <span className="text-grey text-xs md:text-sm font-medium font-helvetica-now leading-none mt-1">
                    Targeted diseases
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Text + Chart layout */}
          {/* Desktop (lg): 12 cols → text=4, gap=2, chart=6. Large desktop (xl): text=3, gap=3, chart=6. Tablet (sm/md): 8 cols → 3+5. Mobile (default): 4 cols → 4+4. */}
          <div className="col-span-4 sm:col-span-8 md:col-span-12 lg:col-span-12">
            <div className="grid 
                            grid-cols-4 
                            sm:grid-cols-8 
                            md:grid-cols-8 
                            lg:grid-cols-12 
                            xl:grid-cols-12
                            gap-4 
                            md:gap-8 
                            items-start">
              {/* Text column */}
              <div className="
                col-span-4 
                sm:col-span-3 
                md:col-span-3 
                lg:col-span-5 
                xl:col-span-4
                self-center
              ">
                <h4 className="text-h4 font-helvetica-now text-black mb-4">
                  From diagnosis to treatment: the evolving landscape of approved radiopharmaceuticals
                </h4>
                <p className="text-body font-helvetica-now text-grey mb-4">
                  Radiotherapeutics are transforming healthcare beyond their traditional role in cancer diagnosis.
                  While diagnostic applications still dominate (54 agents), the field is rapidly diversifying. The
                  significant presence of therapeutic agents (13) signals the evolution from purely diagnostic tools
                  to active treatment modalities.
                </p>
                <p className="text-body font-helvetica-now text-grey">
                  The expansion beyond oncology into multiple disease areas—neurodegenerative disorders (11 agents),
                  cardiovascular diseases (8 agents), and emerging applications in conditions like hepatopulmonary
                  syndrome and nephrotic syndrome represents both scientific progress and strategic opportunity for
                  organizations positioned to address these broader clinical needs.
                </p>
              </div>

              {/* Gap column for desktop */}
              <div className="
                hidden 
                lg:block 
                lg:col-span-1 
                xl:col-span-2
              "></div>

              {/* Chart column - fixed height */}
              <div className="
                col-span-4 
                sm:col-span-5 
                md:col-span-5 
                lg:col-span-6 
                xl:col-span-6
                h-[42rem]
              ">
                <DonutChart />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Light grey divider line with smaller mobile margin */}
      <div className="w-full border-t border-light-grey my-4 md:my-10"></div>

      {/* Radiopharmaceuticals Section */}
      <RadiopharmaceuticalsSection />
    </>
  );
};

export default IntroductionSection;