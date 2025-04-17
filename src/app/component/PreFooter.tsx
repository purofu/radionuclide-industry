import React from 'react';

const PreFooter: React.FC = () => {
  return (
    <div className="relative w-screen left-1/2 right-1/2 -mx-[50vw] overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img 
          src="https://framerusercontent.com/images/GFpQMYjEX3SuTD7KQdjRjs7NsDg.png" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
      </div>
      {/* Content container with increased padding top and bottom */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 py-32 md:py-40 lg:py-48">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">
          {/* First column - Main heading */}
          <div>
            <h2 className="text-h2 mb-6">
              <span className="text-white">We are Firm.</span>
              <span className="text-[#AAAAAA]"> We help pharmaceutial and biotech companies evolve into service-driven organizations.</span>
            </h2>
          </div>
          
          {/* Second column - Supporting text */}
          <div>
            <p className="text-body text-[#AAAAAA]">
            As the first consultancy dedicated to accelerating the delivery of advanced therapies at scale, we take an end-to-end approach—aligning technology and operations to ensure a consistent, reliable experience for everyone involved. We build lasting capabilities across teams, systems, and partnerships to support delivery at scale and sustain long-term success.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreFooter;