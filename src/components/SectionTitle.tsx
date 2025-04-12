import React from 'react';

interface SectionTitleProps {
  number: string;
  title: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ number, title }) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-12">
        <div className="col-span-4 sm:col-span-8 md:col-span-12 lg:col-span-12 px-8 md:px-16 lg:px-24">
          <div className="my-8">
            {/* Large number with 128px size and light gray color */}
            <div 
              className="text-light-grey" 
              style={{ 
                fontSize: '164px', 
                lineHeight: '1', 
                fontWeight: '400',
                fontFamily: 'var(--font-helvetica-now)'
              }}
            >
              {number}
            </div>
            
            {/* Title in black as h2 */}
            <h2 className="text-h2 font-helvetica-now text-black mt-4">
              {title}
            </h2>
          </div>
        </div>
      </div>
      
      {/* Full bleed line - This goes outside the grid to ensure it spans the full width */}
      <div className="w-screen border-t border-light-grey -mx-[50vw] relative left-1/2 right-1/2" />
    </div>
  );
};

export default SectionTitle; 