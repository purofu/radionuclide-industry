// components/IsotopesOverview.tsx
"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import RadioisotopePeriodicDisplay from './RadioisotopePeriodicDisplay';
import { Tabs } from '@/components/ui';
import { Tooltip } from 'react-tooltip';

// Add custom styles for tooltips
const tooltipStyles = `
  .tooltip-custom {
    z-index: 2147483647 !important;
    position: fixed !important;
    pointer-events: auto !important;
  }
  
  .tooltip-custom * {
    pointer-events: auto !important;
  }
  
  /* Ensure tooltip content is clickable */
  .tooltip-custom a {
    pointer-events: auto !important;
    cursor: pointer !important;
  }
`;

// Reference data with URLs
const references = {
  'ref2': {
    text: 'Greg Kaser (2024) The World Nuclear Supply Chain – An Overview',
    url: 'https://www.oecd-nea.org/upload/docs/application/pdf/2020-07/wpne_workshop_2._1_the_world_nuclear_supply_chain_an_overview.pdf'
  },
  'ref3': {
    text: 'Herrmann, K., et al. (2020). "Radiotheranostics: A roadmap for future development." The Lancet Oncology, 21(3), e146-e156.',
    url: 'https://doi.org/10.1016/S1470-2045(19)30757-9'
  },
  'ref4': {
    text: 'World Nuclear Association. Radioisotopes in Medicine Report.',
    url: 'https://world-nuclear.org/information-library/non-power-nuclear-applications/radioisotopes-research/radioisotopes-in-medicine'
  },
  'ref5': {
    text: 'Young JD, Jauregui-Osoro M, Wong WL, Cooper MS, Cook G, Barrington SF, et al. An overview of nuclear medicine research in the UK and the landscape for clinical adoption. Nucl Med Commun',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8584216/'
  }
};

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
    tagBg: 'bg-light-therapy',
    dotColor: 'bg-a-colour',
    title: 'α-emitters',
    description: 'These radionuclides have the highest potency with ultra-precise targeting, enabling minimal collateral damage to healthy tissue. Their high supply chain complexity, specialized production requirements, long-lived waste management challenges, and highest relative cost create significant logistical hurdles for widespread adoption.[2]',
  },
  {
    tag: 'Therapy',
    tagBg: 'bg-light-therapy',
    dotColor: 'bg-primary-blue',
    title: 'β-emitters',
    description: 'Beta-emitters have lower energy but longer tissue range, often advantageous for medium-to-large tumor masses. Their well-known decay properties, established commercial infrastructure and regulatory pathways reduce market entry barriers compared to alpha therapies.[3]',
  },
  {
    tag: 'Diagnosis',
    tagBg: 'bg-light-diagnostic',
    dotColor: 'bg-purple',
    title: 'Positron emitters',
    description: 'Positron emitters deliver the highest diagnostic imaging quality through PET/CT, offering superior sensitivity and resolution for detecting small lesions. Their typically short half-lives (minutes to hours) create distribution challenges requiring either cyclotron networks or on-site production.[4]',
  },
  {
    tag: 'Diagnosis',
    tagBg: 'bg-light-diagnostic',
    dotColor: 'bg-g-color',
    title: 'γ-emitters',
    description: 'Gamma-emitters provide the backbone of conventional nuclear medicine diagnostics with the most mature infrastructure and moderate costs. Generator-based supply chains offer accessibility and reliability. Long penetration range enables whole-body imaging with well-understood regulatory pathways.[5]',
  },
];

// Interface and Data for Bar Chart
interface BarChartData {
    label: string;
    trialValue: number;
    companyValue: number;
    colorClass: string;
    valueColorClass: string;
    labelColorClass: string;
}

const barChartData: BarChartData[] = [
    { 
      label: 'α-emitters', 
      trialValue: 48, 
      companyValue: 13, 
      colorClass: 'bg-a-colour', 
      valueColorClass: 'text-black',
      labelColorClass: 'text-a-text-colour'
    },
    { 
      label: 'β-emitters', 
      trialValue: 123, 
      companyValue: 56, 
      colorClass: 'bg-primary-blue', 
      valueColorClass: 'text-white',
      labelColorClass: 'text-black' 
    },
    { 
      label: 'Positron', 
      trialValue: 277, 
      companyValue: 64, 
      colorClass: 'bg-purple', 
      valueColorClass: 'text-white',
      labelColorClass: 'text-black' 
    },
    { 
      label: 'γ-emitters', 
      trialValue: 37, 
      companyValue: 18,
      colorClass: 'bg-g-color', 
      valueColorClass: 'text-black',
      labelColorClass: 'text-g-text-colour' 
    },
];

// Text content for each tab with proper totals and brackets
const tabText = {
  trials: "While positron emitters dominate the landscape in clinical trials [277] due to their long-established role in diagnostic imaging, beta-emitters [123] represent the current therapeutic focus. The growing interest in alpha-emitters [48], though still the newcomers, signals an important evolution in therapeutic approach with their uniquely ultra-precise targeting properties.",
  companies: "While positron emitters lead in company count [64] due to their established diagnostic role, beta-emitters [56] show strong therapeutic commercial interest. The growing number of companies pursuing alpha-emitters [13], though still emerging, signals an important evolution in therapeutic development with their uniquely ultra-precise targeting properties."
};

const IsotopesOverview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'trials' | 'companies'>('trials');
  
  // Function to get the max value based on active tab
  const getMaxValue = () => {
    return Math.max(...barChartData.map(item => 
      activeTab === 'trials' ? item.trialValue : item.companyValue
    ));
  };

  // Calculate height classes dynamically based on max value
  const calculateHeight = (value: number) => {
    const maxValue = getMaxValue();
    const heightPercentage = (value / maxValue) * 100;
    return Math.round((heightPercentage / 100) * 250);
  };

  // Function to render description with clickable references
  const renderDescriptionWithRefs = (description: string) => {
    return description.split(/(\[2\]|\[3\]|\[4\]|\[5\])/).map((part, index) => {
      if (part === '[2]') {
        return (
          <span key={index}>
            <span
              data-tooltip-id="ref2"
              className="inline-block text-blue-600 hover:text-blue-800 hover:underline font-bold cursor-pointer px-1 py-0.5 rounded hover:bg-blue-50 transition-all duration-200 text-sm align-super"
              style={{ userSelect: 'none', fontSize: '0.75em', verticalAlign: 'super' }}
            >
              ²
            </span>
          </span>
        );
      } else if (part === '[3]') {
        return (
          <span key={index}>
            <span
              data-tooltip-id="ref3"
              className="inline-block text-blue-600 hover:text-blue-800 hover:underline font-bold cursor-pointer px-1 py-0.5 rounded hover:bg-blue-50 transition-all duration-200 text-sm align-super"
              style={{ userSelect: 'none', fontSize: '0.75em', verticalAlign: 'super' }}
            >
              ³
            </span>
          </span>
        );
      } else if (part === '[4]') {
        return (
          <span key={index}>
            <span
              data-tooltip-id="ref4"
              className="inline-block text-blue-600 hover:text-blue-800 hover:underline font-bold cursor-pointer px-1 py-0.5 rounded hover:bg-blue-50 transition-all duration-200 text-sm align-super"
              style={{ userSelect: 'none', fontSize: '0.75em', verticalAlign: 'super' }}
            >
              ⁴
            </span>
          </span>
        );
      } else if (part === '[5]') {
        return (
          <span key={index}>
            <span
              data-tooltip-id="ref5"
              className="inline-block text-blue-600 hover:text-blue-800 hover:underline font-bold cursor-pointer px-1 py-0.5 rounded hover:bg-blue-50 transition-all duration-200 text-sm align-super"
              style={{ userSelect: 'none', fontSize: '0.75em', verticalAlign: 'super' }}
            >
              ⁵
            </span>
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <>
      {/* Inject custom tooltip styles */}
      <style dangerouslySetInnerHTML={{ __html: tooltipStyles }} />
      
      {/* React Tooltip Components */}
      <Tooltip
        id="ref2"
        clickable
        place="top"
        events={['click']}
        globalCloseEvents={{ escape: true, scroll: true, resize: true, clickOutsideAnchor: true }}
        style={{
          backgroundColor: 'white',
          color: 'black',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)',
          maxWidth: '400px',
          padding: '16px',
          fontSize: '14px',
          lineHeight: '1.5',
          zIndex: '2147483647',
          position: 'fixed'
        }}
        className="tooltip-custom"
      >
        <div>
          <h4 style={{ fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>Reference</h4>
          <p style={{ marginBottom: '12px', color: '#374151' }}>{references.ref2.text}</p>
          <a 
            href={references.ref2.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}
            onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            View Source →
          </a>
        </div>
      </Tooltip>

      <Tooltip
        id="ref3"
        clickable
        place="top"
        events={['click']}
        globalCloseEvents={{ escape: true, scroll: true, resize: true, clickOutsideAnchor: true }}
        style={{
          backgroundColor: 'white',
          color: 'black',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)',
          maxWidth: '400px',
          padding: '16px',
          fontSize: '14px',
          lineHeight: '1.5',
          zIndex: '2147483647',
          position: 'fixed'
        }}
        className="tooltip-custom"
      >
        <div>
          <h4 style={{ fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>Reference</h4>
          <p style={{ marginBottom: '12px', color: '#374151' }}>{references.ref3.text}</p>
          <a 
            href={references.ref3.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}
            onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            View Source →
          </a>
        </div>
      </Tooltip>

      <Tooltip
        id="ref4"
        clickable
        place="top"
        events={['click']}
        globalCloseEvents={{ escape: true, scroll: true, resize: true, clickOutsideAnchor: true }}
        style={{
          backgroundColor: 'white',
          color: 'black',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)',
          maxWidth: '400px',
          padding: '16px',
          fontSize: '14px',
          lineHeight: '1.5',
          zIndex: '2147483647',
          position: 'fixed'
        }}
        className="tooltip-custom"
      >
        <div>
          <h4 style={{ fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>Reference</h4>
          <p style={{ marginBottom: '12px', color: '#374151' }}>{references.ref4.text}</p>
          <a 
            href={references.ref4.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}
            onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            View Source →
          </a>
        </div>
      </Tooltip>

      <Tooltip
        id="ref5"
        clickable
        place="top"
        events={['click']}
        globalCloseEvents={{ escape: true, scroll: true, resize: true, clickOutsideAnchor: true }}
        style={{
          backgroundColor: 'white',
          color: 'black',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)',
          maxWidth: '400px',
          padding: '16px',
          fontSize: '14px',
          lineHeight: '1.5',
          zIndex: '2147483647',
          position: 'fixed'
        }}
        className="tooltip-custom"
      >
        <div>
          <h4 style={{ fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>Reference</h4>
          <p style={{ marginBottom: '12px', color: '#374151' }}>{references.ref5.text}</p>
          <a 
            href={references.ref5.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}
            onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
            onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
          >
            View Source →
          </a>
        </div>
      </Tooltip>

      {/* ===== ISOTOPES OVERVIEW SECTION ===== */}
      <section className="relative w-full bg-white">
        {/* Main grid container - Using defined 16-col grid */}
        <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-12 py-32 md:py-32">
          {/* Content container with padding */}
          <div className="col-span-4 sm:col-span-8 md:col-span-12 lg:col-span-12 px-4 md:px-6 lg:px-8">

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
                       {renderDescriptionWithRefs(isotope.description)}
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
         <div className="px-4 md:px-6 lg:px-8">

             {/* Section Title - using text-h3 style from config */}
             <motion.h3
               className="text-h3 font-helvetica-now text-black mb-8"
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.8, delay: 0.2 }}
             >
                 Total clinical trials & companies by radioisotope type
             </motion.h3>

             {/* Replace DataTabs with our new Tabs component */}
             <Tabs
               titleTabs={[
                 { id: 'trials', label: 'Clinical Trials' },
                 { id: 'companies', label: 'Companies' }
               ]}
               defaultTitleTab={activeTab}
               onTitleTabChange={(tabId) => setActiveTab(tabId as 'trials' | 'companies')}
               className="mb-8"
             />

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
                     {barChartData.map((item) => {
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
                                 {/* Number with brackets - using text-h2 size */}
                                 <AnimatePresence mode="wait">
                                   <motion.span
                                     key={`${activeTab}-${currentValue}`}
                                     className={`font-helvetica-now text-h2 ${item.valueColorClass} text-center`}
                                     initial={{ opacity: 0 }}
                                     animate={{ opacity: 1 }}
                                     exit={{ opacity: 0 }}
                                     transition={{ duration: 0.3 }}
                                   >
                                     [{currentValue}]
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
                <p>Last updated:  June, 2025</p>
                <p className="mt-1">
                Help us keep things accurate. If you notice any outdated or incorrect information, email us at <a href="mailto:info@firm.inc" className="text-primary-blue hover:underline">info@firm.inc</a>
                </p>
            </div>
            
                     {/* Divider before footer text - using config border color */}
              <hr className="border-t border-light-grey w-full " />
         </div>
         {/* Radiopharmaceuticals Section */}
         <RadioisotopePeriodicDisplay />
      </section>
      {/* ===== END BOTTOM STRATEGIC DIVERGENCE SECTION ===== */}
    </>
  );
};

export default IsotopesOverview;