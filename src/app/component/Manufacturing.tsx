"use client";

import React from 'react';
import { motion } from 'framer-motion';


// Interface for the Manufacturing Cards
interface ManufacturingCardProps {
  id: number;
  title: string;
  description: string;
  stats: Array<{
    value: string;
    label: string;
  }>;
  elementBoxes?: Array<{
    symbol: string;
    name: string;
    number: string;
    mass: string;
    color: string;
    textColor: string;
  }>;
  fullWidth?: boolean;
}

// Data for Manufacturing Cards
const manufacturingCardsData: ManufacturingCardProps[] = [
  {
    id: 1,
    title: "Reactor-Based Production",
    description: "Nuclear reactors remain the backbone of global radioisotope supply. Although many reactors exist, the production of specific medical isotopes is concentrated in a few facilities:\nFission of Uranium Targets - Low-enriched uranium (LEU) is irradiated to produce fission products such as Molybdenum-99 (Mo-99), the precursor to Technetium-99m (Tc-99m)—the most widely used diagnostic isotope. This process generates high-specific-activity isotopes but also significant radioactive waste (e.g., ~50 Ci waste per 1 Ci Mo-99). Supply is concentrated in 5–10 aging research reactors globally, creating a fragile, centralized network dependent on complex international logistics and a handful of processing facilities(1) (2)\nNeutron Activation - Stable isotopes like Mo-98 are bombarded with neutrons to produce radioactive isotopes. This method avoids uranium use and reduces proliferation risk but produces lower-specific-activity products. As a result, more frequent generator replacements are needed, and chemical separation becomes more complex. Despite lower yields, this method is supported by a broader base of over 50 reactors, offering potential for distributed production. (1) (2)",
    stats: [
      {
        value: "220",
        label: "operational research reactors worldwide across 53 countries"
      },
      {
        value: "~10",
        label: "reactors involved in large-scale production of medical isotopes "
      }
    ],
    elementBoxes: [
      {
        symbol: "P",
        name: "Phosphorus",
        number: "15",
        mass: "32",
        color: "var(--color-primary-blue)", // β-emitter color
        textColor: "white"
      },
      {
        symbol: "Sr",
        name: "Strontium",
        number: "38",
        mass: "89",
        color: "var(--color-primary-blue)", // β-emitter color
        textColor: "white"
      },
      {
        symbol: "Y",
        name: "Yttrium",
        number: "39",
        mass: "90",
        color: "var(--color-primary-blue)", // β-emitter color
        textColor: "white"
      },
      {
        symbol: "I",
        name: "Iodine",
        number: "53",
        mass: "131",
        color: "var(--color-primary-blue)", // β-emitter color
        textColor: "white"
      },
      {
        symbol: "Ho",
        name: "Holmium",
        number: "67",
        mass: "166",
        color: "var(--color-primary-blue)", // β-emitter color
        textColor: "white"
      },
      {
        symbol: "Lu",
        name: "Lutetium",
        number: "71",
        mass: "177",
        color: "var(--color-primary-blue)", // β-emitter color
        textColor: "white"
      },
      {
        symbol: "Re",
        name: "Rhenium",
        number: "75",
        mass: "186",
        color: "var(--color-primary-blue)", // β-emitter color
        textColor: "white"
      },
      {
        symbol: "Pb",
        name: "Lead",
        number: "82",
        mass: "212",
        color: "var(--color-primary-blue)", // β-emitter color
        textColor: "white"
      },
      {
        symbol: "Ac",
        name: "Actinium",
        number: "89",
        mass: "225",
        color: "var(--color-primary-blue)", // β-emitter color
        textColor: "white"
      }
    ]
  },
  {
    id: 2,
    title: "Generator Systems",
    description: "Generators are compact devices that provide short-lived radionuclides on-site by separating them from a longer-lived parent isotope through radioactive decay. \n\nThe Mo-99/Tc-99m generator is the most widely used system in nuclear medicine, enabling approximately 30 million diagnostic imaging procedures annually (representing about 80% of all nuclear medicine diagnostics). It functions through the decay of Mo-99 to Tc-99m, which is routinely \"milked\" from generators at hospitals for heart, bone, and kidney scans. Production remains highly centralized and vulnerable to global reactor outages, yet this generator serves as the essential workhorse of diagnostic nuclear medicine. They are often tabletop or cart-sized units with substantial lead shielding (5) (6) (7)\n\n The Strontium-90/Yttrium-90 generator supplies 90Y (half-life: 64.0 hours), which is primarily used for radiation immunotherapy applications in oncology. The parent isotope 90Sr has an exceptionally long half-life of 28 years, allowing for extended generator functionality The 90Y radionuclide emits high-energy beta particles (2.3 MeV) that can effectively penetrate biological tissues, making it particularly valuable for treating liver cancer, colorectal cancer, and prostate cancer. (7)",
    stats: [
      {
        value: "10k",
        label: "Tc-99m generators used annually worldwides"
      },
      {
        value: "1-2",
        label: "Replacement cycle for Tc-99m generators"
      }
    ],
    elementBoxes: [
      {
        symbol: "Ga",
        name: "Gallium",
        number: "31",
        mass: "68",
        color: "var(--color-purple)", // Positron emitter color
        textColor: "white"
      },
      {
        symbol: "Rb",
        name: "Rubidium", 
        number: "37",
        mass: "82",
        color: "var(--color-purple)", // Positron emitter color
        textColor: "white"
      },
      {
        symbol: "Tc",
        name: "Technetium",
        number: "43",
        mass: "99m",
        color: "var(--color-g-color)", // γ-emitter color
        textColor: "var(--color-g-text)"
      },
      {
        symbol: "Bi",
        name: "Bismuth",
        number: "83",
        mass: "213",
        color: "var(--color-a-colour)", // α-emitter color
        textColor: "var(--color-a-text)"
      },
      {
        symbol: "Ra",
        name: "Radium",
        number: "88",
        mass: "223",
        color: "var(--color-a-colour)", // α-emitter color
        textColor: "var(--color-a-text)"
      },
      {
        symbol: "Th",
        name: "Thorium",
        number: "90",
        mass: "227",
        color: "var(--color-a-colour)", // α-emitter color
        textColor: "var(--color-a-text)"
      }
    ]
  },
  {
    id: 3,
    title: "",
    description: "",
    stats: [
      {
        value: "1500",
        label: "cyclotrons installed globally, for PET/SPECT isotopes"
      },
      {
        value: "<50",
        label: "cyclotrons are configured for alpha or heavy-particle production"
      }
    ],
    elementBoxes: [
      {
        symbol: "C",
        name: "Carbon",
        number: "6",
        mass: "11",
        color: "var(--color-purple)", // Positron emitter color
        textColor: "white"
      },
      {
        symbol: "N",
        name: "Nitrogen",
        number: "7",
        mass: "13",
        color: "var(--color-purple)", // Positron emitter color
        textColor: "white"
      },
      {
        symbol: "O",
        name: "Oxygen",
        number: "8",
        mass: "15",
        color: "var(--color-purple)", // Positron emitter color
        textColor: "white"
      },
      {
        symbol: "F",
        name: "Fluorine",
        number: "9",
        mass: "18",
        color: "var(--color-purple)", // Positron emitter color
        textColor: "white"
      },
      {
        symbol: "Cu",
        name: "Copper",
        number: "29",
        mass: "61", 
        color: "var(--color-purple)", // Positron emitter color
        textColor: "white"
      },
      {
        symbol: "Cu",
        name: "Copper",
        number: "29",
        mass: "64", 
        color: "var(--color-purple)", // Positron emitter color
        textColor: "white"
      },
      {
        symbol: "Ga",
        name: "Gallium",
        number: "31",
        mass: "66",
        color: "var(--color-purple)", // Positron emitter color
        textColor: "white"
      },
      {
        symbol: "Zr",
        name: "Zirconium",
        number: "40",
        mass: "89",
        color: "var(--color-purple)", // Positron emitter color
        textColor: "white"
      },
      {
        symbol: "I",
        name: "Iodine",
        number: "53",
        mass: "124",
        color: "var(--color-purple)", // Positron emitter color
        textColor: "white"
      },
      {
        symbol: "Ga",
        name: "Gallium",
        number: "31",
        mass: "67",
        color: "var(--color-g-color)", // γ-emitter color
        textColor: "var(--color-g-text)"
      },
      {
        symbol: "In",
        name: "Indium",
        number: "49",
        mass: "111",
        color: "var(--color-g-color)", // γ-emitter color
        textColor: "var(--color-g-text)"
      },
      {
        symbol: "I",
        name: "Iodine",
        number: "53",
        mass: "123",
        color: "var(--color-g-color)", // γ-emitter color
        textColor: "var(--color-g-text)"
      },
      {
        symbol: "Sc",
        name: "Scandium",
        number: "21",
        mass: "47",
        color: "var(--color-primary-blue)", // β-emitter color
        textColor: "white"
      },
      {
        symbol: "Cu",
        name: "Copper",
        number: "29",
        mass: "67",
        color: "var(--color-primary-blue)", // β-emitter color
        textColor: "white"
      },
      {
        symbol: "At",
        name: "Astatine",
        number: "85",
        mass: "211",
        color: "var(--color-a-colour)", // α-emitter color
        textColor: "var(--color-a-text)"
      }
    ],
    fullWidth: true
  }
];

// Component for the Manufacturing Cards
const ManufacturingCard: React.FC<{ 
  title: string, 
  description: string, 
  stats: Array<{value: string, label: string}>,
  elementBoxes?: Array<{
    symbol: string;
    name: string;
    number: string;
    mass: string;
    color: string;
    textColor: string;
  }>,
  fullWidth?: boolean,
  id: number
}> = ({ title, description, stats, elementBoxes, id }) => {
  // Determine which process tags to show based on card id
  const getProcessTags = () => {
    switch(id) {
      case 1: // Reactor-based
        return [
          "Fission of Uranium Targets",
          "Neutron Activation"
        ];
      case 2: // Generator-based
        return [
          "Mo-99/Tc-99m",
          "Strontium-90/Yttrium-90"
        ];
      case 3: // Cyclotron and Emerging
        if (title.includes("Cyclotron")) {
          return [
            "Direct Tc-99m",
            "Proton/Deuteron/Alpha Bombardment"
          ];
        } else {
          return [
            "Neutron Generators",
            "Non-Fission Pathways",
            "Linear Accelerator"
          ];
        }
      default:
        return [];
    }
  };

  // Determine which image to show based on card id
  const getImageSrc = () => {
    switch(id) {
      case 1:
        return "/reactor.svg";
      case 2:
        return "/generator.svg";
      case 3:
        return "/accelorator.svg";
      default:
        return "";
    }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Card with stats, image, title, tags and radioisotopes */}
      <div className="w-full px-6 pt-12 pb-8 bg-[#F5F5F5] rounded-lg flex flex-col justify-between items-start ">
        {/* Top section with statistics */}
        <div className="self-stretch inline-flex justify-start items-start gap-8 mb-8 ">
          {stats.map((stat, index) => (
            <div key={index} className="flex-1 justify-start">
              <span className="text-black text-h1 font-medium font-helvetica-now leading-none block">{stat.value}<br/></span>
              <span className="text-grey text-body-small font-medium font-helvetica-now leading-tight block mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
        
        {/* Image between stats and title - full width with correct ratio */}
        <div className="self-stretch w-full flex justify-center items-center my-6">
          <img src={getImageSrc()} alt={title} className="w-full h-auto object-contain max-w-full" />
        </div>
        
        {/* Title and first paragraph inside card */}
        <div className="self-stretch mb-6">
          {/* Title */}
          <div className="self-stretch text-black text-h4 font-bold font-helvetica-now leading-tight mb-4">
            {title}
          </div>
          
          {/* Only first paragraph inside card */}
          {id !== 3 && description.split('\n').length > 0 && (
            <p className="text-black text-body font-medium font-helvetica-now">
              {description.split('\n')[0]}
            </p>
          )}
          
          {id === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-black text-h4 font-bold font-helvetica-now mb-2">
                  Cyclotron-Based Production
                </h4>
                <p className="text-black text-body font-medium font-helvetica-now">
                Cyclotrons are particle accelerators that produce radionuclides by bombarding targets with charged particles, typically protons. They are increasingly being adapted for Mo-99 and Tc-99m production.
                </p>
              </div>
              <div>
                <h4 className="text-black text-h4 font-bold font-helvetica-now mb-2">
                  Emerging Accelerator-Based Technologies
                </h4>
                <p className="text-black text-body font-medium font-helvetica-now">
                New technologies aim to match reactor isotope yields without reactors, improving supply resilience. These require significant R&D and regulatory approval before mainstream adoption.(8) (10)
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Process tags/pills inside card */}
        <div className="inline-flex flex-wrap justify-start items-start gap-3 mb-6">
          {getProcessTags().map((tag, index) => (
            <div key={index} className="px-3 py-0.5 bg-[#282829] rounded-[90px] flex justify-center items-center gap-2.5">
              <div className="text-center justify-center text-[#eeeeee] text-body-small font-medium font-helvetica-now">{tag}</div>
            </div>
          ))}
        </div>
        
        {/* Element boxes inside card */}
        {elementBoxes && elementBoxes.length > 0 && (
          <div className="inline-flex flex-wrap justify-start items-start gap-2">
            {elementBoxes.map((element, index) => (
              <div 
                key={index}
                className="w-12 h-12 relative rounded-md bg-white flex flex-col items-center justify-center"
                style={{ border: `1px solid ${element.color}` }}
              >
                <span className="text-lg font-medium font-helvetica-now" style={{ color: element.color }}>
                  {element.symbol}
                </span>
                <span className="text-[10px] font-medium" style={{ color: element.color }}>
                  {element.mass}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Only small body text outside the card */}
      <div className="self-stretch">
        {id !== 3 ? (
          <div className="self-stretch">
            {description.split('\n').slice(1).map((paragraph, i) => {
              // Check if paragraph starts with a number followed by a period (like "1. ")
              const isNumberedPoint = /^\d+\.\s/.test(paragraph);
              
              if (isNumberedPoint) {
                const parts = paragraph.split(/^(\d+\.\s)/);
                if (parts.length >= 2) {
                  return (
                    <p key={i} className="mb-2 text-grey text-body-small font-medium font-helvetica-now">
                      <span className="font-medium">
                        {parts[1]}
                      </span>
                      <span>
                        {parts.slice(2).join('')}
                      </span>
                    </p>
                  );
                }
              }
              
              // For paragraphs with specific terms that should be bold
              if (paragraph.includes(':')) {
                const parts = paragraph.split(':');
                if (parts.length >= 2) {
                  return (
                    <p key={i} className="text-grey text-body-small font-medium font-helvetica-now mb-2">
                      {paragraph}
                    </p>
                  );
                }
              }
              
              // Regular paragraph
              return (
                <p key={i} className="text-grey text-body-small font-medium font-helvetica-now mb-2">
                  {paragraph}
                </p>
              );
            })}
          </div>
        ) : (
          // Custom layout for card #3 with two columns - small text only
          <div className="self-stretch grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Column 1: Cyclotron-Based Production */}
            <div className="self-stretch">
              <p className="text-grey text-body-small mb-2">
                <span className="font-medium font-helvetica-now">Direct Tc-99m Production: Involves proton bombardment of enriched Mo-100, producing Tc-99m directly without requiring fission. This method is decentralized and reactor-independent, but currently 3–10× more expensive and relies on enriched Mo-100 supplies, mostly sourced from Russia. (3)</span>
              </p>
              <p className="text-grey text-body-small mb-2">
                <span className="font-medium font-helvetica-now">Proton/Deuteron/Alpha Bombardment: Advanced systems use high-energy particles (e.g., deuterons or alpha particles) to either fission uranium targets or generate neutrons to indirectly produce Mo-99. These emerging systems—like SHINE's accelerator-driven neutron source—aim to replace reactors entirely, though they remain in the early stages of commercial deployment.(4)</span>
              </p>
            </div>
            
            {/* Column 2: Emerging Accelerator-Based Technologies */}
            <div className="self-stretch">
              <p className="text-grey text-body-small mb-2">
                <span className="font-medium font-helvetica-now">Neutron Generators & Fusion-Based Systems: Emerging platforms like accelerator-driven fusion (utilizing deuterium-tritium or deuterium-deuterium reactions) are being developed specifically for neutron production. These systems could effectively irradiate targets without requiring nuclear reactors or enriched uranium, potentially offering safer, more distributed, and scalable solutions. (8) (9)</span>
              </p>
              <p className="text-grey text-body-small mb-2">
                <span className="font-medium font-helvetica-now">Non-Fission Pathways: Experimental deuteron-based accelerator systems may substantially improve neutron flux efficiency while generating significantly less radioactive waste. High-current deuteron accelerators can create neutron fields sufficient for commercial-scale isotope production, though these systems remain under active development and have not yet achieved full commercial scalability. (9) (10)</span>
              </p>
              <p className="text-grey text-body-small mb-2">
                <span className="font-medium font-helvetica-now">Linear Accelerator Applications: Advanced electron LINAC systems are being adapted to produce photons that trigger photonuclear reactions capable of creating key medical isotopes. This approach eliminates proliferation concerns associated with uranium targets while potentially creating more flexible production networks.(5) (2) (11)</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Manufacturing: React.FC = () => {
  return (
    <>

    
      <section className="relative w-full bg-white py-16 md:py-24">
        <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-12">
          <div className="col-span-4 sm:col-span-8 md:col-span-12 lg:col-span-12 px-4 md:px-6 lg:px-8 ">

            {/* Introductory Paragraph */}
            <motion.div
              className="mb-12 md:mb-16 text-left max-w-4xl  py-32"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className="text-h3 font-helvetica-now text-black">
                Radionuclide manufacturing represents both a critical enabler and potential bottleneck for the entire ecosystem.
              </p>
              <br></br>
              <p className="text-h3 font-helvetica-now text-black">
            
                Organizations face pivotal strategic decisions—whether to build proprietary capabilities, leverage contract manufacturing networks, or create hybrid models that balance control with flexibility as isotope preferences, regulatory requirements, and patient demand patterns evolve.
              </p>
            </motion.div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {manufacturingCardsData.map(card => (
                <div key={card.id} className={card.fullWidth ? "col-span-1 md:col-span-2" : ""}>
                  <ManufacturingCard
                    id={card.id}
                    title={card.title}
                    description={card.description}
                    stats={card.stats}
                    elementBoxes={card.elementBoxes}
                    fullWidth={card.fullWidth}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Manufacturing; 