// components/PatientAccess.tsx
"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

import RadiotherapyChart from './RadiotherapyChart';

const PatientAccess: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  // Define the tab options
  const tabs = [
    'Global distribution of eligible patients',
    'Current reach of radiopharmaceuticals'
  ];

  return (
    <section className="relative w-full bg-white py-16 md:py-24 z-10">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start"> 
            {/* --- Column 1: Chart --- */}
            <motion.div
              className="flex flex-col justify-start p-6 min-h-[380px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {/* Updated title to H5 and new text */}
               <h5 className="text-h5 font-helvetica-now text-black mb-4">
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

          {/* World Map Section with Tabs */}
          <motion.div
            className="mt-16 md:mt-24 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h4 className="text-h4 font-helvetica-now text-black mb-3">
              The Treatment Gap: Eligible mCRPC patients vs actual radiopharmaceutical availability
            </h4>
            <p className="text-body font-helvetica-now text-grey mb-8">
              Current radiopharmaceutical utilization reaches only a fraction of eligible patients worldwide
            </p>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-4">
              {tabs.map((tabLabel, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`px-4 py-2 rounded-md text-body-small font-helvetica-now transition-colors duration-150 ease-in-out ${
                    activeTab === index 
                      ? 'bg-black text-white' 
                      : 'bg-gray-200 text-black hover:bg-gray-400 hover:text-white'
                  }`}
                  aria-pressed={activeTab === index}
                >
                  {tabLabel}
                </button>
              ))}
            </div>

            {/* SVG Maps - using standard img tags for reliability */}
            <div className="w-full relative">
              {/* Map 1 */}
              {activeTab === 0 && (
                <img 
                  src="/world1.svg" 
                  alt="Global distribution of eligible patients"
                  className="w-full h-auto" 
                />
              )}
              
              {/* Map 2 */}
              {activeTab === 1 && (
                <img 
                  src="/world2.svg" 
                  alt="Current reach of radiopharmaceuticals"
                  className="w-full h-auto" 
                />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PatientAccess;