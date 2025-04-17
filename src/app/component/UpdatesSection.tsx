import React from "react";

const UpdatesSection = () => (
  <section
    id="updates"
    className="relative w-screen left-1/2 right-1/2 -mx-[50vw] bg-white text-grey-900"
  >
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* copy */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <p className="text-h4 font-helvetica-now">
            There’s more to explore. <span className="text-grey">We’ll be adding new content regularly,
            including deep dives into regulations and market access.</span>
          </p>
        </div>

        {/* numbered list */}
        <div className="lg:col-span-3">
          <div className="max-w-[325px] text-h5 font-helvetica-now text-grey space-y-1">
            <p>
              <sup className="text-black">1&nbsp;</sup><span className="text-black">Industry</span>
            </p>
            <p>
              <sup className="text-grey">2&nbsp;</sup>
              <span className="text-grey">Regulation</span>{" "}
              <sup className="font-bold">COMING SOON</sup>
            </p>
            <p>
              <sup className="text-grey">3&nbsp;</sup>Technology &amp;
              Systems
            </p>
            <p>
              <sup className="text-grey">4&nbsp;</sup>CDMOs
            </p>
            <p>
              <sup className="text-grey">5&nbsp;</sup>Market
            </p>
            <p>
              <sup className="text-grey">6&nbsp;</sup>Distribution
            </p>
          </div>
        </div>

        {/* subscribe */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <p className="text-h4 font-helvetica-now">
            Sign up to be notified of future updates.
          </p>
          <button className="w-full py-3.5 px-6 md:px-[50px] bg-grey-900 text-white rounded hover:bg-grey-800 transition-colors">
            Subscribe to future updates
          </button>
        </div>
      </div>
    </div>
  </section>
);

export default UpdatesSection;