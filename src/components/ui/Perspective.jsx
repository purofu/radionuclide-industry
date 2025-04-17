import React from 'react';

const Perspective = () => {
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
				The dataset was sourced from ClinicalTrials.gov and processed to filter only interventional studies with industry sponsorship, ensuring the inclusion of trials with a clearly defined therapeutic focus. In the preprocessing stage, text normalization and regex-based extraction were employed specifically on intervention names—rather than titles—to capture radioisotope mentions accurately using a robust synonym mapping. This mapping standardizes various forms of isotope nomenclature, and each isotope is then evaluated based on its established therapeutic or diagnostic classification.
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
				Although potential challenges remain—such as deviations in input formatting, ambiguous sponsor identifiers, or limitations in the static keyword and synonym lists—the comprehensive verification steps embedded in the pipeline offer a robust mechanism for validating data extraction and categorization.
			  </p>
			</div>
		  </div>
		</div>

		{/* Contact Information */}
		<div className="mb-8 md:mb-12 lg:mb-[73px]">
		  <p className="text-h4 font-helvetica-now">
			<span className="text-white">For access to the raw data, including APIs, please contact</span>
			<span className="text-per-text"> info@firm.inc</span>
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
				<p className="text-body font-medium font-helvetica-now text-per-text">
				  Weber, W. A. et al. What is theranostics?. J. Nucl. Med. 64, 669–670 (2023).
				</p>
			  </div>
			  <div className="lg:w-1/2">
				<p className="text-body font-medium font-helvetica-now text-per-text">
				  Weber, W. A. et al. What is theranostics?. J. Nucl. Med. 64, 669–670 (2023).
				</p>
			  </div>
			</div>
		  </div>
		  <div className="flex flex-col gap-3">
			<div className="flex justify-between items-center">
			  <button className="text-per-text text-body font-medium font-helvetica-now">
				Show all
			  </button>
			  <div className="w-4 h-4 bg-per-text transform rotate-180"></div>
			</div>
			<div className="h-px w-full bg-per-line"></div>
		  </div>
		</div>
	  </div>
	</section>
  );
};

export default Perspective; 