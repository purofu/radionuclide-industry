// components/LigandsAndTargets.tsx
"use client";

import React from 'react';
import { motion } from 'framer-motion';
import TargetDisplay from './TargetDisplay';

// Reference data with URLs for references 3, 6-19
const references = {
  'ref3': {
    text: 'Referenced in context - needs specific citation',
    url: '#' // Placeholder - needs actual URL
  },
  'ref6': {
    text: 'Yan S, Na J, Liu X, Wu P. Different Targeting Ligands-Mediated Drug Delivery Systems for Tumor Therapy. Pharmaceutics. 2024 Feb 7;16(2):248.',
    url: 'https://doi.org/10.3390/pharmaceutics16020248'
  },
  'ref7': {
    text: 'International Atomic Energy Agency, Guidance for Preclinical Studies with Radiopharmaceuticals',
    url: 'https://www-pub.iaea.org/MTCD/publications/PDF/PUB2031_web.pdf'
  },
  'ref8': {
    text: 'Druggability of Targets for Diagnostic Radiopharmaceuticals Xinyu Wang, Chongyang Chen, Junjie Yan, Yuping Xu, Donghui Pan, Lizhen Wang, and Min Yang ACS Pharmacology & Translational Science 2023 6 (8), 1107-1119',
    url: 'https://doi.org/10.1021/acsptsci.3c00081'
  },
  'ref9': {
    text: 'Nelson BJB, Krol V, Bansal A, Andersson JD, Wuest F, Pandey MK. Aspects and prospects of preclinical theranostic radiopharmaceutical development. Theranostics 2024; 14(17):6446-6470.',
    url: 'https://www.thno.org/v14p6446.htm'
  },
  'ref10': {
    text: 'Price EW, Orvig C. Matching chelators to radiometals for radiopharmaceuticals. Chem Soc Rev. 2014 Jan 7;43(1):260-90.',
    url: 'https://doi.org/10.1039/c3cs60304k'
  },
  'ref11': {
    text: 'Sneddon D, Cornelissen B. Emerging chelators for nuclear imaging. Curr Opin Chem Biol. 2021 Aug;63:152-162.',
    url: 'https://doi.org/10.1016/j.cbpa.2021.03.001'
  },
  'ref12': {
    text: 'Baum, R. P., & Rösch, F. (Eds.). (2013). Theranostics, Gallium-68, and Other Radionuclides. Springer Berlin, Heidelberg.',
    url: 'https://doi.org/10.1007/978-3-642-27994-2'
  },
  'ref13': {
    text: 'Kratochwil, C., Giesel, F. L., & Haberkorn, U. (2017). A brief status report on the use of PSMA-ligands for diagnostics and therapy. Molecules, 22(4), 543.',
    url: 'https://doi.org/10.3390/molecules22040543'
  },
  'ref14': {
    text: 'NHS Specialist Pharmacy Service. (2019, September). A Standard Protocol for Deriving and Assessment of Stability Part 1: Pharmacy-prepared small molecule products (5th ed.).',
    url: 'https://www.sps.nhs.uk/wp-content/uploads/2013/12/Stability-part-1-small-molecules-5th-Ed-Sept-19.pdf'
  },
  'ref15': {
    text: 'Fani M, Maecke HR. Radiopharmaceutical development of radiolabelled peptides. Eur J Nucl Med Mol Imaging. 2012 Feb;39 Suppl 1:S11-30.',
    url: 'https://doi.org/10.1007/s00259-011-2001-z'
  },
  'ref16': {
    text: 'Decristoforo, C. (2012). The art and science of kit formulation in diagnostic nuclear medicine. Quarterly Journal of Nuclear Medicine and Molecular Imaging, 56(3), 223–235.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/22617329/'
  },
  'ref17': {
    text: 'Walsh, G. (2018). Biopharmaceutical benchmarks 2018. Nature Biotechnology, 36(12), 1136–1145.',
    url: 'https://doi.org/10.1038/nbt.4305'
  },
  'ref18': {
    text: 'Shukla, A. A., & Thömmes, J. (2010). Recent advances in large-scale production of monoclonal antibodies and related proteins. Trends in Biotechnology, 28(5), 253–261.',
    url: 'https://doi.org/10.1016/j.tibtech.2010.02.001'
  },
  'ref19': {
    text: 'Wang, W., Singh, S., Zeng, D. L., King, K., & Nema, S. (2007). Antibody structure, instability, and formulation. Journal of Pharmaceutical Sciences, 96(1), 1–26.',
    url: 'https://doi.org/10.1002/jps.20727'
  }
};

// Interface for the Targeting Method Cards
interface TargetingMethod {
  count: number;
  countLabel: string;
  title: string;
  description: string;
  tags: { name: string; bgColor: string }[];
}

// Data for Targeting Method Cards - Updated with reference numbers in brackets
const targetingMethodsData: TargetingMethod[] = [
  {
    count: 671,
    countLabel: 'total clinical trials',
    title: 'Small Molecules',
    description: 'Small molecules provide rapid tissue and even cellular penetration, the potential to target intracellular proteins, and the ability to fit into small areas like enzyme active sites.\n\n Their manufacturing offers relatively straightforward chemical synthesis pathways, scalable production processes[12], and longer shelf stability [12]. Supply chains benefit from simpler transportation requirements and less stringent cold-chain needs[14]. ',
    tags: [
      { name: 'Diagnosis', bgColor: 'bg-light-diagnostic' }, // Using defined colors
      { name: 'Therapy', bgColor: 'bg-light-therapy' },     // Using defined colors
    ],
  },
  {
    count: 671,
    countLabel: 'total clinical trials',
    title: 'Peptides / Small Proteins',
    description: 'Peptides offer a balanced approach with the potential for high specificity and affinity, circulation times compatible to deliver radiotherapy, and flexibility for applications in imaging and therapy. \n\n Their manufacturing involves moderately complex synthesis processes[15]  that are more challenging to scale than small molecules [3] but less demanding than antibodies. Supply chain considerations include intermediate cold-chain requirements and moderate shelf-life limitations [16] .',
    tags: [
      { name: 'Diagnosis', bgColor: 'bg-light-diagnostic' },
      { name: 'Therapy', bgColor: 'bg-light-therapy' },
    ],
  },
  {
    count: 671,
    countLabel: 'total clinical trials',
    title: 'Antibodies',
    description: 'Antibodies deliver unmatched targeting specificity and affinity and have been the basis for many successful treatments in oncology, but their slower clearance rate makes antibodies less amenable to radiotherapy. \n\n Their manufacturing involves complex biological production systems [17]requiring sophisticated infrastructure, rigorous quality control, and significant lead times [18]. Supply chain challenges include stringent cold-chain requirements, limited shelf stability, and specialized handling needs [19].',
    tags: [
      { name: 'Diagnosis', bgColor: 'bg-light-diagnostic' },
      // Therapy tag missing in screenshot, omitted here for accuracy to screenshot data within card
    ],
  },
];

// Function to render description with simple clickable references
const renderDescriptionWithRefs = (description: string) => {
  return description.split(/(\[6\]|\[7\]|\[8\]|\[9\]|\[10\]|\[11\]|\[12\]|\[13\]|\[14\]|\[15\]|\[16\]|\[17\]|\[18\]|\[19\]|\[3\])/).map((part, index) => {
    const refMap: { [key: string]: string } = {
      '[3]': 'ref3',
      '[6]': 'ref6',
      '[7]': 'ref7',
      '[8]': 'ref8',
      '[9]': 'ref9',
      '[10]': 'ref10',
      '[11]': 'ref11',
      '[12]': 'ref12',
      '[13]': 'ref13',
      '[14]': 'ref14',
      '[15]': 'ref15',
      '[16]': 'ref16',
      '[17]': 'ref17',
      '[18]': 'ref18',
      '[19]': 'ref19'
    };
    
    if (refMap[part]) {
      const refKey = refMap[part];
      const refData = references[refKey as keyof typeof references];
      return (
        <a
          key={index}
          href={refData.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 hover:underline"
          title={refData.text}
        >
          {part}
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

const LigandsAndTargets: React.FC = () => {
  return (
    <>
      <section className="relative w-full bg-white py-32 md:py-32">
        {/* Main grid container - Using defined 16-col grid */}
        <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-12">
          {/* Content container with padding */}
          <div className="col-span-4 mb-32 sm:col-span-8 md:col-span-12 lg:col-span-12 px-4 md:px-6 lg:px-8">

            {/* Introductory Paragraph */}
            <motion.div
              className="mb-32 md:mb-32 text-left max-w-4xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
               {/* Using text-body style and font from config */}
              <p className="text-h3 font-helvetica-now mb-48 mt-16 text-black">
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
                As the field has matured, developers have refined their approach to ligand selection based not only on target affinity and pharmacokinetic properties, but also on manufacturing complexity, and clinical workflow integration. Each ligand class offers distinct trade-offs between targeting precision, tissue penetration, manufacturing scalability, and delivery logistics.<a href={references.ref6.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline" title={references.ref6.text}>[6]</a>
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
                Target selection represents a consequential strategic decision in radiopharmaceutical development <a href={references.ref7.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline" title={references.ref7.text}>[7]</a>—one that shapes clinical development pathways <a href={references.ref8.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline" title={references.ref8.text}>[8]</a>, determines competitive positioning, and defines patient populations <a href={references.ref9.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline" title={references.ref9.text}>[9]</a>.
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
                Chelators play a critical role by ensuring stable binding between radioactive isotopes and targeting molecules, which is essential for both diagnostic and therapeutic applications. <a href={references.ref10.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline" title={references.ref10.text}>[10]</a> They also influence the biodistribution and clearance of the radiopharmaceutical <a href={references.ref11.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline" title={references.ref11.text}>[11]</a>.
                </p>
              </motion.div>
            </div>
            <p className="text-h4 font-helvetica-now mb-12 text-black">
              Ligand types
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
                      {renderDescriptionWithRefs(method.description)}
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