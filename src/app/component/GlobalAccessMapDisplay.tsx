"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { GeoPath, GeoPermissibleObjects } from 'd3-geo';
// We'll use GeoJSON directly instead of TopoJSON to avoid the dependency issue
// import { feature } from 'topojson-client';

// Define GeoJSON feature type - compatible with d3-geo types
interface GeoFeature {
  type: "Feature";
  id: string;
  properties: {
    name: string;
    [key: string]: any;
  };
  geometry: GeoPermissibleObjects;
}

interface GeoJSONData {
  type: "FeatureCollection";
  features: GeoFeature[];
}

// Data for both maps
const theranosticsUseData = [
  { country: "DEU", name: "Germany", value: 55, opacity: 1.0 },
  { country: "AUS", name: "Australia", value: 55, opacity: 1.0 },
  { country: "BRA", name: "Brazil", value: 55, opacity: 1.0 },
  { country: "USA", name: "United States", value: 40, opacity: 0.75 },
  { country: "CAN", name: "Canada", value: 40, opacity: 0.75 },
  { country: "JPN", name: "Japan", value: 35, opacity: 0.75 },
  { country: "KOR", name: "South Korea", value: 30, opacity: 0.75 },
  { country: "CHE", name: "Switzerland", value: 30, opacity: 0.75 },
  { country: "AUT", name: "Austria", value: 25, opacity: 0.75 },
  { country: "ZAF", name: "South Africa", value: 20, opacity: 0.75 },
  { country: "SWE", name: "Sweden", value: 20, opacity: 0.75 },
  { country: "NOR", name: "Norway", value: 20, opacity: 0.75 },
  { country: "FIN", name: "Finland", value: 20, opacity: 0.75 },
  { country: "DNK", name: "Denmark", value: 20, opacity: 0.75 },
  { country: "GBR", name: "United Kingdom", value: 10, opacity: 0.5 },
  { country: "FRA", name: "France", value: 8, opacity: 0.5 },
  { country: "ARG", name: "Argentina", value: 7, opacity: 0.5 },
  { country: "IND", name: "India", value: 5, opacity: 0.5 },
  { country: "TUR", name: "Turkey", value: 5, opacity: 0.5 },
  { country: "IRN", name: "Iran", value: 4, opacity: 0.5 },
  { country: "EGY", name: "Egypt", value: 3, opacity: 0.5 },
  { country: "THA", name: "Thailand", value: 3, opacity: 0.5 },
  { country: "IDN", name: "Indonesia", value: 2, opacity: 0.5 },
  { country: "TUN", name: "Tunisia", value: 2, opacity: 0.5 },
  { country: "NGA", name: "Nigeria", value: 1, opacity: 0.5 },
  { country: "MEX", name: "Mexico", value: 1, opacity: 0.5 },
  // Lower access countries with 0.25 opacity
  { country: "RUS", name: "Russia", value: 0, opacity: 0.25 },
  { country: "UKR", name: "Ukraine", value: 0, opacity: 0.25 },
  { country: "POL", name: "Poland", value: 0, opacity: 0.25 },
  { country: "KAZ", name: "Kazakhstan", value: 0, opacity: 0.25 },
  { country: "HND", name: "Honduras", value: 0, opacity: 0.25 },
  { country: "GTM", name: "Guatemala", value: 0, opacity: 0.25 },
  { country: "NIC", name: "Nicaragua", value: 0, opacity: 0.25 },
  // No data countries with 0.05 opacity
  { country: "GRL", name: "Greenland", value: null, opacity: 0.05 },
  { country: "TCD", name: "Chad", value: null, opacity: 0.05 },
  { country: "SSD", name: "South Sudan", value: null, opacity: 0.05 },
];

const eligiblePatientsData = [
  { country: "USA", name: "United States", value: 15, opacity: 1.0 },
  { country: "CAN", name: "Canada", value: 14, opacity: 1.0 },
  { country: "GBR", name: "United Kingdom", value: 13, opacity: 1.0 },
  { country: "DEU", name: "Germany", value: 13, opacity: 1.0 },
  { country: "FRA", name: "France", value: 12, opacity: 1.0 },
  { country: "ITA", name: "Italy", value: 12, opacity: 1.0 },
  { country: "NLD", name: "Netherlands", value: 12, opacity: 1.0 },
  { country: "SWE", name: "Sweden", value: 11, opacity: 1.0 },
  { country: "NOR", name: "Norway", value: 11, opacity: 1.0 },
  { country: "FIN", name: "Finland", value: 11, opacity: 1.0 },
  { country: "DNK", name: "Denmark", value: 11, opacity: 1.0 },
  { country: "ESP", name: "Spain", value: 11, opacity: 1.0 },
  { country: "BRA", name: "Brazil", value: 11, opacity: 1.0 },
  { country: "ARG", name: "Argentina", value: 11, opacity: 1.0 },
  { country: "RUS", name: "Russia", value: 10, opacity: 1.0 },
  { country: "AUS", name: "Australia", value: 12, opacity: 1.0 },
  { country: "JPN", name: "Japan", value: 11, opacity: 1.0 },
  { country: "KOR", name: "South Korea", value: 10, opacity: 1.0 },
  // Medium eligibility countries
  { country: "MEX", name: "Mexico", value: 8, opacity: 0.75 },
  { country: "COL", name: "Colombia", value: 7, opacity: 0.75 },
  { country: "PER", name: "Peru", value: 6, opacity: 0.75 },
  { country: "GRC", name: "Greece", value: 9, opacity: 0.75 },
  { country: "CHN", name: "China", value: 5, opacity: 0.75 },
  { country: "PHL", name: "Philippines", value: 4, opacity: 0.75 },
  { country: "ZAF", name: "South Africa", value: 5, opacity: 0.75 },
  { country: "SAU", name: "Saudi Arabia", value: 7, opacity: 0.75 },
  { country: "KAZ", name: "Kazakhstan", value: 3, opacity: 0.75 },
  // Lower eligibility countries
  { country: "IND", name: "India", value: 1, opacity: 0.5 },
  { country: "VNM", name: "Vietnam", value: 0.8, opacity: 0.5 },
  { country: "PAK", name: "Pakistan", value: 0.7, opacity: 0.5 },
  { country: "BGD", name: "Bangladesh", value: 0.5, opacity: 0.5 },
  { country: "NGA", name: "Nigeria", value: 0.5, opacity: 0.5 },
  { country: "KEN", name: "Kenya", value: 0.4, opacity: 0.5 },
  { country: "EGY", name: "Egypt", value: 0.8, opacity: 0.5 },
  { country: "IDN", name: "Indonesia", value: 0.6, opacity: 0.5 },
  { country: "IRQ", name: "Iraq", value: 0.7, opacity: 0.5 },
  // No data countries
  { country: "ESH", name: "Western Sahara", value: null, opacity: 0.05 },
  { country: "PNG", name: "Papua New Guinea", value: null, opacity: 0.05 },
];

type MapTabType = 'access' | 'eligibility';

const GlobalAccessMapDisplay: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MapTabType>('eligibility');
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!svgRef.current) return;
    
    // Clear any existing content
    d3.select(svgRef.current).selectAll("*").remove();
    
    // Create and render the map
    createMap();
    
  }, [activeTab]);
  
  const createMap = async () => {
    if (!svgRef.current || !mapContainerRef.current) return;
    
    try {
      // Load world map data
      const response = await fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson');
      const worldMapData = await response.json();
      
      if (!worldMapData || !worldMapData.features) {
        console.error('Failed to load world map data');
        return;
      }
      
      // Set up dimensions based on container width
      const containerWidth = mapContainerRef.current.clientWidth;
      const width = containerWidth;
      const height = width * 0.5; // Aspect ratio for world map
      
      // Set up the SVG
      const svg = d3.select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto;");
      
      // Create map projection - Natural Earth projection gives a nice balanced view
      const projection = d3.geoNaturalEarth1()
        .scale(width / 6)
        .translate([width / 2, height / 2]);
      
      // Create path generator
      const pathGenerator = d3.geoPath().projection(projection);
      
      // Get current dataset based on active tab
      const currentData = activeTab === 'access' ? theranosticsUseData : eligiblePatientsData;
      
      // Create lookup map for faster data access
      const dataLookup = new Map();
      currentData.forEach(d => {
        dataLookup.set(d.country, d);
      });
      
      // Function to determine fill opacity based on country code
      const getOpacity = (countryCode) => {
        const data = dataLookup.get(countryCode);
        return data ? data.opacity : 0.05; // Default opacity for countries with no data
      };
      
      // Create a group for the map
      const mapGroup = svg.append("g");
      
      // Render countries
      mapGroup.selectAll("path")
        .data(worldMapData.features)
        .join("path")
        .attr("d", d => pathGenerator(d))
        .attr("fill", "var(--per-background)")
        .attr("stroke", "#fff")
        .attr("stroke-width", 0.5)
        .attr("opacity", d => getOpacity(d.id))
        .on("mouseover", function(event, d) {
          if (!tooltipRef.current) return;
          
          const countryCode = d.id;
          const countryData = dataLookup.get(countryCode);
          
          if (countryData) {
            // Highlight the country
            d3.select(this)
              .transition()
              .duration(200)
              .attr("fill", "var(--per-highlight)");
            
            // Show tooltip
            const tooltip = tooltipRef.current;
            tooltip.style.opacity = "1";
            tooltip.style.left = `${event.pageX + 10}px`;
            tooltip.style.top = `${event.pageY - 28}px`;
            
            // Format the tooltip content
            const valueText = countryData.value === null ? 
              'No data available' : 
              `${countryData.value} per million inhabitants`;
            
            tooltip.innerHTML = `
              <strong>${countryData.name}</strong><br/>
              ${activeTab === 'access' ? 'Annual Use: ' : 'Eligible Patients: '}
              ${valueText}
            `;
          }
        })
        .on("mouseout", function() {
          if (!tooltipRef.current) return;
          
          // Reset country highlight
          d3.select(this)
            .transition()
            .duration(200)
            .attr("fill", "var(--per-background)");
          
          // Hide tooltip
          tooltipRef.current.style.opacity = "0";
        });
      
    } catch (error) {
      console.error('Error creating map:', error);
    }
  };
  
  const handleTabChange = (tab: MapTabType) => {
    setActiveTab(tab);
  };
  
  return (
    <section className="relative w-full bg-white pt-16 pb-16 md:py-24">
      <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-12">
        <div className="col-span-4 sm:col-span-8 md:col-span-12 lg:col-span-12 px-8 md:px-16 lg:px-24">
          
          {/* Section Title */}
          <motion.div
            className="mb-10 md:mb-12 text-left"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h2 className="text-h2 font-helvetica-now text-black">
              Global Access & Eligibility
            </h2>
          </motion.div>
          
          {/* Tabs */}
          <div className="mb-8 border-b border-light-grey">
            <div className="flex">
              <button
                className={`py-3 px-6 font-helvetica-now text-body-small transition-all ${
                  activeTab === 'eligibility' 
                    ? 'text-black border-b-2 border-black font-medium' 
                    : 'text-grey hover:text-black'
                }`}
                onClick={() => handleTabChange('eligibility')}
              >
                Patient Eligibility
              </button>
              <button
                className={`py-3 px-6 font-helvetica-now text-body-small transition-all ${
                  activeTab === 'access' 
                    ? 'text-black border-b-2 border-black font-medium' 
                    : 'text-grey hover:text-black'
                }`}
                onClick={() => handleTabChange('access')}
              >
                Treatment Access
              </button>
            </div>
          </div>
          
          {/* Map Container */}
          <motion.div
            className="relative mb-8"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              transition: { duration: 0.8 }
            }}
            key={activeTab} // This ensures motion resets when tab changes
            ref={mapContainerRef}
          >
            <div className="w-full h-auto overflow-hidden border border-light-grey rounded-lg p-2 bg-white shadow-sm">
              <svg ref={svgRef} className="w-full"></svg>
            </div>
            <div 
              ref={tooltipRef} 
              className="absolute pointer-events-none bg-white p-2 rounded shadow-md border border-light-grey text-body-small font-helvetica-now transition-opacity duration-200 opacity-0 z-10"
              style={{ left: '0px', top: '0px' }}
            ></div>
          </motion.div>
          
          {/* Legend */}
          <div className="mb-8">
            <h3 className="text-h4 font-helvetica-now text-black mb-4">
              {activeTab === 'access' 
                ? 'Annual Use of Theranostics in Prostate Cancer (per million inhabitants)'
                : 'Eligible Patients for [¹⁷⁷Lu]PSMA Therapy (per million inhabitants)'}
            </h3>
            
            <div className="flex flex-wrap gap-4">
              {activeTab === 'access' ? (
                <>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-per-background opacity-100 mr-2 border border-light-grey"></div>
                    <span className="text-body-small font-helvetica-now text-black">{'>'} 50</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-per-background opacity-75 mr-2 border border-light-grey"></div>
                    <span className="text-body-small font-helvetica-now text-black">10.1 - 50</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-per-background opacity-50 mr-2 border border-light-grey"></div>
                    <span className="text-body-small font-helvetica-now text-black">0.1 - 10</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-per-background opacity-25 mr-2 border border-light-grey"></div>
                    <span className="text-body-small font-helvetica-now text-black">0</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-per-background opacity-5 mr-2 border border-light-grey"></div>
                    <span className="text-body-small font-helvetica-now text-black">No data</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-per-background opacity-100 mr-2 border border-light-grey"></div>
                    <span className="text-body-small font-helvetica-now text-black">{'>'} 10.0</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-per-background opacity-75 mr-2 border border-light-grey"></div>
                    <span className="text-body-small font-helvetica-now text-black">1.1 - 10.0</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-per-background opacity-50 mr-2 border border-light-grey"></div>
                    <span className="text-body-small font-helvetica-now text-black">0.1 - 1.0</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-per-background opacity-5 mr-2 border border-light-grey"></div>
                    <span className="text-body-small font-helvetica-now text-black">No data</span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Description */}
          <motion.div 
            className="text-body font-helvetica-now text-grey max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            key={`description-${activeTab}`}
          >
            {activeTab === 'access' ? (
              <p>
                Access to radiopharmaceutical treatments varies dramatically across regions, with significant healthcare infrastructure barriers in many parts of the world. Countries in darker shades have established infrastructure for radiopharmaceutical delivery, while lighter regions face challenges in treatment access and distribution.
              </p>
            ) : (
              <p>
                Patient eligibility for [¹⁷⁷Lu]PSMA therapy depends on several factors including availability of diagnostic capabilities, healthcare system maturity, and regulatory approvals. Regions with darker shades have larger populations that could benefit from these advanced treatments if barriers to access were removed.
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GlobalAccessMapDisplay;
