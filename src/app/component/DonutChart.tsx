// src/app/components/DonutChart.tsx
"use client"; // Required for client-side React components

import React from "react";

// Interfaces
interface DataItem {
  category: "Therapy" | "Diagnosis";
  subcategory: string;
  count: number;
}

interface Totals {
  Therapy: number;
  Diagnosis: number;
}

const DonutChart = () => {
  // Data
  const data: DataItem[] = [
    { category: "Therapy", subcategory: "Oncology", count: 13 },
    { category: "Diagnosis", subcategory: "Oncology", count: 25 },
    { category: "Diagnosis", subcategory: "Cardiovascular", count: 8 },
    { category: "Diagnosis", subcategory: "Nephrotic", count: 4 },
    { category: "Diagnosis", subcategory: "Hepatopulmonary", count: 4 },
    { category: "Diagnosis", subcategory: "Neurodegenerative", count: 11 },
    { category: "Diagnosis", subcategory: "Osteomyelitis", count: 2 },
  ];

  // Calculate totals
  const totals: Totals = {
    Therapy: data
      .filter((d) => d.category === "Therapy")
      .reduce((s, d) => s + d.count, 0),
    Diagnosis: data
      .filter((d) => d.category === "Diagnosis")
      .reduce((s, d) => s + d.count, 0),
  };

  // Colors
  const colors = {
    Therapy: "#EBEEF4", // dark green color from design
    Diagnosis: "#E2DCDC", // gray color from design
  };

  // Sort diagnosis data by count (ascending)
  const diagnosisData = data
    .filter((d) => d.category === "Diagnosis")
    .sort((a, b) => a.count - b.count);

  // Therapy data
  const therapyData = data.filter((d) => d.category === "Therapy");

  // Calculate total count values for proportioning
  const diagnosisTotal = diagnosisData.reduce((sum, d) => sum + d.count, 0);
  const therapyTotal = therapyData.reduce((sum, d) => sum + d.count, 0);
  const grandTotal = diagnosisTotal + therapyTotal;
  
  // Calculate proportional heights
  const diagnosisSectionProportion = diagnosisTotal / grandTotal;
  const therapySectionProportion = therapyTotal / grandTotal;

  return (
    <div className="w-full h-full flex flex-col">
      {/* Graph container */}
      <div className="w-full flex flex-grow">
        {/* Left column - data bars */}
        <div className=" flex flex-col">
          {/* Diagnosis bars */}
          <div className="flex flex-col" style={{ flex: diagnosisSectionProportion }}>
            {diagnosisData.map((item, index) => {
              // Calculate bar height proportional to its value within diagnosis section
              const barProportion = item.count / diagnosisTotal;
              const opacity = 0.5 + (0.5 * index / (diagnosisData.length - 1));
              
              return (
                <div 
                  key={`diagnosis-${item.subcategory}`}
                  className="w-full px-6 py-2.5 flex items-center"
                  style={{ 
                    backgroundColor: `rgba(216, 206, 206, ${opacity})`,
                    flex: barProportion
                  }}
                >
                  <div className="text-per-line text-body-smallleading-7">
                    {item.count} {item.subcategory}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Therapy bars */}
          <div className="flex flex-col" style={{ flex: therapySectionProportion }}>
            {therapyData.map((item) => {
              // Calculate bar height proportional to its value within therapy section
              const barProportion = item.count / therapyTotal;
              
              return (
                <div 
                  key={`therapy-${item.subcategory}`}
                  className=" px-6 py-2.5 flex items-center"
                  style={{ 
                    backgroundColor: colors.Therapy,
                    flex: barProportion
                  }}
                >
                  <div className="text-per-line text-body-small font-bold leading-7">
                    {item.count} Treatment {item.subcategory}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Right column - totals */}
        <div className="flex-1 flex flex-col">
          {/* Diagnosis total */}
          <div 
            className="flex items-center justify-center"
            style={{ 
              backgroundColor: colors.Diagnosis,
              flex: diagnosisSectionProportion
            }}
          >
            <div className="text-per-line text-h1">
              {totals.Diagnosis}
            </div>
          </div>
          
          {/* Therapy total */}
          <div 
            className="flex items-center justify-center"
            style={{ 
              backgroundColor: colors.Therapy,
              flex: therapySectionProportion
            }}
          >
            <div className="text-per-line text-h1 ">
              {totals.Therapy}
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer with title and citation */}
      <div className="flex flex-col items-end px-4 py-2">
        {/* Title with citation */}
        <div className="w-full text-right">
          <span className="text-body font-medium font-['Helvetica_Now_Display'] text-black">
           Number of approved radiopharmaceuticals per therapeutic area
          </span>
          <span 
            className="text-xs font-medium font-['Helvetica_Now_Display'] text-[#0000ff]"
            style={{ verticalAlign: 'super', marginLeft: '2px' }}
          >
            [1]
          </span>
        </div>
      </div>
    </div>
  );
};

export default DonutChart;