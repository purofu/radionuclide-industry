// src/app/components/DonutChart.tsx
"use client"; // Required for hooks and D3 manipulation

// Import useCallback along with other hooks
import React, { useState, useRef, useEffect, useCallback } from "react";
import * as d3 from "d3";
import type { PieArcDatum } from "d3-shape";
import { motion } from "framer-motion";
import styles from "@/theme/components"; // Import component styles

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
interface ColorMap {
  Therapy: string;
  Diagnosis: string;
}
interface InnerDataItem {
  key: "Therapy" | "Diagnosis";
  value: number;
}

const DonutChart = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hasAnimated, setHasAnimated] = useState(false); // Track if animation has run

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

   const totals: Totals = {
     Therapy: data
       .filter((d) => d.category === "Therapy")
       .reduce((s, d) => s + d.count, 0),
     Diagnosis: data
       .filter((d) => d.category === "Diagnosis")
       .reduce((s, d) => s + d.count, 0),
   };

  // Use hardcoded hex colors instead of CSS variables for D3 compatibility
  const colorMap: ColorMap = {
    Therapy: "#0000ff", // primary-blue - hardcoded instead of CSS variable 
    Diagnosis: "#6f608f" // purple - hardcoded instead of CSS variable
  };

  // Improved subcategory color function to use opacity percentages for diagnoses
  const getSubcategoryColor = useCallback((
    category: "Therapy" | "Diagnosis",
    subcategory: string,
    index: number,
  ): string => {
    // Base colors hardcoded instead of using CSS variables
    const baseColor = category === "Therapy" ? 
      "#0000ff" : // primary-blue hardcoded hex
      "#6f608f"; // purple hardcoded hex
    
    // Always use full color for Therapy
    if (category === "Therapy") return baseColor;
    
    // For Diagnosis subcategories, apply opacity based on index
    // Using d3.color for better color manipulation
    const color = d3.color(baseColor);
    if (!color) return baseColor;
    
    // Oncology (index 0) gets 100%, then descending in 10% increments with minimum 50%
    const opacityPercent = Math.max(50, 100 - (index * 10)) / 100;
    color.opacity = opacityPercent;
    
    return color.toString();
  }, []);

  // Enhanced responsive sizing useEffect - only set animation flag once
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        
        // Make chart more responsive to container size
        const parentWidth = container.offsetWidth;
        const parentHeight = container.offsetHeight || parentWidth;
        
        const effectiveWidth = Math.max(parentWidth, 300);
        // Add more height to accommodate title and legends
        const effectiveHeight = Math.max(
          Math.min(parentWidth, parentHeight),
          400
        );
        
        setDimensions({ width: effectiveWidth, height: effectiveHeight });
      }
    };
    
    // Initial update and event listener
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    
    // Only set animated flag if it hasn't been set before
    if (!hasAnimated) {
      setTimeout(() => setHasAnimated(true), 100);
    }
    
    return () => window.removeEventListener("resize", updateDimensions);
  }, [hasAnimated]);

  // Improved scaling function for better responsiveness
  const getScaledValue = useCallback((value: number): number => {
      const baseWidth = 768; // Base width for scaling
      const scale = Math.max(0.7, dimensions.width / baseWidth); // Increased minimum scale
      return value * scale;
  }, [dimensions.width]);

  // D3 Drawing Effect with improved numbers and labels
  useEffect(() => {
    if (dimensions.width <= 0 || dimensions.height <= 0 || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = dimensions.width;
    const height = dimensions.height;
    const margin = getScaledValue(40); // Further increased margin for better spacing
    const effectiveRadius = Math.min(width, height - getScaledValue(100)) / 2 - margin; // Reduced to make room for title and legend

    if (effectiveRadius <= 0) return;

    const outerRadius = effectiveRadius;
    const innerRadius = outerRadius * (100 / 250);
    const middleRadius = outerRadius * (170 / 250);
    const gapSize = Math.max(2, getScaledValue(5));

    if (innerRadius < 0 || middleRadius <= innerRadius + gapSize || outerRadius <= middleRadius + gapSize) {
       console.warn("Chart radii configuration is invalid due to scaling.");
       return;
    }

    const centerX = width / 2;
    const centerY = height / 2;

    // Arc Generators
    const arcInner = d3
      .arc<PieArcDatum<InnerDataItem>>()
      .innerRadius(innerRadius)
      .outerRadius(middleRadius - gapSize / 2);

    const arcOuter = d3
      .arc<PieArcDatum<DataItem>>()
      .innerRadius(middleRadius + gapSize / 2)
      .outerRadius(outerRadius);

    // Pie Generators
    const pieInnerGenerator = d3
      .pie<InnerDataItem>()
      .sort(null)
      .value((d) => d.value);
    const innerData = pieInnerGenerator([
      { key: "Therapy", value: totals.Therapy },
      { key: "Diagnosis", value: totals.Diagnosis },
    ]);

    const therapyOncology = data.find(
      (d) => d.category === "Therapy" && d.subcategory === "Oncology",
    );
    const diagnosisSegments = data
      .filter((d) => d.category === "Diagnosis")
      .sort((a, b) => b.count - a.count);
    const outerPieDataInput: DataItem[] = therapyOncology
      ? [therapyOncology, ...diagnosisSegments]
      : [...diagnosisSegments];

    const pieOuterGenerator = d3
      .pie<DataItem>()
      .sort(null)
      .value((d) => d.count);
    const outerData = pieOuterGenerator(outerPieDataInput);

    // Helper function to get color for outer segments with proper opacity
    const getOuterSegmentColor = (d: PieArcDatum<DataItem>): string => {
      const isTherapy = d.data.category === "Therapy";
      if (isTherapy) return colorMap.Therapy;
      
      // For diagnosis segments, find index in sorted diagnosis segments array
      const diagIndex = diagnosisSegments.findIndex(
        (seg) => seg.subcategory === d.data.subcategory
      );
      
      return getSubcategoryColor("Diagnosis", d.data.subcategory, diagIndex);
    };

    const g = svg
      .append("g")
      .attr("transform", `translate(${centerX}, ${centerY})`); // Centered without title offset

    // Draw Inner arcs with animation - only animate if hasAnimated is false
    g.selectAll(".arc-inner")
      .data(innerData)
      .join("path")
      .attr("class", "arc-inner")
      .attr("d", arcInner)
      .attr("fill", (d) => colorMap[d.data.key])
      .style("opacity", hasAnimated ? 1 : 0)
      .transition()
      .duration(hasAnimated ? 0 : 800)
      .delay((_, i) => hasAnimated ? 0 : 300 + i * 150)
      .style("opacity", 1);

    // Draw Outer arcs with animation - only animate if hasAnimated is false
    g.selectAll(".arc-outer")
      .data(outerData)
      .join("path")
      .attr("class", "arc-outer")
      .attr("d", arcOuter)
      .attr("fill", (d) => getOuterSegmentColor(d))
      .style("opacity", hasAnimated ? 1 : 0)
      .transition()
      .duration(hasAnimated ? 0 : 800)
      .delay((_, i) => hasAnimated ? 0 : 600 + i * 100)
      .style("opacity", 1);

    // Labels - Inner Arc Numbers - REDUCED SIZE
    g.selectAll(".inner-label")
      .data(innerData)
      .join("text")
      .attr("class", "inner-label")
      .attr(
        "transform",
        (d) => `translate(${arcInner.centroid(d)})`,
      )
      .attr("dy", "0.35em")
      .text((d) => d.data.value)
      .attr("fill", "#ffffff") // white
      .attr("text-anchor", "middle")
      .style("font-size", `${Math.min(24, Math.max(18, getScaledValue(22)))}px`) // REDUCED SIZE
      .style("font-weight", "700")
      .style("font-family", "'Helvetica Now Display', sans-serif")
      .style("pointer-events", "none")
      .style("opacity", hasAnimated ? 1 : 0)
      .transition()
      .duration(hasAnimated ? 0 : 600)
      .delay((_, i) => hasAnimated ? 0 : 900 + i * 150)
      .style("opacity", 1);

    // Labels - Outer Arc Numbers - REDUCED SIZE
    g.selectAll(".outer-number-label")
      .data(outerData.filter((d) => d.data.count > 0))
      .join("text")
      .attr("class", "outer-number-label")
      .attr(
        "transform",
        (d) => `translate(${arcOuter.centroid(d)})`,
      )
      .attr("dy", "0.35em")
      .text((d) => d.data.count)
      .attr("fill", "#ffffff") // white
      .attr("text-anchor", "middle")
      .style("font-size", `${Math.min(20, Math.max(14, getScaledValue(18)))}px`) // REDUCED SIZE
      .style("font-weight", "700")
      .style("font-family", "'Helvetica Now Display', sans-serif")
      .style("pointer-events", "none")
      .style("opacity", hasAnimated ? 1 : 0)
      .transition()
      .duration(hasAnimated ? 0 : 600)
      .delay((_, i) => hasAnimated ? 0 : 1000 + i * 100)
      .style("opacity", 1);

    // Labels - Outer Arc Subcategories with Polylines
    // Further improve spacing to prevent bleeding into text
    const polylineOuterRadius = outerRadius + getScaledValue(45); // Further increased
    const polylineHorizontalLength = getScaledValue(35); // Further increased
    const labelPadding = getScaledValue(12); // Increased padding for labels
    
    // Calculate visible chart area to constrain label placement
    const maxLabelDistance = width / 2 - getScaledValue(20);

    // Improved label drawing function with better positioning
    const drawLabels = () => {
      // Pre-calculate label widths to adjust positioning
      const textWidths = new Map();
      const tempTexts = outerData.filter(d => d.data.count > 0).map((d, i) => {
        const tempText = g.append("text")
          .attr("class", "temp-measure")
          .text(d.data.subcategory)
          .style("font-size", `${Math.min(16, Math.max(12, getScaledValue(14)))}px`); // REDUCED SIZE to match actual labels
        
        const width = tempText.node()?.getBBox().width || 0;
        textWidths.set(i, width);
        return tempText;
      });
      
      // Remove temp measurement texts
      tempTexts.forEach(t => t.remove());
      
      // Now draw the actual labels with improved positioning
      outerData.filter(d => d.data.count > 0).forEach((d, i) => {
        if (!svgRef.current) return;
        
        const angle = (d.startAngle + d.endAngle) / 2;
        const adjustedAngle = angle - Math.PI / 2;
        const cosAngle = Math.cos(adjustedAngle);
        const sinAngle = Math.sin(adjustedAngle);

        // Improved positioning for better layout
        const polylineStartPoint = [
          cosAngle * (outerRadius + 2),
          sinAngle * (outerRadius + 2)
        ];
        
        // Calculate radial endpoint based on text width to avoid overflow
        const textWidth = textWidths.get(i) || 0;
        const isRightSide = cosAngle >= 0;
        
        // Adjust the radial line length based on available space
        const adjustedRadius = Math.min(
          polylineOuterRadius,
          maxLabelDistance - (isRightSide ? textWidth + labelPadding : 0)
        );
        
        const radialEndPoint = [
          cosAngle * adjustedRadius,
          sinAngle * adjustedRadius,
        ];
        
        // Improve horizontal positioning based on left/right side
        const horizontalLength = isRightSide ? polylineHorizontalLength : -polylineHorizontalLength;
        
        const horizontalEndPoint = [
          radialEndPoint[0] + horizontalLength,
          radialEndPoint[1],
        ];
        
        const points = `${polylineStartPoint[0]},${polylineStartPoint[1]} ${radialEndPoint[0]},${radialEndPoint[1]} ${horizontalEndPoint[0]},${horizontalEndPoint[1]}`;
        
        // Create polyline with or without animation
        const polyline = g.append("polyline")
          .attr("class", "outer-label-line")
          .attr("points", points)
          .attr("stroke", getOuterSegmentColor(d))
          .attr("stroke-width", 1.5)
          .attr("fill", "none");
          
        if (!hasAnimated) {
          polyline.style("opacity", 0)
            .transition()
            .duration(400)
            .delay(1200 + i * 100)
            .style("opacity", 1);
        }
          
        // Calculate improved text position
        const textX = horizontalEndPoint[0] + (isRightSide ? labelPadding : -labelPadding);
        
        // Create label with or without animation
        const text = g.append("text")
          .attr("class", "outer-label-text")
          .attr("transform", `translate(${textX}, ${horizontalEndPoint[1]})`)
          .attr("dy", "0.35em")
          .text(d.data.subcategory)
          .attr("fill", getOuterSegmentColor(d))
          .style("font-size", `${Math.min(16, Math.max(12, getScaledValue(14)))}px`) // REDUCED SIZE
          .style("font-family", "'Helvetica Now Display', sans-serif")
          .style("text-anchor", isRightSide ? "start" : "end")
          .style("pointer-events", "none");
          
        if (!hasAnimated) {
          text.style("opacity", 0)
            .transition()
            .duration(400)
            .delay(1300 + i * 100)
            .style("opacity", 1);
        }
      });
    };

    // Execute label drawing immediately if already animated
    if (hasAnimated) {
      drawLabels();
    } else {
      // Otherwise delay for animation
      setTimeout(drawLabels, 1200);
    }

    // Center Labels - REDUCED SIZE
    g.selectAll(".center-label").remove();
    const centerLabelFontSize = Math.min(22, Math.max(16, getScaledValue(20))); // REDUCED SIZE
    const centerVerticalOffset = getScaledValue(30); // Increased offset
    
    const therapyLabel = g.append("text")
      .attr("class", "center-label")
      .attr("x", 0)
      .attr("y", -centerVerticalOffset)
      .attr("text-anchor", "middle")
      .style("fill", colorMap.Therapy)
      .style("font-size", centerLabelFontSize + "px")
      .style("font-weight", "700")
      .style("font-family", "'Helvetica Now Display', sans-serif")
      .text("Therapy");
      
    const diagnosisLabel = g.append("text")
      .attr("class", "center-label")
      .attr("x", 0)
      .attr("y", centerVerticalOffset)
      .attr("text-anchor", "middle")
      .style("fill", colorMap.Diagnosis)
      .style("font-size", centerLabelFontSize + "px")
      .style("font-weight", "700")
      .style("font-family", "'Helvetica Now Display', sans-serif")
      .text("Diagnosis");
    
    // Only animate if we haven't done it before
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

  }, [data, totals, colorMap, getSubcategoryColor, dimensions, getScaledValue, hasAnimated]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Title as HTML element - RIGHT ALIGNED with gray body text */}
      <div className="w-full text-right mb-4">
        <span className="text-body font-helvetica-now text-grey">
          Approved therapeutic and diagnostic agents divided by type of diseases
        </span>
        <span 
          className="text-body-small font-helvetica-now text-primary-blue"
          style={{ verticalAlign: 'super', marginLeft: '2px' }}
        >
          [1]
        </span>
      </div>
      
      {/* Chart container */}
      <motion.div
        ref={containerRef}
        className="w-full flex-grow relative flex justify-center items-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 15, 
          duration: 0.8, 
          delay: 0.2 
        }}
      >
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          className="block mx-auto overflow-visible"
        />
      </motion.div>
      
      {/* Legend as HTML elements with small-body text style - RIGHT ALIGNED */}
      <div className="w-full flex justify-end space-x-12 mt-4 pr-8">
        <div className="flex items-center">
          <div 
            style={{ 
              width: '10px', 
              height: '10px', 
              backgroundColor: '#0000ff', 
              marginRight: '4px' 
            }} 
          />
          <span className="text-body-small font-helvetica-now text-black">
            Therapy
          </span>
        </div>
        <div className="flex items-center">
          <div 
            style={{ 
              width: '10px', 
              height: '10px', 
              backgroundColor: '#6f608f', 
              marginRight: '4px' 
            }} 
          />
          <span className="text-body-small font-helvetica-now text-black">
            Diagnosis
          </span>
        </div>
      </div>
    </div>
  );
};

export default DonutChart;