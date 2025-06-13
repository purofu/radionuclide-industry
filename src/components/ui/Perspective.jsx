import React, { useState } from 'react';

const Perspective = () => {
  const [showAllReferences, setShowAllReferences] = useState(false);

  const allReferences = [
    {
      num: 1,
      text: "Zhang, S., Wang, X., Gao, X. et al. Radiopharmaceuticals and their applications in medicine. Sig Transduct Target Ther 10, 1 (2025).",
      url: "https://doi.org/10.1038/s41392-024-02041-6"
    },
    {
      num: 2,
      text: "Greg Kaser (2024) The World Nuclear Supply Chain – An Overview",
      url: "https://www.oecd-nea.org/upload/docs/application/pdf/2020-07/wpne_workshop_2._1_the_world_nuclear_supply_chain_an_overview.pdf"
    },
    {
      num: 3,
      text: "Herrmann, K., et al. (2020). \"Radiotheranostics: A roadmap for future development.\" The Lancet Oncology, 21(3), e146-e156.",
      url: "https://doi.org/10.1016/S1470-2045(19)30757-9"
    },
    {
      num: 4,
      text: "World Nuclear Association. Radioisotopes in Medicine Report.",
      url: "https://world-nuclear.org/information-library/non-power-nuclear-applications/radioisotopes-research/radioisotopes-in-medicine"
    },
    {
      num: 5,
      text: "Young JD, Jauregui-Osoro M, Wong WL, Cooper MS, Cook G, Barrington SF, et al. An overview of nuclear medicine research in the UK and the landscape for clinical adoption. Nucl Med Commun",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8584216/"
    },
    {
      num: 6,
      text: "Yan S, Na J, Liu X, Wu P. Different Targeting Ligands-Mediated Drug Delivery Systems for Tumor Therapy. Pharmaceutics. 2024 Feb 7;16(2):248.",
      url: "https://doi.org/10.3390/pharmaceutics16020248"
    },
    {
      num: 7,
      text: "International Atomic Energy Agency, Guidance for Preclinical Studies with Radiopharmaceuticals",
      url: "https://www-pub.iaea.org/MTCD/publications/PDF/PUB2031_web.pdf"
    },
    {
      num: 8,
      text: "Druggability of Targets for Diagnostic Radiopharmaceuticals Xinyu Wang, Chongyang Chen, Junjie Yan, Yuping Xu, Donghui Pan, Lizhen Wang, and Min Yang ACS Pharmacology & Translational Science 2023 6 (8), 1107-1119",
      url: "https://doi.org/10.1021/acsptsci.3c00081"
    },
    {
      num: 9,
      text: "Nelson BJB, Krol V, Bansal A, Andersson JD, Wuest F, Pandey MK. Aspects and prospects of preclinical theranostic radiopharmaceutical development. Theranostics 2024; 14(17):6446-6470.",
      url: "https://www.thno.org/v14p6446.htm"
    },
    {
      num: 10,
      text: "Price EW, Orvig C. Matching chelators to radiometals for radiopharmaceuticals. Chem Soc Rev. 2014 Jan 7;43(1):260-90.",
      url: "https://doi.org/10.1039/c3cs60304k"
    },
    {
      num: 11,
      text: "Sneddon D, Cornelissen B. Emerging chelators for nuclear imaging. Curr Opin Chem Biol. 2021 Aug;63:152-162.",
      url: "https://doi.org/10.1016/j.cbpa.2021.03.001"
    },
    {
      num: 12,
      text: "Baum, R. P., & Rösch, F. (Eds.). (2013). Theranostics, Gallium-68, and Other Radionuclides. Springer Berlin, Heidelberg.",
      url: "https://doi.org/10.1007/978-3-642-27994-2"
    },
    {
      num: 13,
      text: "Kratochwil, C., Giesel, F. L., & Haberkorn, U. (2017). A brief status report on the use of PSMA-ligands for diagnostics and therapy. Molecules, 22(4), 543.",
      url: "https://doi.org/10.3390/molecules22040543"
    },
    {
      num: 14,
      text: "NHS Specialist Pharmacy Service. (2019, September). A Standard Protocol for Deriving and Assessment of Stability Part 1: Pharmacy-prepared small molecule products (5th ed.).",
      url: "https://www.sps.nhs.uk/wp-content/uploads/2013/12/Stability-part-1-small-molecules-5th-Ed-Sept-19.pdf"
    },
    {
      num: 15,
      text: "Fani M, Maecke HR. Radiopharmaceutical development of radiolabelled peptides. Eur J Nucl Med Mol Imaging. 2012 Feb;39 Suppl 1:S11-30.",
      url: "https://doi.org/10.1007/s00259-011-2001-z"
    },
    {
      num: 16,
      text: "Decristoforo, C. (2012). The art and science of kit formulation in diagnostic nuclear medicine. Quarterly Journal of Nuclear Medicine and Molecular Imaging, 56(3), 223–235.",
      url: "https://pubmed.ncbi.nlm.nih.gov/22617329/"
    },
    {
      num: 17,
      text: "Walsh, G. (2018). Biopharmaceutical benchmarks 2018. Nature Biotechnology, 36(12), 1136–1145.",
      url: "https://doi.org/10.1038/nbt.4305"
    },
    {
      num: 18,
      text: "Shukla, A. A., & Thömmes, J. (2010). Recent advances in large-scale production of monoclonal antibodies and related proteins. Trends in Biotechnology, 28(5), 253–261.",
      url: "https://doi.org/10.1016/j.tibtech.2010.02.001"
    },
    {
      num: 19,
      text: "Wang, W., Singh, S., Zeng, D. L., King, K., & Nema, S. (2007). Antibody structure, instability, and formulation. Journal of Pharmaceutical Sciences, 96(1), 1–26.",
      url: "https://doi.org/10.1002/jps.20727"
    },
    {
      num: 20,
      text: "National Academies of Sciences, Engineering, and Medicine. (2016). Molybdenum-99 for Medical Imaging. The National Academies Press.",
      url: "https://doi.org/10.17226/23563"
    },
    {
      num: 21,
      text: "World Nuclear Association. (2023, August). Research Reactors. Retrieved June 10, 2025",
      url: "https://world-nuclear.org/information-library/non-power-nuclear-applications/radioisotopes-research/research-reactors"
    },
    {
      num: 22,
      text: "Wang Y, Chen D, Augusto RDS, Liang J, Qin Z, Liu J, Liu Z. Production Review of Accelerator-Based Medical Isotopes. Molecules. 2022 Aug 19;27(16):5294.",
      url: "https://doi.org/10.3390/molecules27165294"
    },
    {
      num: 23,
      text: "World Nuclear Association. (2024, May). Radioisotopes in Medicine. Retrieved June 10, 2025",
      url: "https://world-nuclear.org/information-library/non-power-nuclear-applications/radioisotopes-research/radioisotopes-in-medicine"
    },
    {
      num: 24,
      text: "Knapp FF Jr, Mirzadeh S. The continuing important role of radionuclide generator systems for nuclear medicine. Eur J Nucl Med. 1994 Oct;21(10):1151-65.",
      url: "https://doi.org/10.1007/BF00181073"
    },
    {
      num: 25,
      text: "Feng, Y.; Shao, Y.; Li, Z.; Luo, M.; Xu, D.; Ma, L. Research Progress on Major Medical Radionuclide Generators. Processes 2025, 13, 521.",
      url: "https://doi.org/10.3390/pr13020521"
    },
    {
      num: 26,
      text: "Casey, B. (2023, July 18). How nuclear fusion is revolutionizing medical isotope production. ITN Online.",
      url: "https://www.itnonline.com/article/how-nuclear-fusion-revolutionizing-medical-isotope-production"
    },
    {
      num: 27,
      text: "Clery, D. (2023, June 28). This CEO aims to revolutionize cancer-killing isotope production with fusion power. Science.",
      url: "https://www.science.org/content/article/ceo-aims-revolutionize-cancer-killing-isotope-production-fusion-power"
    },
    {
      num: 28,
      text: "Henderson, S. (2023, December 11). Viewpoint: reactors and accelerators join forces. CERN Courier.",
      url: "https://cerncourier.com/a/viewpoint-reactors-and-accelerators-join-forces/"
    },
    {
      num: 29,
      text: "Using Linear Accelerators to Produce Medical Isotopes without Highly Enriched Uranium.",
      url: "https://www.belfercenter.org/sites/default/files/pantheon_files/files/publication/smashingatomsforpeace.pdf"
    }
  ];

  const visibleReferences = showAllReferences ? allReferences : allReferences.slice(0, 5);

  return (
	<section className="relative w-screen left-1/2 right-1/2 -mx-[50vw] bg-per-background text-white overflow-hidden z-0">
	  {/* Main content container with responsive padding */}
	  <div className="container mx-auto px-4 md:px-6 lg:px-8 pt-12 md:pt-16 lg:pt-24 pb-8 md:pb-12 lg:pb-16">
	   

	   
	   

		{/* Methodology Section Header */}
		<div className="flex flex-col gap-8 mb-8 md:mb-12 lg:mb-[73px]">
		  <h2 className="text-h2 font-helvetica-now">
			Methodology and references
		  </h2>
		  <div className="h-px w-full bg-per-line"></div>
		</div>

		{/* Clinical Trial Data Section */}
		<div className="flex flex-col gap-6 mb-8 md:mb-12 lg:mb-[73px]">
		  <h3 className="text-h5 font-helvetica-now text-per-text font-bold">
			Clinical trial data collection process
		  </h3>
		  <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
			<div className="lg:w-1/2">
			  <p className="text-body font-medium font-helvetica-now mb-4">
				The dataset was sourced from ClinicalTrials.gov and processed to filter only interventional studies with industry sponsorship, ensuring the inclusion of trials with a clearly defined therapeutic focus. In the preprocessing stage, text normalization and regex-based extraction were employed specifically on intervention names, rather than titles, to capture radioisotope mentions accurately using a robust synonym mapping. This mapping standardizes various forms of isotope nomenclature, and each isotope is then evaluated based on its established therapeutic or diagnostic classification.
			  </p>
			  <p className="text-body font-medium font-helvetica-now">
				Verification is achieved through a dual approach: a correctness check that randomly samples studies to display key details (e.g., NCT IDs, phases, interventions, and sponsors) for manual review, and a comparison process where aggregated statistics are matched against a pre-defined manual pipeline.
			  </p>
			</div>
			<div className="lg:w-1/2">
			  <p className="text-body font-medium font-helvetica-now mb-4">
				Therapeutic intent is further verified by cross-referencing recognized clinical trial phases, scanning for an extensive list of therapeutic-related keywords in both titles and intervention details, and subsequently flagging studies that fulfill any of these criteria. The pipeline also aggregates statistical summaries (such as the distribution of trial phases, isotope frequency, and sponsor counts), and visualization data is built to stratify the results by phase, company, and clinical application.
			  </p>
			  <p className="text-body font-medium font-helvetica-now">
				Although potential challenges remain, such as deviations in input formatting, ambiguous sponsor identifiers, or limitations in the static keyword and synonym liststhe comprehensive verification steps embedded in the pipeline offer a robust mechanism for validating data extraction and categorization.
			  </p>
			</div>
		  </div>
		</div>

		{/* Contact Information */}
		<div className="mb-8 md:mb-12 lg:mb-[73px]">
		  <p className="text-h4 font-helvetica-now">
			<span className="text-white">For access to the raw data, including APIs, please contact</span>
			<a href="mailto:info@firm.inc" className="text-per-text hover:underline"> info@firm.inc</a>
		  </p>
		</div>

		{/* References Section */}
		<div className="flex flex-col gap-6">
		  <div className="flex flex-col gap-6">
			<h3 className="text-h3 font-helvetica-now text-per-text">
			  References
			</h3>
			<div className="flex flex-col lg:flex-row gap-8 lg:gap-[73px]">
			  <div className="lg:w-1/2">
                {visibleReferences.slice(0, Math.ceil(visibleReferences.length / 2)).map((ref) => (
                  <p key={ref.num} className="text-body-small font-medium font-helvetica-now text-per-text mb-4">
                    {ref.num}. <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-per-text hover:underline text-body-small">{ref.text}</a>
                  </p>
                ))}
			  </div>
			  <div className="lg:w-1/2">
                {visibleReferences.slice(Math.ceil(visibleReferences.length / 2)).map((ref) => (
                  <p key={ref.num} className="text-body-small font-medium font-helvetica-now text-per-text mb-4">
                    {ref.num}. <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-per-text hover:underline text-body-small">{ref.text}</a>
                  </p>
                ))}
			  </div>
			</div>
			
		  </div>
		  <div className="flex flex-col gap-3">
			<div className="flex justify-between items-center">
			  <button 
                onClick={() => setShowAllReferences(!showAllReferences)}
                className="text-per-text text-body font-medium font-helvetica-now hover:text-white transition-colors"
              >
				{showAllReferences ? 'Show less' : 'Show all'}
			  </button>
			  <div className={`w-4 h-4 bg-per-text transform transition-transform ${showAllReferences ? 'rotate-0' : 'rotate-180'}`} 
                   style={{
                     clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                   }}></div>
			</div>
			<div className="h-px w-full bg-per-line"></div>
		  </div>
		</div>
	  </div>
	</section>
  );
};

export default Perspective; 