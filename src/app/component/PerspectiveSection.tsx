import React from "react";

const PerspectiveSection = () => (
  <section
    id="perspective"
    className="relative w-screen left-1/2 right-1/2 -mx-[50vw] bg-primary-blue text-white overflow-hidden z-0"
  >
    <div className="container mx-auto px-4 md:px-6 lg:px-8 pt-12 md:pt-16 lg:pt-24 pb-8 md:pb-12 lg:pb-16">
      {/* heading */}
      <div className="flex flex-col gap-8 mb-8 md:mb-12 lg:mb-[73px]">
        <h1 className="text-h2 font-helvetica-now">Our perspective</h1>
        <div className="h-px w-full bg-per-line" />
      </div>

      {/* two‑column story */}
      <div className="flex flex-col lg:flex-row gap-8  ">
        <div className="lg:w-1/2">
          <p className="text-h4 font-helvetica-now mb-6">
          As competition intensifies, simplifying and aligning complex systems into dependable services is essential to meet growing patient demand. 
            <br />
            <br />
            To scale Radioligand Therapy (RLT), pharmaceutical companies must evolve into full-service providers capable of managing the unique operational demands that come with personalized, made-to-order treatments.
          </p>
        </div>
        <div className="lg:w-1/2">
          <p className="text-h4 font-helvetica-now">
           This requires building new capabilities, establishing new roles, and putting in place the processes needed to sustain a connected service infrastructure.
            <br />
            <br />
            <span className="text-a-text">
              Learn more on our website or reach out:{" "}
              <a href="mailto:info@firm.inc" className="text-white hover:underline">
                info@firm.inc
              </a>
            </span>
          </p>
        </div>
      </div>

    </div>
  </section>
);

export default PerspectiveSection;