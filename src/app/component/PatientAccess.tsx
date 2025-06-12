// components/PatientAccess.tsx
"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs } from '@/components/ui';


import RadiotherapyChart from './RadiotherapyChart';

// Legend component for the maps
interface LegendItem {
  color: string;
  label: string;
}

interface MapLegendProps {
  items: LegendItem[];
}

const MapLegend: React.FC<MapLegendProps> = ({ items }) => {
  return (
    <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <div 
            className="w-4 h-4 border border-gray-300"
            style={{ backgroundColor: `#${item.color}` }}
          />
          <span className="text-sm font-helvetica-now text-grey">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const PatientAccess: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  // Define the tab options
  const tabs = [
    'Global distribution of eligible patients',
    'Current reach of radiopharmaceuticals'
  ];

  // Legend data for each tab
  const legendData = [
    // First tab legend
    [
      { color: 'D9D9D9', label: 'No nuclear medicine physicians' },
      { color: 'ECEEF4', label: 'No data available' },
      { color: 'B8BCCA', label: '0.1-5.0' },
      { color: '6D7186', label: '5.1-10.0' },
      { color: '404451', label: '>10.0' }
    ],
    // Second tab legend
    [
      { color: 'D9D9D9', label: 'No nuclear medicine physicians' },
      { color: 'E2C0C0', label: 'No data available' },
      { color: 'B8BCCA', label: '0.1-5.0' },
      { color: '6D7186', label: '5.1-10.0' },
      { color: '404451', label: '>10.0' }
    ]
  ];

  return (
    <>
   
    
      <section className="relative w-full bg-white py-16 md:py-24 z-10">
        {/* Main grid container */}
        <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-12">
          {/* Content container */}
          <div className="col-span-4 sm:col-span-8 md:col-span-12 lg:col-span-12 px-4 md:px-6 lg:px-8">

            {/* Introductory Paragraph */}
            <motion.div
              className="mb-12 md:mb-16 text-left max-w-4xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className="text-h3 font-helvetica-now text-black py-24">
              The stark gap between eligibility and reach is both a challenge and a market opportunity.
              Logistical complexities, infrastructure limitations, and reimbursement hurdles continue to restrict patient access.
              </p>
            </motion.div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 items-start"> 
              {/* --- Column 1: Chart --- */}
              <motion.div
                className="flex flex-col justify-start min-h-[380px]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                {/* Updated title to H5 and new text */}
                 <h5 className="text-h5 font-helvetica-now text-black mb-16">
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
                *This access disparity highlights the need for innovative delivery models that can overcome the unique last-mile challenges inherent to these therapies and unlock their full clinical and commercial potential.
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

              {/* Replace Tab Navigation with our new Tabs component */}
              <Tabs
                titleTabs={tabs.map((label, index) => ({
                  id: index.toString(),
                  label
                }))}
                defaultTitleTab={activeTab.toString()}
                onTitleTabChange={(tabId) => setActiveTab(parseInt(tabId))}
                className="mb-8"
              />

              {/* SVG Maps - using standard img tags for reliability */}
              <div className="w-full relative">
                {/* Map 1 */}
                {activeTab === 0 && (
                  <div>
                    <MapLegend items={legendData[0]} />
                    <img 
                      src="/world1.svg" 
                      alt="Global distribution of eligible patients"
                      className="w-full h-auto" 
                    />
                  </div>
                )}
                
                {/* Map 2 */}
                {activeTab === 1 && (
                  <div>
                    <MapLegend items={legendData[1]} />
                    <img 
                      src="/world2.svg" 
                      alt="Current reach of radiopharmaceuticals"
                      className="w-full h-auto" 
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PatientAccess;