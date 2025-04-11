"use client";

import React from 'react';
import DonutChart from './DonutChart';
import { motion } from 'framer-motion';
import RadiopharmaceuticalsSection from './RadiopharmaceuticalsSection';

const IntroductionSection = () => {
  return (
    <>
      <section className="w-full py-12 md:py-16 lg:py-20 relative min-h-screen">
        {/* Main grid container - Using defined 12-col grid with proper padding */}
        <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-12 px-8 md:px-16 lg:px-24">
          {/* Title section - span 7 columns on larger screens */}
          <motion.div
            className="col-span-4 sm:col-span-8 md:col-span-7 lg:col-span-7 my-20 md:my-28"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="w-full">
              <h5 className="text-h5 font-helvetica-now text-grey mb-4">Introduction</h5>
              <h2 className="text-h2 font-helvetica-now text-black mb-4">
                Targeted radionuclide therapy & diagnostics represent one of the most promising frontiers in modern medicine.
              </h2>
              <p className="text-h5 font-helvetica-now text-grey">
                However, the strategic challenge lies in that every isotope and target selection dramatically impacts the entire delivery ecosystem - determining production requirements, supply chain complexity, and the ability to scale treatments to patients. In today's fast-moving RLT landscape, understanding these connections is essential for success.
              </p>
            </div>
          </motion.div>

          {/* 4 stats boxes section - full width within the 12-column grid */}
          <div className="col-span-4 sm:col-span-8 md:col-span-12 lg:col-span-12 mb-12 md:mb-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <motion.div 
                className="flex flex-col rounded-md border border-light-grey bg-white p-4 md:p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h5 className="text-black text-lg font-bold font-helvetica-now leading-tight mb-4">Clinical trials</h5>
                <div className="flex flex-col items-center sm:items-end w-full">
                  <span className="text-black text-h1 lg:text-h1 font-medium font-helvetica-now leading-none">1060</span>
                  <span className="text-grey text-xs md:text-sm font-medium font-helvetica-now leading-none mt-1">total amount of studies</span>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex flex-col rounded-md border border-light-grey bg-white p-4 md:p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h5 className="text-black text-lg font-bold font-helvetica-now leading-tight mb-4">Radioisotopes</h5>
                <div className="flex flex-col items-center sm:items-end w-full">
                  <span className="text-black text-h1 lg:text-h1 font-medium font-helvetica-now leading-none">27</span>
                  <span className="text-grey text-xs md:text-sm font-medium font-helvetica-now leading-none mt-1">Types of radioisotopes</span>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex flex-col rounded-md border border-light-grey bg-white p-4 md:p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h5 className="text-black text-lg font-bold font-helvetica-now leading-tight mb-4">Companies</h5>
                <div className="flex flex-col items-center sm:items-end w-full">
                  <span className="text-black text-h1 lg:text-h1 font-medium font-helvetica-now leading-none">103</span>
                  <span className="text-grey text-xs md:text-sm font-medium font-helvetica-now leading-none mt-1">Pharmaceutical & Biotech</span>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex flex-col rounded-md border border-light-grey bg-white p-4 md:p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <h5 className="text-black text-lg font-bold font-helvetica-now leading-tight mb-4">Diseases</h5>
                <div className="flex flex-col items-center sm:items-end w-full">
                  <span className="text-black text-h1 lg:text-h1 font-medium font-helvetica-now leading-none">138</span>
                  <span className="text-grey text-xs md:text-sm font-medium font-helvetica-now leading-none mt-1">Type of diseases</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Two columns section - properly using the 12-column grid */}
          <div className="col-span-4 sm:col-span-8 md:col-span-12 lg:col-span-12">
            <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 gap-6 md:gap-8 items-center">
              {/* Text column - 4 columns on desktop */}
              <motion.div
                className="col-span-4 sm:col-span-8 md:col-span-4 self-center"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <h4 className="text-h4 font-helvetica-now text-black mb-4">Therapy and diagnosis</h4>
                <p className="text-body font-helvetica-now text-grey mb-4">
                  Radiotherapeutics are transforming healthcare beyond their traditional role in cancer diagnosis. As these powerful tools expand into cancer treatment and new areas like neurodegenerative and cardiovascular diseases, they offer premium pricing, proven clinical results, natural competition barriers, and seamless diagnostic-treatment combinations.
                </p>
                <p className="text-body font-helvetica-now text-grey">
                  The strategic challenge is that every isotope and target selection dramatically impacts the entire delivery ecosystem - determining production requirements, supply chain complexity, and the ability to scale treatments to patients. In today&apos;s fast-moving RLT landscape, understanding these connections is essential for success.
                </p>
              </motion.div>

              {/* Chart column - 8 columns on desktop with increased height */}
              <motion.div
                className="col-span-4 sm:col-span-8 md:col-span-8 h-96 md:h-[35rem] lg:h-[42rem]"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <DonutChart />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Light grey divider line */}
      <div className="w-full border-t border-light-grey my-6 md:my-10"></div>

      {/* Radiopharmaceuticals Section */}
      <RadiopharmaceuticalsSection />
    </>
  );
};

export default IntroductionSection;