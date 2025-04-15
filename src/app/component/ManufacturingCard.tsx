// components/ManufacturingCard.tsx
import React from 'react';

interface ManufacturingCardProps {
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
}

const ManufacturingCard: React.FC<ManufacturingCardProps> = ({ 
  title, 
  description, 
  stats, 
  elementBoxes 
}) => {
  return (
    <div className="w-full h-full px-6 pt-12 pb-8 bg-white rounded outline outline-1 outline-offset-[-1px] outline-[#f0f0f0] flex flex-col justify-between items-start">
      {/* Top section with statistics */}
      <div className="self-stretch inline-flex justify-start items-start gap-8 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="flex-1 justify-start">
            <span className="text-black text-h5 font-medium font-helvetica-now leading-none block">{stat.value}<br/></span>
            <span className="text-black text-body-small font-medium font-helvetica-now leading-none">{stat.label}</span>
          </div>
        ))}
      </div>
      
      {/* Bottom section with title, description, and element boxes */}
      <div className="self-stretch flex flex-col justify-start items-start gap-6">
        <div className="self-stretch flex flex-col justify-start items-start gap-3">
          {/* Title */}
          <div className="self-stretch text-black text-h3 font-bold font-helvetica-now leading-tight">
            {title}
          </div>
          
          {/* Description with formatting for bold parts */}
          <div className="self-stretch">
            {description.split('\n').map((paragraph, i) => {
              // Check if paragraph starts with a number followed by a period (like "1. ")
              const isNumberedPoint = /^\d+\.\s/.test(paragraph);
              
              if (isNumberedPoint) {
                const parts = paragraph.split(/^(\d+\.\s)/);
                if (parts.length >= 2) {
                  return (
                    <p key={i} className="mb-2">
                      <span className="text-black text-body-small font-bold font-helvetica-now leading-snug">
                        {parts[1]}
                      </span>
                      <span className="text-black text-body-small font-medium font-helvetica-now leading-snug">
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
                    <p key={i} className="mb-2">
                      <span className="text-black text-body-small font-bold font-helvetica-now leading-snug">
                        {parts[0]}:
                      </span>
                      <span className="text-black text-body-small font-medium font-helvetica-now leading-snug">
                        {parts.slice(1).join(':')}
                      </span>
                    </p>
                  );
                }
              }
              
              // Regular paragraph
              return (
                <p key={i} className="text-black text-body-small font-medium font-helvetica-now leading-snug mb-2">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>
        
        {/* Element boxes */}
        {elementBoxes && elementBoxes.length > 0 && (
          <div className="inline-flex justify-start items-start gap-1">
            {elementBoxes.map((element, index) => (
              <div 
                key={index}
                className="w-[55.87px] h-[55.87px] relative"
                data-atomic-mass="On" 
                data-element={element.name}
              >
                <div 
                  className="w-[55.87px] h-[55.87px] left-0 top-0 absolute rounded" 
                  style={{ backgroundColor: element.color }}
                />
                <div 
                  className="left-[3.81px] top-[3.81px] absolute justify-start text-[8.89px] font-bold font-['Roboto'] leading-[8.89px]"
                  style={{ color: element.textColor }}
                >
                  {element.number}
                </div>
                <div 
                  className="w-[40.63px] h-[19.68px] left-[7.62px] top-[14.60px] absolute text-center justify-center text-lg font-medium font-['Roboto'] leading-normal"
                  style={{ color: element.textColor }}
                >
                  {element.symbol}
                </div>
                <div 
                  className="w-[45.71px] h-[8.89px] left-[5.08px] top-[34.29px] absolute text-center justify-start text-[6.98px] font-normal font-['Roboto'] leading-[8.89px]"
                  style={{ color: element.textColor }}
                >
                  {element.name}
                </div>
                <div 
                  className="w-[22.86px] h-[5.08px] left-[16.51px] top-[45.71px] absolute text-center justify-center text-[5.08px] font-normal font-['Roboto'] leading-[8.89px]"
                  style={{ color: element.textColor }}
                >
                  {element.mass}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManufacturingCard; 