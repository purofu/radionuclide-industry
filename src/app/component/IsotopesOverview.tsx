// components/IsotopesOverview.tsx
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import RadioisotopePeriodicDisplay from './RadioisotopePeriodicDisplay';
import DataTabs from './DataTabs';

// Interface for Isotope Cards
interface Isotope {
  tag: string;
  tagBg: string;
  dotColor: string;
  title: string;
  description: string;
}

// Data for Isotope Cards
const isotopeData: Isotope[] = [
  {
    tag: 'Therapy',
    tagBg: 'bg-light-therapy', // Using defined colors from your tailwind.config.js
    dotColor: 'bg-a-colour',    // Using defined colors from your tailwind.config.js
    title: 'α emitters',
    description: 'These radionuclides have the highest potency, delivering high energy while limiting collateral damage to healthy tissue. Their high supply chain challenges, specialised production requirements, long-lived waste considerations and the highest relative cost create significant logistical hurdles for widespread adoption.',
  },
  {
    tag: 'Therapy',
    tagBg: 'bg-light-therapy',
    dotColor: 'bg-a-colour',
    title: 'β-emitters',
    description: 'These isotopes have been workhorses for nuclear medicine, offering established production pathways and longer tissue range, often advantageous for medium-to-large tumors. Familiar decay properties, commercial infrastructure and established pathways present lower market entry barriers compared to alpha therapies.',
  },
  {
    tag: 'Diagnosis',
    tagBg: 'bg-light-diagnostic', // Using defined colors from your tailwind.config.js
    dotColor: 'bg-g-color',       // Using defined colors from your tailwind.config.js
    title: 'Positron emitters',
    description: 'Positron emitters enable the highest diagnostic imaging quality through PET/CT, offering superior sensitivity and resolution for detecting small lesions. Their typically short half-lives necessitate robust supply chain planning, posing challenges requiring either cyclotron networks or on-site production.',
  },
  {
    tag: 'Diagnosis',
    tagBg: 'bg-light-diagnostic',
    dotColor: 'bg-g-color',
    title: 'γ-emitters',
    description: 'Gamma emitters provide the backbone of conventional nuclear medicine diagnostics with the most mature infrastructure and moderate costs. Established SPECT imaging systems offer accessibility and reliability. Long emission characteristics enable body imaging with well-understood regulatory pathways.',
  },
];

// Interface and Data for Bar Chart
interface BarChartData {
    label: string;
    trialValue: number;
    companyValue: number;
    colorClass: string; // Tailwind background color class e.g., 'bg-a-colour'
    valueColorClass: string; // Tailwind text color class for the value e.g., 'text-black'
    labelColorClass: string; // Color for the label text
}

const barChartData: BarChartData[] = [
    { 
      label: 'α-Particle therapy', 
      trialValue: 74, 
      companyValue: 13, 
      colorClass: 'bg-a-colour', 
      valueColorClass: 'text-black',
      labelColorClass: 'text-a-text-colour'
    },
    { 
      label: 'β-Particle therapy', 
      trialValue: 329, 
      companyValue: 56, 
      colorClass: 'bg-primary-blue', 
      valueColorClass: 'text-white',
      labelColorClass: 'text-black' 
    },
    { 
      label: 'Positron emitters', 
      trialValue: 647, 
      companyValue: 64, 
      colorClass: 'bg-purple', 
      valueColorClass: 'text-white',
      labelColorClass: 'text-black' 
    },
    { 
      label: 'γ-Particle Emitters', 
      trialValue: 89, 
      companyValue: 18,
      colorClass: 'bg-g-color', 
      valueColorClass: 'text-black',
      labelColorClass: 'text-g-text-colour' 
    },
];

// Text content for each tab
const tabText = {
  trials: "While beta emitters currently dominate the landscape in clinical trials, the growing interest in alpha emitters signals an evolution in therapeutic approach.",
  companies: "Companies working on positron emitters represent the largest segment, with beta-particle therapy companies forming a substantial portion of the industry."
};

const IsotopesOverview: React.FC = () => {
  // Add state for active tab
  const [activeTab, setActiveTab] = useState<'trials' | 'companies'>('trials');
  
  // Get current date for footer timestamp
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
  });

  // Function to get the max value based on active tab
  const getMaxValue = () => {
    return Math.max(...barChartData.map(item => 
      activeTab === 'trials' ? item.trialValue : item.companyValue
    ));
  };

  // Calculate height classes dynamically based on max value
  const calculateHeight = (value: number) => {
    const maxValue = getMaxValue();
    // Use 128 (full height) as the reference to calculate proportions
    const heightPercentage = (value / maxValue) * 100;
    
    // Convert to pixel height, max height of 250px (adjusted from 448px)
    return Math.round((heightPercentage / 100) * 250);
  };

  return (
    <> {/* Use Fragment to group multiple top-level sections */}

      {/* ===== HEADER SECTION ===== */}
      <div className="w-full bg-white">
        <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-12">
          <div className="col-span-4 sm:col-span-8 md:col-span-12 lg:col-span-12 px-8 md:px-16 lg:px-24">
            <div className="h-32 md:h-40 flex items-center justify-start">
              {/* Title using text-h2 style from config */}
              <h1 className="text-h2 font-helvetica-now text-black">
                Radioisotope
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Divider Line - Fixed full width solution that prevents horizontal scrolling */}
      <div className="w-full border-t border-light-grey" />
      {/* ===== END HEADER SECTION ===== */}


      {/* ===== ISOTOPES OVERVIEW SECTION ===== */}
      <section className="relative w-full bg-white">
        {/* Main grid container - Using defined 16-col grid */}
        <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-12 py-12 md:py-24">
          {/* Content container with padding */}
          <div className="col-span-4 sm:col-span-8 md:col-span-12 lg:col-span-12 px-8 md:px-16 lg:px-24">

            {/* Section Title - Changed from text-center to text-left */}
            <motion.div
              className="mb-12 md:mb-16 text-left"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
               {/* Using text-h5 style from config */}
               <h5 className="text-h5 font-helvetica-now text-grey mb-4">Isotopes overview</h5>
               {/* Removed mx-auto to left align */}
               <h2 className="text-h3 font-helvetica-now text-black max-w-4xl">
                 Each radioisotope class presents distinct advantages and challenges that directly impact clinical outcomes, manufacturing capabilities, supply chain requirements, and commercial potential.
               </h2>
            </motion.div>

            {/* Placeholder for Periodic Table Image */}
            <motion.div
              className="col-span-4 sm:col-span-8 md:col-span-12 lg:col-span-12 mb-12 md:mb-24 relative w-full h-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
               <Image 
                 src="/9.svg" 
                 alt="Periodic Table of Radioisotopes" 
                 width={0}
                 height={0}
                 sizes="100vw"
                 className="w-full h-auto"
                 priority
               />
            </motion.div>

            {/* 4 Isotope cards section */}
            {/* Responsive grid for cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {isotopeData.map((isotope, index) => (
                <motion.div
                  key={isotope.title}
                  // Card container styling - using config styles
                  className="flex flex-col justify-between p-6 border border-light-grey rounded-md bg-white min-h-[250px]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                >
                  {/* Top Row: Dot + Tag */}
                   <div className="flex justify-between items-center w-full mb-4">
                     {/* Dot - using dynamic color from data */}
                     <div className={`w-6 h-6 ${isotope.dotColor} rounded-full`}></div>
                     {/* Tag - using dynamic bg color, config text styles */}
                     <div className={`px-3 py-1 ${isotope.tagBg} rounded-full flex items-center`}>
                       <p className="text-body-small font-helvetica-now text-black">{isotope.tag}</p>
                     </div>
                   </div>
                   {/* Bottom Content: Title + Description */}
                   <div className="flex flex-col gap-1">
                     {/* Title - using text-h4 style from config */}
                     <h4 className="text-h4 font-helvetica-now text-black">
                       {isotope.title}
                     </h4>
                     {/* Description - using text-body-small style from config */}
                     <p className="text-body-small font-helvetica-now text-black">
                       {isotope.description}
                     </p>
                   </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* ===== END ISOTOPES OVERVIEW SECTION ===== */}


      {/* ===== BOTTOM STRATEGIC DIVERGENCE SECTION ===== */}
      <section className="relative w-full bg-white py-12 md:py-24">
         {/* Content container with padding */}
         <div className="px-8 md:px-16 lg:px-24">

             {/* Section Title - using text-h3 style from config */}
             <motion.h3
               className="text-h3 font-helvetica-now text-black mb-8"
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8, delay: 0.2 }}
             >
                 Strategic divergence in radioisotope development
             </motion.h3>

             {/* Tabs Component */}
             <DataTabs activeTab={activeTab} setActiveTab={setActiveTab} />

             {/* Chart and Text Area - Responsive grid, correctly adjusted column spans */}
             <div className="grid grid-cols-1 sm:grid-cols-8 md:grid-cols-8 lg:grid-cols-12 gap-8 md:gap-12">

                 {/* ===== BAR CHART IMPLEMENTATION ===== */}
                 <motion.div
                     // Container for bars: responsive column span for 6/6 desktop, 4/4 tablet, full width mobile
                     className="col-span-1 sm:col-span-4 md:col-span-4 lg:col-span-6 flex justify-between items-end h-[300px] gap-0"
                     initial={{ opacity: 0, x: -20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ duration: 0.8, delay: 0.4 }}
                 >
                     {barChartData.map((item, index) => {
                       // Dynamically get current value based on active tab
                       const currentValue = activeTab === 'trials' ? item.trialValue : item.companyValue;
                       // Calculate dynamic height in pixels
                       const heightPx = calculateHeight(currentValue);
                       
                       return (
                         // Wrapper for each Bar + Label
                         <div key={item.label} className="flex flex-col items-center w-1/4">
                             {/* Bar visual with growth animation */}
                              <motion.div
                                className={`w-full ${item.colorClass} rounded-t-md flex flex-col justify-end items-center p-2`}
                                initial={{ height: 0 }}
                                // Use animate to smoothly transition between heights
                                animate={{ height: heightPx }}
                                // Remove the key to prevent remounting on tab change
                                transition={{ 
                                  duration: 0.8,
                                  ease: "easeInOut"
                                }}
                              >
                                 {/* Simpler number transition with text-h2 size */}
                                 <AnimatePresence mode="wait">
                                   <motion.span
                                     key={`${activeTab}-${currentValue}`}
                                     className={`font-helvetica-now text-h2 ${item.valueColorClass} text-center`}
                                     initial={{ opacity: 0 }}
                                     animate={{ opacity: 1 }}
                                     exit={{ opacity: 0 }}
                                     transition={{ duration: 0.3 }}
                                   >
                                     {currentValue}
                                   </motion.span>
                                 </AnimatePresence>
                             </motion.div>
                             {/* Label Text: using custom color classes */}
                             <p className={`mt-2 text-body-small font-helvetica-now ${item.labelColorClass} text-center`}>
                                 {item.label}
                             </p>
                         </div>
                       );
                     })}
                 </motion.div>
                 {/* ===== END BAR CHART IMPLEMENTATION ===== */}


                 {/* Text Paragraph */}
                 <motion.div
                     // Responsive column span for 6/6 desktop, 4/4 tablet, full width mobile
                     className="col-span-1 sm:col-span-4 md:col-span-4 lg:col-span-6 flex items-center px-4"
                     initial={{ opacity: 0, x: 20 }}
                     whileInView={{ opacity: 1, x: 0 }}
                     viewport={{ once: true }}
                     transition={{ duration: 0.8, delay: 0.5 }}
                 >
                     {/* Text with transition animation */}
                     <AnimatePresence mode="wait">
                       <motion.p 
                         key={activeTab}
                         className="text-body font-helvetica-now text-grey"
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         exit={{ opacity: 0 }}
                         transition={{ duration: 0.3 }}
                       >
                         {tabText[activeTab]}
                       </motion.p>
                     </AnimatePresence>
                 </motion.div>
             </div>

             

             {/* Footer Text - styled using text-body-small from config */}
             {/* Changed from text-center to text-left */}
             <div className="text-left text-body-small font-helvetica-now text-grey md:my-8">
                <p>Last updated: {formattedDate}</p>
                <p className="mt-1">
                Help us keep things accurate. If you notice any outdated or incorrect information, email us at <a href="mailto:info@firm.inc" className="text-primary-blue hover:underline">info@firm.inc</a>
                </p>
            </div>
            
                     {/* Divider before footer text - using config border color */}
              <hr className="border-t border-light-grey w-full my-12 md:my-16" />
         </div>
         {/* Radiopharmaceuticals Section */}
         <RadioisotopePeriodicDisplay />
      </section>
      {/* ===== END BOTTOM STRATEGIC DIVERGENCE SECTION ===== */}
    </>
  );
};

export default IsotopesOverview;