"use client";

import React from 'react';
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

  // Add animation variants for smoother, more consistent animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 50, 
        damping: 10,
        mass: 0.3
      } 
    }
  };

  return (
    <section className={styles.section.wrapper()}>
      {/* Apply base grid structure for overall page layout */}
      <div className={styles.section.container()}>
        {/* Title section */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h4 className={styles.typography.cardTitle("mb-6")}>
            <span className="text-grey">Approved</span> <span className="text-black">therapeutic</span> <span className="text-grey">and</span> <span className="text-black">diagnostic</span> <span className="text-grey">agents</span>
          </h4>
        </motion.div>

        {/* Two Column Layout */}
        <div className={styles.section.grid("gap-8")}>
          {/* Left Column - Diagnostics (non-oncology) */}
          <div className={styles.grid.span(4, { sm: 4, md: 6 }, "relative")}>              
            {/* Scrollable content */}
            <div className="h-[600px] overflow-y-auto pr-4 scrollbar-none">
              <div className="flex flex-col gap-8 pb-8">
                {diagnosticCategories.map((category, categoryIdx) => (
                  <div
                    key={`${category.field}-${category.type}`}
                    className="flex flex-col"
                  >
                    {/* Category Header */}
                    <div className="sticky top-0 bg-white z-10 py-4 mb-6" style={{ boxShadow: '0 10px 15px -10px rgba(255, 255, 255, 0.9)' }}>
                      <span className="text-body font-helvetica-now">
                        <span className="text-grey">{category.field} - </span>
                        <span className="text-black font-medium">{category.type}</span>
                      </span>
                    </div>

                    {/* Card list with variants and once:true to prevent re-animation */}
                    <motion.div 
                      className="flex flex-col gap-4"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-100px" }}
                      variants={containerVariants}
                    >
                      {category.items.map((item, itemIdx) => (
                        <motion.div
                          key={itemIdx}
                          className={styles.card.data("hover:border-purple hover:scale-[1.02] transition-all duration-300")}
                          variants={itemVariants}
                        >
                          {/* Top part: Name/Brand + Company */}
                          <div className="flex items-start justify-between mb-2 gap-2">
                            <div className="flex-1 min-w-0 mr-2 truncate">
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
                          <div className={styles.typography.cardBody("text-grey mt-1 truncate")}>
                            {item.indication}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Gradient fade at bottom */}
            <div className="absolute bottom-0 left-0 right-4 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
            
            {/* Scroll indicator */}
            <motion.div 
              className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center"
              animate={{ 
                opacity: [0.4, 0.8, 0.4],
                y: [0, 4, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop"
              }}
            >
              <svg width="20" height="10" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L10 8L19 1" stroke="#86898e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          </div>
          
          {/* Right Column - Oncology (both diagnostic and therapy) */}
          <div className={styles.grid.span(4, { sm: 4, md: 6 }, "relative")}>              
            {/* Scrollable content */}
            <div className="h-[600px] overflow-y-auto pr-4 scrollbar-none">
              <div className="flex flex-col gap-8 pb-8">
                {oncologyCategories.map((category, categoryIdx) => (
                  <div
                    key={`${category.field}-${category.type}`}
                    className="flex flex-col"
                  >
                    {/* Category Header */}
                    <div className="sticky top-0 bg-white z-10 py-4 mb-6" style={{ boxShadow: '0 10px 15px -10px rgba(255, 255, 255, 0.9)' }}>
                      <span className="text-body font-helvetica-now">
                        <span className="text-grey">{category.field} - </span>
                        <span className="text-black font-medium">{category.type}</span>
                      </span>
                    </div>

                    {/* Card list with variants and once:true to prevent re-animation */}
                    <motion.div 
                      className="flex flex-col gap-4"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-100px" }}
                      variants={containerVariants}
                    >
                      {category.items.map((item, itemIdx) => (
                        <motion.div
                          key={itemIdx}
                          className={styles.card.data("hover:border-purple hover:scale-[1.02] transition-all duration-300")}
                          variants={itemVariants}
                        >
                          {/* Top part: Name/Brand + Company */}
                          <div className="flex items-start justify-between mb-2 gap-2">
                            <div className="flex-1 min-w-0 mr-2 truncate">
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
                          <div className={styles.typography.cardBody("text-grey mt-1 truncate")}>
                            {item.indication}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Gradient fade at bottom */}
            <div className="absolute bottom-0 left-0 right-4 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
            
            {/* Scroll indicator */}
            <motion.div 
              className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center"
              animate={{ 
                opacity: [0.4, 0.8, 0.4],
                y: [0, 4, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop"
              }}
            >
              <svg width="20" height="10" viewBox="0 0 20 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L10 8L19 1" stroke="#86898e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RadiopharmaceuticalsSection;