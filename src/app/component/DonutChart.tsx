// src/app/components/DonutChart.tsx
"use client"; // Required for client-side React components

import React, { useState, useRef, useEffect } from "react";
import * as d3 from "d3";
import { PieArcDatum } from "d3-shape";

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

interface InnerDataItem {
  key: "Therapy" | "Diagnosis";
  value: number;
  color: string;
}

const DonutChart = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hasAnimated, setHasAnimated] = useState(false);

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
    Therapy: "#0000ff", // primary-blue
    Diagnosis: "#6f608f", // purple
  };

  // Responsive sizing
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateDimensions = () => {
      const container = containerRef.current;
      if (!container) return;
      
      const rect = container.getBoundingClientRect();
      setDimensions({
        width: Math.max(rect.width, 300),
        height: Math.max(rect.height, 350)
      });
    };
    
    // Initial update
    updateDimensions();
    
    // Set up ResizeObserver for better responsiveness
    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(containerRef.current);
    
    // Set animation flag
    if (!hasAnimated) {
      setTimeout(() => setHasAnimated(true), 300);
    }
    
    return () => {
      if (containerRef.current) {
        resizeObserver.disconnect();
      }
    };
  }, [hasAnimated]);

  // D3 Chart Drawing
  useEffect(() => {
    if (dimensions.width <= 0 || dimensions.height <= 0 || !svgRef.current) return;

    // Select SVG and clear previous content
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Get dimensions
    const width = dimensions.width;
    const height = dimensions.height;
    
    // Set proper margins for right alignment
    const margin = {
      top: 5,
      right: 15,
      bottom: 15,
      left: 15
    };
    
    // Calculate available space for chart
    const availableWidth = width - margin.left - margin.right;
    const availableHeight = height - margin.top - margin.bottom;
    
    // Calculate radius based on available space
    const effectiveRadius = Math.min(availableWidth / 2, availableHeight / 2);
    
    // Center the chart within the available space
    const chartCenterX = margin.left + availableWidth / 2;
    const chartCenterY = margin.top + availableHeight / 2 + 25;
    
    // Configure SVG
    svg.attr("width", width)
       .attr("height", height)
       .attr("viewBox", `0 0 ${width} ${height}`)
       .attr("preserveAspectRatio", "xMidYMid meet"); // Use xMidYMid for centered content
    
    // Radius calculations
    const outerRadius = effectiveRadius;
    const innerRadius = outerRadius * 0.4;
    const middleRadius = outerRadius * 0.68;
    const gapSize = 2;
    
    // Create the pie data generators with proper typing
    const innerPie = d3.pie<InnerDataItem>()
      .sort(null)
      .value(d => d.value);
      
    const outerPie = d3.pie<DataItem>()
      .sort(null)
      .value(d => d.count);
    
    // Arc generators with proper typing
    const innerArc = d3.arc<PieArcDatum<InnerDataItem>>()
      .innerRadius(innerRadius)
      .outerRadius(middleRadius - gapSize / 2);
      
    const outerArc = d3.arc<PieArcDatum<DataItem>>()
      .innerRadius(middleRadius + gapSize / 2)
      .outerRadius(outerRadius);
    
    // Prepare data for inner ring
    const innerRingData: InnerDataItem[] = [
      { key: "Therapy", value: totals.Therapy, color: colors.Therapy },
      { key: "Diagnosis", value: totals.Diagnosis, color: colors.Diagnosis }
    ];
    
    const innerData = innerPie(innerRingData);
    
    // Prepare data for outer ring
    const therapySegments = data
      .filter(d => d.category === "Therapy")
      .sort((a, b) => b.count - a.count);
      
    const diagnosisSegments = data
      .filter(d => d.category === "Diagnosis")
      .sort((a, b) => b.count - a.count);
      
    // Combined data for outer ring
    const outerRingData = [...therapySegments, ...diagnosisSegments];
    const outerData = outerPie(outerRingData);
    
    // Create main chart group with proper positioning
    const chartGroup = svg.append("g")
      .attr("transform", `translate(${chartCenterX}, ${chartCenterY})`);
    
    // Draw inner ring
    chartGroup.selectAll(".inner-arc")
      .data(innerData)
      .enter()
      .append("path")
      .attr("class", "inner-arc")
      .attr("d", d => innerArc(d) || "")
      .attr("fill", d => d.data.color)
      .style("opacity", hasAnimated ? 1 : 0)
      .transition()
      .duration(hasAnimated ? 0 : 800)
      .delay((_, i) => hasAnimated ? 0 : 300 + i * 150)
      .style("opacity", 1);
    
    // Draw outer ring
    chartGroup.selectAll(".outer-arc")
      .data(outerData)
      .enter()
      .append("path")
      .attr("class", "outer-arc")
      .attr("d", d => outerArc(d) || "")
      .attr("fill", (d) => {
        const item = d.data;
        if (item.category === "Therapy") return colors.Therapy;
        
        // For diagnosis segments, apply opacity
        const diagIndex = diagnosisSegments.findIndex(
          seg => seg.subcategory === item.subcategory
        );
        
        if (diagIndex === 0) return colors.Diagnosis;
        
        // Create color with opacity
        const color = d3.color(colors.Diagnosis);
        if (!color) return colors.Diagnosis;
        
        const opacityPercent = Math.max(50, 100 - (diagIndex * 10)) / 100;
        color.opacity = opacityPercent;
        return color.toString();
      })
      .style("opacity", hasAnimated ? 1 : 0)
      .transition()
      .duration(hasAnimated ? 0 : 800)
      .delay((_, i) => hasAnimated ? 0 : 600 + i * 100)
      .style("opacity", 1);
    
    // Add inner ring labels (numbers)
    chartGroup.selectAll(".inner-label")
      .data(innerData)
      .enter()
      .append("text")
      .attr("class", "inner-label")
      .attr("transform", d => {
        const centroid = innerArc.centroid(d);
        return `translate(${centroid[0]}, ${centroid[1]})`;
      })
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(d => d.data.value)
      .attr("fill", "#ffffff")
      .style("font-size", `${Math.max(16, Math.min(effectiveRadius * 0.12, 32))}px`)
      .style("font-weight", "700")
      .style("font-family", "'Helvetica Now Display', sans-serif")
      .style("opacity", hasAnimated ? 1 : 0)
      .transition()
      .duration(hasAnimated ? 0 : 600)
      .delay((_, i) => hasAnimated ? 0 : 900 + i * 150)
      .style("opacity", 1);
    
    // Add outer ring labels (numbers)
    chartGroup.selectAll(".outer-label")
      .data(outerData)
      .enter()
      .append("text")
      .attr("class", "outer-label")
      .attr("transform", d => {
        const centroid = outerArc.centroid(d);
        return `translate(${centroid[0]}, ${centroid[1]})`;
      })
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(d => d.data.count)
      .attr("fill", "#ffffff")
      .style("font-size", `${Math.max(14, Math.min(effectiveRadius * 0.09, 28))}px`)
      .style("font-weight", "700")
      .style("font-family", "'Helvetica Now Display', sans-serif")
      .style("opacity", hasAnimated ? 1 : 0)
      .transition()
      .duration(hasAnimated ? 0 : 600)
      .delay((_, i) => hasAnimated ? 0 : 1000 + i * 100)
      .style("opacity", 1);
    
    // Calculate and draw subcategory labels with better positioning
    const labelPadding = 10;
    
    // Draw subcategory labels with polylines - improved version
    const drawSubcategoryLabels = () => {
      // Create a container for labels that's clipped to the SVG bounds
      const labelGroup = chartGroup.append("g")
        .attr("class", "label-group");
      
      // Pre-measure text widths
      const textWidths = new Map();
      
      outerData.forEach((d, i) => {
        const tempText = labelGroup.append("text")
          .attr("class", "temp-text")
          .text(d.data.subcategory)
          .style("font-size", `${Math.max(12, Math.min(effectiveRadius * 0.08, 20))}px`);
          
        textWidths.set(i, tempText.node()?.getBBox().width || 0);
        tempText.remove();
      });
      
      // Determine available space on each side from the center
      const spaceOnEachSide = availableWidth / 2;
      
      // Draw the labels and polylines
      outerData.forEach((d, i) => {
        // Calculate position based on arc angle
        const angle = (d.startAngle + d.endAngle) / 2;
        const adjustedAngle = angle - Math.PI / 2;
        const cosAngle = Math.cos(adjustedAngle);
        const sinAngle = Math.sin(adjustedAngle);
        
        // Start at outer edge of arc
        const start = [
          cosAngle * (outerRadius + 2),
          sinAngle * (outerRadius + 2)
        ];
        
        // Determine which side of the chart this label belongs to
        const isRightSide = cosAngle >= 0;
        const textWidth = textWidths.get(i) || 0;
        
        // Calculate outer radius for the polyline, respecting boundaries
        let polylineOuterRadius;
        const basePolylineExtension = outerRadius + Math.max(15, effectiveRadius * 0.1); // Smaller min/factor
        
        // Constrain by available space on the relevant side
        const maxExtentBasedOnSpace = spaceOnEachSide - textWidth - 2 * labelPadding;
        polylineOuterRadius = Math.min(basePolylineExtension, maxExtentBasedOnSpace);

        // Ensure polylineOuterRadius is not less than the chart's outer radius + a small gap
        polylineOuterRadius = Math.max(outerRadius + 5, polylineOuterRadius); 

        // Calculate radial endpoint with proper bounds
        const radialEnd = [
          cosAngle * polylineOuterRadius,
          sinAngle * polylineOuterRadius
        ];
        
        // Calculate horizontal line length based on side
        const polylineHorizontalLength = Math.max(15, effectiveRadius * 0.08); // Smaller min/factor
        
        const horizontalEnd = [
          radialEnd[0] + (isRightSide ? polylineHorizontalLength : -polylineHorizontalLength),
          radialEnd[1]
        ];
        
        // Get fill color with proper opacity
        const fillColor = d.data.category === "Therapy" ? 
          colors.Therapy : 
          (() => {
            const diagIndex = diagnosisSegments.findIndex(
              seg => seg.subcategory === d.data.subcategory
            );
            
            if (diagIndex === 0) return colors.Diagnosis;
            
            const color = d3.color(colors.Diagnosis);
            if (!color) return colors.Diagnosis;
            
            const opacityPercent = Math.max(50, 100 - (diagIndex * 10)) / 100;
            color.opacity = opacityPercent;
            return color.toString();
          })();
        
        // Draw polyline
        const polyline = labelGroup.append("polyline")
          .attr("points", `${start[0]},${start[1]} ${radialEnd[0]},${radialEnd[1]} ${horizontalEnd[0]},${horizontalEnd[1]}`)
          .attr("stroke", fillColor)
          .attr("stroke-width", 1.5)
          .attr("fill", "none");
          
        if (!hasAnimated) {
          polyline.style("opacity", 0)
            .transition()
            .duration(400)
            .delay(1200 + i * 100)
            .style("opacity", 1);
        }
        
        // Draw text label with proper text-anchor
        const textX = horizontalEnd[0] + (isRightSide ? labelPadding : -labelPadding);
        
        const text = labelGroup.append("text")
          .attr("x", textX)
          .attr("y", horizontalEnd[1])
          .attr("dy", "0.35em")
          .attr("text-anchor", isRightSide ? "start" : "end")
          .text(d.data.subcategory)
          .attr("fill", fillColor)
          .style("font-size", `${Math.max(12, Math.min(effectiveRadius * 0.08, 20))}px`)
          .style("font-family", "'Helvetica Now Display', sans-serif");
          
        if (!hasAnimated) {
          text.style("opacity", 0)
            .transition()
            .duration(400)
            .delay(1300 + i * 100)
            .style("opacity", 1);
        }
      });
    };
    
    // Execute label drawing
    if (hasAnimated) {
      drawSubcategoryLabels();
    } else {
      setTimeout(drawSubcategoryLabels, 1000);
    }
    
    // Add center category labels
    const centerLabelSize = Math.max(16, Math.min(effectiveRadius * 0.1, 28));
    const centerVerticalOffset = Math.max(20, effectiveRadius * 0.12);
    
    // Therapy label
    const therapyLabel = chartGroup.append("text")
      .attr("x", 0)
      .attr("y", -centerVerticalOffset)
      .attr("text-anchor", "middle")
      .attr("fill", colors.Therapy)
      .style("font-size", `${centerLabelSize}px`)
      .style("font-weight", "700")
      .style("font-family", "'Helvetica Now Display', sans-serif")
      .text("Therapy");
      
    // Diagnosis label
    const diagnosisLabel = chartGroup.append("text")
      .attr("x", 0)
      .attr("y", centerVerticalOffset)
      .attr("text-anchor", "middle")
      .attr("fill", colors.Diagnosis)
      .style("font-size", `${centerLabelSize}px`)
      .style("font-weight", "700")
      .style("font-family", "'Helvetica Now Display', sans-serif")
      .text("Diagnosis");
      
    // Animate center labels if needed
    if (!hasAnimated) {
      therapyLabel.style("opacity", 0)
        .transition()
        .duration(600)
        .delay(1500)
        .style("opacity", 1);
        
      diagnosisLabel.style("opacity", 0)
        .transition()
        .duration(600)
        .delay(1600)
        .style("opacity", 1);
    }
    
  }, [dimensions, hasAnimated, data, totals, colors]);

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col">
      {/* Main chart area - make it grow */}
      <div className="w-full relative flex-grow"> {/* Removed fixed height, added flex-grow */}
        <svg
          ref={svgRef}
          className="absolute inset-0 w-full h-full overflow-visible"
          preserveAspectRatio="xMidYMid meet" // Use xMidYMid for centered content
        ></svg>
      </div>
      
      {/* Footer with title and legend - aligned right as a block */}
      <div className="flex flex-col items-end mt-4 px-4"> {/* Align content right, add top margin & padding */}
        {/* Legend - MOVED UP */}
        <div className="w-full flex flex-wrap justify-center sm:justify-end space-x-4 sm:space-x-8 md:space-x-12 pt-2"> {/* Removed mt-0.5, Added pt-2 */}
          <div className="flex items-center mb-1 sm:mb-0"> {/* Add bottom margin for wrapped items */}
            <div 
              style={{ 
                width: '10px', 
                height: '10px', 
                backgroundColor: colors.Therapy, 
                marginRight: '4px' 
              }} 
            />
            <span className="text-body-small font-helvetica-now text-black">
              Therapy
            </span>
          </div>
          <div className="flex items-center mb-1 sm:mb-0"> {/* Add bottom margin for wrapped items */}
            <div 
              style={{ 
                width: '10px', 
                height: '10px', 
                backgroundColor: colors.Diagnosis, 
                marginRight: '4px' 
              }} 
            />
            <span className="text-body-small font-helvetica-now text-black">
              Diagnosis
            </span>
          </div>
        </div>

        {/* Title with citation - MOVED DOWN */}
        <div className="w-full text-right mt-1"> {/* Added mt-1 */}
          <span className="text-body font-helvetica-now text-black">
            Approved therapeutic and diagnostic agents divided by type of diseases
          </span>
          <span 
            className="text-body-small font-helvetica-now text-primary-blue"
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