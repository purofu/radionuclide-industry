"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from '@/theme/components'; // Import component styles

// Define the types for our data
type Radiopharmaceutical = {
  isotope: string;
  name: string;
  brandName: string;
  company: string;
  indication: string;
  url?: string;
};

type Category = {
  field: string;
  type: string;
  items: Radiopharmaceutical[];
};

// Original categories data (Assume this is populated as before)
const allCategoriesData: Category[] = [
    // ... (Keep the full data structure as provided previously) ...
    // Neurology Diagnostics
    {
      field: "Neurology",
      type: "Diagnostics",
      items: [
        {
          isotope: "[18F]",
          name: "Florbetaben",
          brandName: "Neuraceq",
          company: "Piramal Imaging",
          indication: "Alzheimer's disease imaging",
          url: "https://www.neuraceq.com/"
        },
        {
          isotope: "[99mTc]",
          name: "NaTcO4",
          brandName: "",
          company: "Generic",
          indication: "Cerebral imaging",
          url: ""
        },
        {
          isotope: "[18F]",
          name: "Flutemetamol",
          brandName: "Vizamyl",
          company: "GE Healthcare",
          indication: "Alzheimer's disease imaging",
          url: "https://www.gehealthcare.com/"
        },
        {
          isotope: "[99mTc]",
          name: "TcHMPAO",
          brandName: "Ceretec",
          company: "GE Healthcare",
          indication: "Cerebral perfusion imaging",
          url: "https://www.gehealthcare.com/"
        },
        {
          isotope: "[18F]",
          name: "Florbetapir",
          brandName: "Amyvid",
          company: "Eli Lilly",
          indication: "Alzheimer's disease imaging",
          url: "https://www.amyvid.com/"
        },
        {
          isotope: "[99mTc]",
          name: "TcECD",
          brandName: "",
          company: "GE Healthcare",
          indication: "Cerebral perfusion imaging",
          url: "https://www.gehealthcare.com/"
        },
        {
          isotope: "[18F]",
          name: "Flortaucipir",
          brandName: "Tauvid",
          company: "Roche",
          indication: "Tau imaging in Alzheimer's disease",
          url: "https://www.roche.com/"
        },
        {
          isotope: "[123I]",
          name: "Iomazenil",
          brandName: "",
          company: "Generic",
          indication: "Epilepsy/neuroreceptor imaging",
          url: ""
        },
        {
          isotope: "[18F]",
          name: "FDOPA",
          brandName: "",
          company: "Generic",
          indication: "Parkinson's disease imaging",
          url: ""
        },
        {
          isotope: "[123I]",
          name: "FP-CIT",
          brandName: "DaTSCAN",
          company: "GE Healthcare",
          indication: "Parkinsonian syndromes imaging",
          url: "https://www.gehealthcare.com/"
        },
        {
          isotope: "[18F]",
          name: "FP-CIT",
          brandName: "",
          company: "Generic",
          indication: "Parkinsonian syndromes imaging",
          url: ""
        },
        {
          isotope: "[18F]",
          name: "FDG",
          brandName: "FDG",
          company: "Generic",
          indication: "Brain metabolism imaging (epilepsy, dementia, tumors)",
          url: "https://en.wikipedia.org/wiki/Fluorodeoxyglucose"
        }
      ]
    },    
    // Oncology Diagnostics
    {
      field: "Oncology",
      type: "Diagnostics",
      items: [
        {
          isotope: "[18F]",
          name: "Fluoro-2-Deoxy-D-Glucose",
          brandName: "FDG",
          company: "Multiple Suppliers",
          indication: "Various cancers – metabolic imaging",
          url: "https://en.wikipedia.org/wiki/Fluorodeoxyglucose"
        },
        {
          isotope: "[99mTc]",
          name: "Tc-DTPA-Tilmanocept",
          brandName: "Lymphoseek",
          company: "Navidea Biopharmaceuticals",
          indication: "Sentinel lymph node mapping (breast, melanoma, head & neck)",
          url: "https://www.navidea.com/"
        },
        {
          isotope: "[18F]",
          name: "Flotufolastat",
          brandName: "",
          company: "Investigational",
          indication: "Prostate cancer imaging",
          url: ""
        },
        {
          isotope: "[99mTc]",
          name: "Arcitumomab",
          brandName: "CEA-Scan",
          company: "Immunomedics",
          indication: "Colorectal cancer imaging",
          url: "https://www.immunomedics.com/"
        },
        {
          isotope: "[18F]",
          name: "Fluciclovine",
          brandName: "Axumin",
          company: "Astellas / Blue Earth Diagnostics",
          indication: "Prostate cancer recurrence imaging",
          url: "https://www.axumin.com/"
        },
        {
          isotope: "[99mTc]",
          name: "TcN-pyridoxyl-5-methyltryptophan",
          brandName: "",
          company: "Generic",
          indication: "Liver tumor imaging",
          url: ""
        },
        {
          isotope: "[18F]",
          name: "PSMA-1007",
          brandName: "",
          company: "Generic",
          indication: "Prostate cancer imaging",
          url: ""
        },
        {
          isotope: "[99mTc]",
          name: "TcECG",
          brandName: "",
          company: "Investigational",
          indication: "Oncology imaging (unspecified)",
          url: ""
        },
        {
          isotope: "[18F]",
          name: "Piflufolastat",
          brandName: "Pylarify",
          company: "Lantheus Medical Imaging",
          indication: "Prostate cancer imaging",
          url: "https://www.lantheus.com/"
        },
        {
          isotope: "[99mTc]",
          name: "TcSulfur Colloid",
          brandName: "",
          company: "Generic",
          indication: "Liver/splenic imaging in cancer staging",
          url: ""
        },
        {
          isotope: "[18F]",
          name: "Fluoroestradiol",
          brandName: "FES",
          company: "Generic",
          indication: "Breast cancer (ER‑positive) imaging",
          url: ""
        },
        {
          isotope: "[99mTc]",
          name: "TcPhytate",
          brandName: "",
          company: "Generic",
          indication: "Liver tumor imaging",
          url: ""
        },
        {
          isotope: "[68Ga]",
          name: "Ga-DOTA-TATE",
          brandName: "NETSPOT",
          company: "Advanced Accelerator Applications / Ipsen",
          indication: "Neuroendocrine tumor imaging",
          url: "https://www.netspot.com/"
        },
        {
          isotope: "[99mTc]",
          name: "TcMDP",
          brandName: "",
          company: "Generic",
          indication: "Bone metastases imaging",
          url: ""
        },
        {
          isotope: "[68Ga]",
          name: "Ga-DOTA-TOC",
          brandName: "",
          company: "Generic",
          indication: "Neuroendocrine tumor imaging",
          url: ""
        },
        {
          isotope: "[99mTc]",
          name: "TcGH",
          brandName: "",
          company: "Investigational",
          indication: "Oncology imaging (unspecified)",
          url: ""
        },
        {
          isotope: "[68Ga]",
          name: "Ga-PSMA-11",
          brandName: "",
          company: "Generic",
          indication: "Prostate cancer imaging",
          url: ""
        },
        {
          isotope: "[111In]",
          name: "Capromab pendetide",
          brandName: "ProstaScint",
          company: "Cytogen",
          indication: "Prostate cancer imaging",
          url: "https://en.wikipedia.org/wiki/ProstaScint"
        },
        {
          isotope: "[11C]",
          name: "Choline",
          brandName: "",
          company: "Generic",
          indication: "Prostate cancer imaging",
          url: ""
        },
        {
          isotope: "[111In]",
          name: "In-DTPA-Octreotide",
          brandName: "OctreoScan",
          company: "Mallinckrodt Pharmaceuticals",
          indication: "Neuroendocrine tumor imaging",
          url: "https://www.mallinckrodt.com/"
        },
        {
          isotope: "[64Cu]",
          name: "Cu-DOTA-TATE",
          brandName: "",
          company: "Generic",
          indication: "Neuroendocrine tumor imaging",
          url: ""
        },
        {
          isotope: "[111In]",
          name: "Satumomab pendetide",
          brandName: "",
          company: "Investigational",
          indication: "Oncology imaging (unspecified)",
          url: ""
        },
        {
          isotope: "[123I]",
          name: "MIBG",
          brandName: "",
          company: "Generic",
          indication: "Neuroendocrine tumor imaging (pheochromocytoma, neuroblastoma)",
          url: ""
        },
        {
          isotope: "[123I]",
          name: "Sodium iodinate",
          brandName: "",
          company: "Generic",
          indication: "Thyroid cancer imaging",
          url: ""
        },
        {
          isotope: "[67Ga]",
          name: "Gallium citrate",
          brandName: "",
          company: "Generic",
          indication: "Lymphoma and various cancers imaging",
          url: ""
        }
      ]
    },
    
    // Cardiology Diagnostics
    {
      field: "Cardiology",
      type: "Diagnostics",
      items: [
        {
          isotope: "[18F]",
          name: "FDG",
          brandName: "FDG",
          company: "Generic",
          indication: "Cardiac viability imaging",
          url: "https://en.wikipedia.org/wiki/Fluorodeoxyglucose"
        },
        {
          isotope: "[99mTc]",
          name: "Tetrofosmin",
          brandName: "Myoview",
          company: "GE Healthcare",
          indication: "Myocardial perfusion imaging",
          url: "https://www.gehealthcare.com/"
        },
        {
          isotope: "[13N]",
          name: "NH3·H2O",
          brandName: "",
          company: "Generic",
          indication: "Myocardial perfusion imaging",
          url: ""
        },
        {
          isotope: "[99mTc]",
          name: "Sestamibi",
          brandName: "Cardiolite",
          company: "Bristol-Myers Squibb / GE Healthcare",
          indication: "Myocardial perfusion imaging",
          url: "https://www.gehealthcare.com/"
        },
        {
          isotope: "[82Rb]",
          name: "Rubidium chloride",
          brandName: "",
          company: "Generic",
          indication: "Myocardial perfusion imaging",
          url: ""
        },
        {
          isotope: "[99mTc]",
          name: "TcRBCs",
          brandName: "",
          company: "Generic",
          indication: "Cardiac function assessment",
          url: ""
        },
        {
          isotope: "[99mTc]",
          name: "TcPYP",
          brandName: "",
          company: "Generic",
          indication: "Cardiac amyloidosis imaging",
          url: ""
        },
        {
          isotope: "[125I]",
          name: "Iodinated albumin",
          brandName: "",
          company: "Generic",
          indication: "Cardiac blood pool imaging",
          url: ""
        },
        {
          isotope: "[201Tl]",
          name: "Thallium chloride",
          brandName: "",
          company: "Generic",
          indication: "Myocardial perfusion imaging",
          url: ""
        }
      ]
    },
    // Bone Imaging Diagnostics
    {
      field: "Bone Imaging",
      type: "Diagnostics",
      items: [
        {
          isotope: "[18F]",
          name: "NaF",
          brandName: "",
          company: "Generic",
          indication: "Bone metastases imaging",
          url: ""
        },
        {
          isotope: "[99mTc]",
          name: "Sulesomab",
          brandName: "",
          company: "Generic",
          indication: "Bone infection/metastases imaging",
          url: ""
        }
      ]
    },
    // Nephrotic Syndrome Diagnostics
    {
      field: "Nephrotic Syndrome",
      type: "Diagnostics",
      items: [
        {
          isotope: "[99mTc]",
          name: "TcDTPA2-",
          brandName: "",
          company: "Generic",
          indication: "Renal function imaging",
          url: ""
        },
        {
          isotope: "[99mTc]",
          name: "TcSuccimer",
          brandName: "",
          company: "Generic",
          indication: "Renal imaging",
          url: ""
        },
        {
          isotope: "[99mTc]",
          name: "TcMAG3",
          brandName: "",
          company: "Generic",
          indication: "Renal tubular function imaging",
          url: ""
        },
        {
          isotope: "[99mTc]",
          name: "Human serum albumin DTPA",
          brandName: "",
          company: "Generic",
          indication: "Renal imaging",
          url: ""
        }
      ]
    },
    // Hepatopulmonary Imaging Diagnostics
    {
      field: "Hepatopulmonary Imaging",
      type: "Diagnostics",
      items: [
        {
          isotope: "[99mTc]",
          name: "Albumin Aggregate Injection",
          brandName: "",
          company: "Generic",
          indication: "Lung perfusion imaging",
          url: ""
        },
        {
          isotope: "[99mTc]",
          name: "DTPA-galactosyl-HSA",
          brandName: "",
          company: "Generic",
          indication: "Liver function imaging",
          url: ""
        },
        {
          isotope: "[99mTc]",
          name: "Macroaggregated human serum albumin",
          brandName: "",
          company: "Generic",
          indication: "Lung perfusion imaging",
          url: ""
        },
        {
          isotope: "[99mTc]",
          name: "TcMebrofenin",
          brandName: "",
          company: "Generic",
          indication: "Hepatobiliary imaging",
          url: ""
        }
      ]
    },
    // Oncology Therapy (Therapeutic Radiopharmaceuticals)
    {
      field: "Oncology",
      type: "Therapy",
      items: [
        {
          isotope: "[223Ra]",
          name: "RaCl",
          brandName: "Xofigo",
          company: "Bayer Healthcare",
          indication: "Prostate cancer with bone metastases",
          url: "https://www.xofigo.com/"
        },
        {
          isotope: "[90Y]",
          name: "Glass microspheres",
          brandName: "TheraSphere",
          company: "BTG",
          indication: "Liver cancer (primary and metastatic)",
          url: "http://www.therasphere.com/"
        },
        {
          isotope: "[32P]",
          name: "Sodium orthophosphate",
          brandName: "",
          company: "Nordion International",
          indication: "Polycythemia vera and bone disorders",
          url: "https://www.nordion.com/"
        },
        {
          isotope: "[90Y]",
          name: "Y-DTPA-Ibritumomab Tiuxetan",
          brandName: "Zevalin",
          company: "Spectrum Pharmaceuticals",
          indication: "Non-Hodgkin's lymphoma",
          url: "https://www.zevalin.com/"
        },
        {
          isotope: "[89Sr]",
          name: "SrCl₂",
          brandName: "Metastron",
          company: "Mallinckrodt Pharmaceuticals",
          indication: "Bone metastases (pain palliation)",
          url: "https://www.mallinckrodt.com/"
        },
        {
          isotope: "[131I]",
          name: "MIBG",
          brandName: "Azdedra",
          company: "Novartis",
          indication: "Neuroendocrine tumors (pheochromocytoma, neuroblastoma)",
          url: "https://www.azedra.com/"
        },
        {
          isotope: "[153Sm]",
          name: "Lexidronam",
          brandName: "Quadramet",
          company: "Ipsen",
          indication: "Bone metastases (pain palliation)",
          url: "https://www.ipsen.com/"
        },
        {
          isotope: "[131I]",
          name: "Sodium Iodide",
          brandName: "",
          company: "Mallinckrodt Pharmaceuticals",
          indication: "Thyroid cancer (ablation therapy)",
          url: "https://www.mallinckrodt.com/"
        },
        {
          isotope: "[177Lu]",
          name: "Lu-PSMA-617",
          brandName: "Pluvicto",
          company: "Novartis",
          indication: "Metastatic castration-resistant prostate cancer",
          url: "https://www.pluvicto.com/"
        },
        {
          isotope: "[131I]",
          name: "Metuximab",
          brandName: "Licartin",
          company: "Beijing 301 Hospital",
          indication: "Hepatocellular carcinoma",
          url: "http://www.301hospital.com.cn/"
        },
        {
          isotope: "[177Lu]",
          name: "Lu-DOTA-TATE",
          brandName: "Lutathera",
          company: "Advanced Accelerator Applications",
          indication: "Neuroendocrine tumors",
          url: "https://www.lutathera.com/"
        },
        {
          isotope: "[131I]",
          name: "Tositumomab",
          brandName: "Bexxar",
          company: "GlaxoSmithKline",
          indication: "Non-Hodgkin's lymphoma",
          url: "https://www.gsk.com/"
        },
        {
          isotope: "[90Y]",
          name: "Resin microspheres",
          brandName: "SIR-Spheres",
          company: "Sirtex Medical",
          indication: "Liver cancer (primary and metastatic)",
          url: "https://www.sirtex.com/"
        }
      ]
    }
];

const RadiopharmaceuticalsSection = () => {
  // Group categories by type with oncology categories separate
  const { diagnosticCategories, oncologyCategories } = React.useMemo(() => {
    // Separate oncology categories
    const oncologyCategories = allCategoriesData.filter(cat => 
      cat.field === "Oncology"
    );
    
    // All other diagnostic categories
    const diagnosticCategories = allCategoriesData.filter(cat => 
      !(cat.field === "Oncology")
    );
    
    return { diagnosticCategories, oncologyCategories };
  }, []);

  // State for active category
  const [activeLeft, setActiveLeft] = useState<string>(diagnosticCategories[0]?.field || "");
  const [activeRight, setActiveRight] = useState<string>(oncologyCategories[0]?.type || "");

  // Simple animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <section className="w-full py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Title section */}
        <motion.div
          className="w-full mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-h4 md:text-h4 font-bold">
            <span className="text-grey">List of approved</span> <span className="text-black">radiopharmaceuticals</span> <span className="text-grey">across</span> <span className="text-black">therapy & diagnosis</span>
          </h2>
        </motion.div>

        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left Column - Diagnostics (non-oncology) */}
          <div className="w-full">
            {/* Tab navigation with underline */}
            <div className="border-b border-grey/30 mb-6">
              <nav className="flex overflow-x-auto pb-px hide-scrollbar">
                {diagnosticCategories.map((category, index) => (
                  <button
                    key={`tab-diag-${index}`}
                    onClick={() => setActiveLeft(category.field)}
                    className={`inline-block px-5 py-3 text-sm font-medium transition-colors border-b-2 min-w-max mr-4 ${
                      activeLeft === category.field 
                        ? 'border-purple text-purple' 
                        : 'border-transparent text-grey hover:text-black hover:border-grey/30'
                    }`}
                  >
                    {category.field}
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Content with standard scrolling */}
            <div className="h-[550px] overflow-y-auto pr-2">
              {diagnosticCategories.map((category, catIndex) => (
                <div
                  key={`${category.field}-${category.type}`}
                  className={activeLeft === category.field ? 'block' : 'hidden'}
                >
                  <div className="sticky top-0 bg-white z-10 py-3 border-b border-grey/20 mb-5">
                    <h3 className="text-xl font-medium">
                      <span className="text-grey">{category.field} - </span>
                      <span className="text-black">{category.type}</span>
                    </h3>
                  </div>

                  <div className="space-y-4 pb-8">
                    {category.items.map((item, itemIdx) => (
                      <motion.div
                        key={itemIdx}
                        className={styles.card.data("")}
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                      >
                        {/* Top part: Name/Brand + Company */}
                        <div className="flex items-start justify-between mb-2 gap-2">
                          <div className="flex-1 min-w-0 mr-2">
                            <span className="text-purple font-helvetica-now">{item.isotope}</span>
                            <span className="text-black font-helvetica-now"> {item.name} </span>
                            {item.url && item.brandName ? (
                              <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-primary-blue font-helvetica-now hover:underline">
                                ({item.brandName})
                              </a>
                            ) : item.brandName ? (
                              <span className="text-primary-blue font-helvetica-now">
                                ({item.brandName})
                              </span>
                            ) : null}
                          </div>
                          <span className="text-grey font-helvetica-now flex-shrink-0 text-right">{item.company}</span>
                        </div>
                        {/* Bottom part: Indication */}
                        <div className="text-sm text-grey mt-1">
                          {item.indication}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Column - Oncology (both diagnostic and therapy) */}
          <div className="w-full">
            {/* Tab navigation with underline */}
            <div className="border-b border-grey/30 mb-6">
              <nav className="flex overflow-x-auto pb-px hide-scrollbar">
                {oncologyCategories.map((category, index) => (
                  <button
                    key={`tab-onc-${index}`}
                    onClick={() => setActiveRight(category.type)}
                    className={`inline-block px-5 py-3 text-sm font-medium transition-colors border-b-2 min-w-max mr-4 ${
                      activeRight === category.type 
                        ? 'border-purple text-purple' 
                        : 'border-transparent text-grey hover:text-black hover:border-grey/30'
                    }`}
                  >
                    {category.type}
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Content with standard scrolling */}
            <div className="h-[550px] overflow-y-auto pr-2">
              {oncologyCategories.map((category, catIndex) => (
                <div
                  key={`${category.field}-${category.type}`}
                  className={activeRight === category.type ? 'block' : 'hidden'}
                >
                  <div className="sticky top-0 bg-white z-10 py-3 border-b border-grey/20 mb-5">
                    <h3 className="text-xl font-medium">
                      <span className="text-grey">{category.field} - </span>
                      <span className="text-black">{category.type}</span>
                    </h3>
                  </div>

                  <div className="space-y-4 pb-8">
                    {category.items.map((item, itemIdx) => (
                      <motion.div
                        key={itemIdx}
                        className={styles.card.data("")}
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                      >
                        {/* Top part: Name/Brand + Company */}
                        <div className="flex items-start justify-between mb-2 gap-2">
                          <div className="flex-1 min-w-0 mr-2">
                            <span className="text-purple font-helvetica-now">{item.isotope}</span>
                            <span className="text-black font-helvetica-now"> {item.name} </span>
                            {item.url && item.brandName ? (
                              <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-primary-blue font-helvetica-now hover:underline">
                                ({item.brandName})
                              </a>
                            ) : item.brandName ? (
                              <span className="text-primary-blue font-helvetica-now">
                                ({item.brandName})
                              </span>
                            ) : null}
                          </div>
                          <span className="text-grey font-helvetica-now flex-shrink-0 text-right">{item.company}</span>
                        </div>
                        {/* Bottom part: Indication */}
                        <div className="text-sm text-grey mt-1">
                          {item.indication}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="text-left text-body-small font-helvetica-now text-grey md:my-8">
                <p>Last updated: April, 2025</p>
                <p className="mt-1">
                Help us keep things accurate. If you notice any outdated or incorrect information, email us at <a href="mailto:info@firm.inc" className="text-primary-blue hover:underline">info@firm.inc</a>
                </p>
            </div>
      </div>
    </section>
  );
};

export default RadiopharmaceuticalsSection;