// components/PatientAccess.tsx
"use client";

import React from 'react';
import { motion } from 'framer-motion';

import RadiotherapyChart from './RadiotherapyChart';
import GlobalAccessMapDisplay from './GlobalAccessMapDisplay';

// Interface and Data remain the same...
interface TargetingMethod { /* ... */ }
const targetingMethodsData: TargetingMethod[] = [ /* ... */ ];


const PatientAccess: React.FC = () => {
  return (
    <section className="relative w-full bg-white py-16 md:py-24">
      {/* Main grid container */}
      <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-12">
        {/* Content container */}
        <div className="col-span-4 sm:col-span-8 md:col-span-12 lg:col-span-12 px-8 md:px-16 lg:px-24">

          {/* Section Title */}
          <motion.div
            className="mb-10 md:mb-12 text-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h1 className="text-h2 font-helvetica-now text-black">
              Companies
            </h1>
          </motion.div>

          {/* Introductory Paragraph */}
          <motion.div
            className="mb-12 md:mb-16 text-left max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-h3 font-helvetica-now text-black">
             The radiopharmaceutical landscape is experiencing unprecedented growth, with a diverse array of players—from emerging biotechs to established pharmaceutical giants—actively developing novel therapies across multiple targets and isotopes.
            </p>
          </motion.div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start"> {/* Use items-start */}

            {/* --- Column 1: Chart --- */}
            <motion.div
              // REMOVED: border border-light-grey rounded-md bg-white
              // Keep padding for spacing, adjust min-height if needed or let content define height
              className="flex flex-col justify-start p-6 min-h-[380px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {/* Updated title to H5 and new text */}
               <h5 className="text-h5 font-helvetica-now text-black mb-4"> {/* Assuming text-h5 class exists or use text-lg font-medium etc. */}
                  Distribution of high-energy external beam radiotherapy machines across country income groups
               </h5>
              <div className="flex-grow">
                 <RadiotherapyChart />
              </div>
            </motion.div>
            {/* --- End Column 1 --- */}


            {/* --- Column 2: Original Text --- */}
            <motion.div
              className="flex flex-col justify-center p-6 min-h-[380px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <p className="text-body font-helvetica-now text-grey">
                This ecosystem creates a remarkable level of interdependence. Competitors frequently become collaborators through strategic partnerships and acquisitions that address specialized capabilities gaps—whether in isotope production, targeting technology, manufacturing expertise, or delivery infrastructure.
              </p>
            </motion.div>
            {/* --- End Column 2 --- */}
          </div>

        </div>
      </div>
      {/* Keep original CompanyTreemapDisplay */}
      <GlobalAccessMapDisplay />
    </section>
  );
};

export default PatientAccess;