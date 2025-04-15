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

      {/* Content container */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* First column - Main heading */}
          <div>
            <h2 className="text-h2 mb-6">
              <span className="text-white">We are Firm.</span>
              <span className="text-[#AAAAAA]"> The first consultancy dedicated to accelerating the delivery of advanced therapies.</span>
            </h2>
          </div>
          
          {/* Second column - Supporting text */}
          <div>
            <p className="text-body text-[#AAAAAA]">
              We help pharmaceutical companies realize their investments in advanced therapies by launching customer and patient-centered services, and building the capabilities required to deliver them at scale.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreFooter; 