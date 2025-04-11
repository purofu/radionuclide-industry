// components/LigandsAndTargets.tsx
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import CompanyTreemapDisplay from './CompanyTreemapDisplay';

// Interface for the Targeting Method Cards
interface TargetingMethod {
  count: number;
  countLabel: string;
  title: string;
  description: string;
  tags: { name: string; bgColor: string }[];
}

// Data for Targeting Method Cards
const targetingMethodsData: TargetingMethod[] = [
  {
    count: 671,
    countLabel: 'total companies',
    title: 'Pharmaceutical & Biotech',
    description: 'While biotechs typically drive innovation through focused radiotherapeutic platforms and novel targeting approaches, larger pharma companies pursue dual strategies: strategic acquisitions of promising radiopharmaceutical assets and development of internal capabilities. ',
    tags: [
      { name: '45 Diagnosis', bgColor: 'bg-light-diagnostic' }, // Using defined colors
      { name: '34 Therapy', bgColor: 'bg-light-therapy' },     // Using defined colors
    ],
  },
  {
    count: 671,
    countLabel: 'total clinical trials',
    title: 'Peptides / Small Proteins',
    description: 'Peptides offer a balanced approach with the potential for high specificity and affinity, circulation times compatible to deliver radiotherapy, and flexibility for applications in imaging and therapy. Their manufacturing involves moderately complex synthesis procedures but are more challenging to scale than small molecules but less demanding than antibodies. Supply chain considerations include intermediate cold-chain requirements and moderate shelf-life limitations.',
    tags: [
      { name: 'Diagnosis', bgColor: 'bg-light-diagnostic' },
      { name: 'Therapy', bgColor: 'bg-light-therapy' },
    ],
  },
  {
    count: 671,
    countLabel: 'total clinical trials',
    title: 'Antibodies',
    description: 'Antibodies deliver unmatched targeting specificity and affinity, and have been the basis for many successful treatments in oncology, but their slower clearance rate makes antibodies less amenable to radiotherapy. Their manufacturing involves complex biological production systems requiring specialized infrastructure, rigorous quality control, and significant cost limits. Supply chain challenges include stringent cold-chain requirements, limited shelf stability, and specialized handling needs.',
    tags: [
      { name: 'Diagnosis', bgColor: 'bg-light-diagnostic' },
      // Therapy tag missing in screenshot, omitted here for accuracy to screenshot data within card
    ],
  },
];

const Companies: React.FC = () => {
  return (
    <section className="relative w-full bg-white py-16 md:py-24">
      {/* Main grid container - Using defined 16-col grid */}
      <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-12">
        {/* Content container with padding */}
        <div className="col-span-4 sm:col-span-8 md:col-span-12 lg:col-span-12 px-8 md:px-16 lg:px-24">

          {/* Section Title */}
          <motion.div
            className="mb-10 md:mb-12 text-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            {/* Using text-h2 style and font from config */}
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
             {/* Using text-body style and font from config */}
            <p className="text-h3 font-helvetica-now text-black">
            The radiopharmaceutical landscape is experiencing unprecedented growth, with a diverse array of players—from emerging biotechs to established pharmaceutical giants—actively developing novel therapies across multiple targets and isotopes.
            </p>
          </motion.div>

          {/* Two-column layout with card and text */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Company Card - Taking half the space */}
            <motion.div
              key={targetingMethodsData[0].title}
              className="flex flex-col justify-between p-6 border border-light-grey rounded-md bg-white min-h-[380px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {/* Top section: Count and Label */}
              <div className='w-full mb-4'>
                <div className="text-h1 justify-left font-helvetica-now text-black leading-none">
                  {targetingMethodsData[0].count}
                </div>
                <div className="text-body-small font-helvetica-now text-grey mt-1">
                  {targetingMethodsData[0].countLabel}
                </div>
              </div>

              {/* Bottom section: Title, Description, and Tags */}
              <div className="flex flex-col gap-2">
                <h4 className="text-h4 font-helvetica-now text-black">
                  {targetingMethodsData[0].title}
                </h4>
                <p className="text-body-small font-helvetica-now text-black mb-2">
                  {targetingMethodsData[0].description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {targetingMethodsData[0].tags.map((tag) => (
                    <div key={tag.name} className={`px-3 py-1 ${tag.bgColor} rounded-full flex items-center`}>
                      <p className="text-body-small font-helvetica-now text-black">{tag.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Text Content - Taking the other half of the space */}
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
          </div>

        </div>
      </div>
      <CompanyTreemapDisplay />
    </section>
  );
};

export default Companies;