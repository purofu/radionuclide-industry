import React from "react";

const PerspectiveSection = () => (
  <section
    id="perspective"
    className="relative w-screen left-1/2 right-1/2 -mx-[50vw] bg-per-background text-white overflow-hidden z-0"
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
            In this complex landscape, sustainable isotope and target decisions
            are crucial for bench‑to‑bedside progression.
            <br />
            <br />
            Companies must create pathways connecting all elements—from isotope
            sourcing to patient administration—to deliver therapies at scale.
          </p>
        </div>
        <div className="lg:w-1/2">
          <p className="text-h4 font-helvetica-now">
            As competition intensifies, orchestrating these systems into
            simplified, reliable services is essential to meet growing patient
            demand.
            <br />
            <br />
            <span className="text-per-text">
              Learn more on our website or reach out:{" "}
              <span className="text-white">info@firm.inc</span>
            </span>
          </p>
        </div>
      </div>

    </div>
  </section>
);

export default PerspectiveSection;