// components/LigandsAndTargets.tsx
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import TargetDisplay from './TargetDisplay';


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
    countLabel: 'total clinical trials',
    title: 'Small Molecules',
    description: 'Small molecules provide rapid tissue and even cellular penetration, the potential to target intracellular proteins, and the ability to fit into small areas like enzyme active sites.\n\n Their manufacturing offers relatively straightforward chemical synthesis pathways, scalable production processes(1), and longer shelf stability (2). Supply chains benefit from simpler transportation requirements and less stringent cold-chain needs(3). ',
    tags: [
      { name: 'Diagnosis', bgColor: 'bg-light-diagnostic' }, // Using defined colors
      { name: 'Therapy', bgColor: 'bg-light-therapy' },     // Using defined colors
    ],
  },
  {
    count: 671,
    countLabel: 'total clinical trials',
    title: 'Peptides / Small Proteins',
    description: 'Peptides offer a balanced approach with the potential for high specificity and affinity, circulation times compatible to deliver radiotherapy, and flexibility for applications in imaging and therapy. \n\n Their manufacturing involves moderately complex synthesis processes(4)  that are more challenging to scale than small molecules (5) but less demanding than antibodies. Supply chain considerations include intermediate cold-chain requirements and moderate shelf-life limitations (6) .',
    tags: [
      { name: 'Diagnosis', bgColor: 'bg-light-diagnostic' },
      { name: 'Therapy', bgColor: 'bg-light-therapy' },
    ],
  },
  {
    count: 671,
    countLabel: 'total clinical trials',
    title: 'Antibodies',
    description: 'Antibodies deliver unmatched targeting specificity and affinity and have been the basis for many successful treatments in oncology, but their slower clearance rate makes antibodies less amenable to radiotherapy. \n\n Their manufacturing involves complex biological production systems (7)requiring sophisticated infrastructure, rigorous quality control , and significant lead times (8). Supply chain challenges include stringent cold-chain requirements, limited shelf stability, and specialized handling needs (8).',
    tags: [
      { name: 'Diagnosis', bgColor: 'bg-light-diagnostic' },
      // Therapy tag missing in screenshot, omitted here for accuracy to screenshot data within card
    ],
  },
];

const LigandsAndTargets: React.FC = () => {
  return (
    <>
  
    
    
      <section className="relative w-full bg-white py-16 md:py-24">
        {/* Main grid container - Using defined 16-col grid */}
        <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-12">
          {/* Content container with padding */}
          <div className="col-span-4 mb-32 sm:col-span-8 md:col-span-12 lg:col-span-12 px-8 md:px-16 lg:px-24">

            {/* Introductory Paragraph */}
            <motion.div
              className="mb-12 md:mb-16 text-left max-w-4xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
               {/* Using text-body style and font from config */}
              <p className="text-h3 font-helvetica-now mb-32 text-black">
                Radiopharmaceutical targeting has evolved dramatically to address a spectrum of therapeutic needs. This proliferation of ligands and targeting mechanisms illustrates a critical inflection point for the industry where organizations will have to accommodate this growing complexity.
              </p>
            </motion.div>

            {/* Ligand Types & Target Types Sub-sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 mb-16 md:mb-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                 {/* Using text-h5 style, font, and color from config */}
                <h5 className="text-h5 font-helvetica-now text-black mb-3">Ligands </h5>
                {/* Using text-body-small style, font, and color from config */}
                <p className="text-h5 font-helvetica-now text-grey">
                As the field has matured, developers have refined their approach to ligand selection based not only on target affinity and pharmacokinetic properties, but also on manufacturing complexity, and clinical workflow integration. Each ligand class offers distinct trade-offs between targeting precision, tissue penetration, manufacturing scalability, and delivery logistics.(1)
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                {/* Using text-h5 style and font from config */}
                <h5 className="text-h5 font-helvetica-now text-black mb-3">Targets </h5>
                {/* Using text-body-small style, font, and color from config */}
                <p className="text-h5 font-helvetica-now text-grey">
                Target selection represents a consequential strategic decisions in radiopharmaceutical development (2)—one that shapes clinical development pathways (3), determines competitive positioning, and defines patient populations (4).
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                {/* Using text-h5 style and font from config */}
                <h5 className="text-h5 font-helvetica-now text-black mb-3">Chelators</h5>
                {/* Using text-body-small style, font, and color from config */}
                <p className="text-h5 font-helvetica-now text-grey">
                Chelators play a critical role by ensuring stable binding between radioactive isotopes and targeting molecules, which is essential for both diagnostic and therapeutic applications. (5) They also influence the biodistribution and clearance of the radiopharmaceutical (6).
                </p>
              </motion.div>
            </div>
            <p className="text-h4 font-helvetica-now mb-12 text-black">
              Ligands types
              </p>
            {/* 3 Targeting Method Cards Section */}
            {/* Using md:grid-cols-3 for three cards */}
            <div className="grid grid-cols-1  md:grid-cols-3 gap-6 md:gap-8">
              {targetingMethodsData.map((method, index) => (
                <motion.div
                  key={method.title}
                  // Card container styling - mimicking IsotopesOverview card structure
                  // Added justify-between and min-h-[value]
                  className="flex flex-col justify-between p-6 border border-light-grey rounded-md bg-white " // Adjusted min-height
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                >
                  

                  {/* Bottom section: Title, Description, and Tags (Grouped together like example's Title + Description) */}
                  
                  {/* Added flex flex-col gap-2 */}
                  <div className="flex flex-col gap-2">
                    {/* Title - using text-h4 style and font from config */}
                    <h4 className="text-h4 font-helvetica-now text-black">
                      {method.title}
                    </h4>
                    {/* Description - using text-body-small style and font from config */}
                    <p className="text-body-small font-helvetica-now text-black mb-2"> {/* Added slight mb */}
                      {method.description}
                    </p>
                    {/* Tags - Now part of the bottom content block */}
                    <div className="flex flex-wrap gap-2">
                      {method.tags.map((tag) => (
                        <div key={tag.name} className={`px-3 py-1 ${tag.bgColor} rounded-full flex items-center`}>
                          {/* Tag Text - using text-body-small style and font from config */}
                          <p className="text-body-small font-helvetica-now text-black">{tag.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
          
        </div>
        <TargetDisplay />
      </section>
    </>
  );
};

export default LigandsAndTargets;