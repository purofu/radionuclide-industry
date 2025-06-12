import React, { useState } from "react";

const UpdatesSection = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  return (
    <section
      id="updates"
      className="relative w-screen left-1/2 right-1/2 -mx-[50vw] bg-white text-grey-900"
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* copy */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <p className="text-h4 font-helvetica-now">
              There's more to explore. <span className="text-grey">We'll be adding new content regularly,
              including deep dives into regulations and market access.</span>
            </p>
          </div>

          {/* numbered list */}
          <div className="lg:col-span-1 flex flex-col gap-6">
          </div>
          {/* subscribe */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <p className="text-h4 font-helvetica-now">
              Sign up to be notified of future updates.
            </p>
            <button 
              onClick={openPopup}
              className="w-full py-3.5 px-6 md:px-[50px] bg-grey-900 text-white rounded hover:bg-grey-800 transition-colors"
            >
              Subscribe to future updates
            </button>
          </div>
        </div>
      </div>

      {/* Typeform Popup Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-10 p-4">
          <div className="relative w-full max-w-5xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            {/* Close button */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-grey-100 hover:bg-grey-200 text-grey-600 hover:text-grey-900 rounded-full transition-all duration-200 hover:scale-105"
              aria-label="Close popup"
            >
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            {/* Typeform iframe */}
            <iframe
              src="https://radionuclide.typeform.com/to/m2zFktS0"
              className="w-full h-full border-0"
              title="Subscribe to Updates"
              allow="camera; microphone; autoplay; encrypted-media; fullscreen"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default UpdatesSection;