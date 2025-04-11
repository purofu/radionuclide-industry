// components/RadiotherapyChart.tsx
"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface ChartData {
  group: string;
  '2013_co': number;
  '2013_linac': number;
  '2023_co': number;
  '2023_linac': number;
}

const data: ChartData[] = [
  {
    group: "High-income countries",
    '2013_co': 0.05, '2013_linac': 1.26,
    '2023_co': 0.01, '2023_linac': 1.11,
  },
  {
    group: "Upper-middle-income countries",
    '2013_co': 0.15, '2013_linac': 0.38,
    '2023_co': 0.07, '2023_linac': 0.52,
  },
  {
    group: "Lower-middle-income countries",
    '2013_co': 0.22, '2013_linac': 0.24,
    '2023_co': 0.15, '2023_linac': 0.34,
  },
  {
    group: "Low-income countries",
    // Clamping LINAC 2013 value to 0 as -0.02 is likely an anomaly/rounding issue
    '2013_co': 0.07, '2013_linac': 0,
    '2023_co': 0.04, '2023_linac': 0.08,
  },
];

const RadiotherapyChart: React.FC = () => {
  const d3Container = useRef<SVGSVGElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 450 }); // Default height

  // --- Color Definitions (using descriptive names for clarity) ---
  const colors = {
    co_2013: '#FDEEC9',    // pale yellow
    linac_2013: '#A8D8E4', // light blue
    co_2023: '#D2B48C',    // light brown (tan)
    linac_2023: '#A092B1', // muted purple
    axis: '#888888',       // Grey for axis lines/text
    label: '#333333',      // Darker grey/black for labels
    benchmark: '#888888',  // Grey for benchmark line
  };

  // --- Resize Observer ---
  useEffect(() => {
    const updateDimensions = () => {
      if (d3Container.current) {
        const parentWidth = d3Container.current.parentElement?.clientWidth || 600;
        setDimensions({ width: parentWidth, height: 450 }); // Keep height fixed or make it dynamic too
      }
    };

    // Initial dimensions
    updateDimensions();

    // Use ResizeObserver for better performance than window resize
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (d3Container.current?.parentElement) {
        resizeObserver.observe(d3Container.current.parentElement);
    }

    // Cleanup observer on component unmount
    return () => {
        resizeObserver.disconnect();
    };
  }, []); // Empty dependency array means this runs once on mount to set up observer


  // --- D3 Drawing Logic ---
  useEffect(() => {
    if (d3Container.current && dimensions.width > 0) {
      const svg = d3.select(d3Container.current);
      svg.selectAll("*").remove(); // Clear previous renders

      const margin = { top: 40, right: 50, bottom: 80, left: 60 }; // Increased bottom margin for labels
      const width = dimensions.width - margin.left - margin.right;
      const height = dimensions.height - margin.top - margin.bottom;

      const chart = svg
        .attr('width', dimensions.width)
        .attr('height', dimensions.height)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      // --- Scales ---
      const groups = data.map(d => d.group);
      const years = ['2013', '2023'];

      const xScale = d3.scaleBand()
        .domain(groups)
        .range([0, width])
        .padding(0.3); // Padding between income groups

      const xSubgroupScale = d3.scaleBand()
        .domain(years)
        .range([0, xScale.bandwidth()])
        .padding(0.1); // Padding between 2013 and 2023 bars within a group

      const maxYValue = d3.max(data, d => Math.max(
        d['2013_co'] + d['2013_linac'],
        d['2023_co'] + d['2023_linac']
      )) || 1.4; // Fallback max value

      const yScale = d3.scaleLinear()
        .domain([0, Math.max(1.1, maxYValue * 1.1)]) // Ensure domain includes 1.0 and has some headroom
        .range([height, 0]);

      // --- Axes ---
      const xAxis = d3.axisBottom(xScale)
          .tickSize(0) // Remove tick marks
          .tickPadding(10); // Padding between ticks and labels

      const xAxisGroup = chart.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis)
        .selectAll("text") // Select generated text labels
          .style("text-anchor", "middle")
          // Basic text wrapping (adjust width tolerance as needed)
          .call(wrapText, xScale.bandwidth() + 20); // Allow slightly wider than bar group

      xAxisGroup.select(".domain").remove(); // Remove x-axis line


      const yAxis = d3.axisLeft(yScale)
        .ticks(6) // Suggest number of ticks
        .tickSize(-width) // Extend ticks into grid lines
        .tickPadding(10);

      const yAxisGroup = chart.append('g')
        .call(yAxis);

       // Style grid lines
      yAxisGroup.selectAll('.tick line')
          .attr('stroke', colors.axis)
          .attr('stroke-dasharray', '2,2'); // Make grid lines dashed

      yAxisGroup.select(".domain").remove(); // Remove y-axis line

       // Style axis text
       xAxisGroup.selectAll('text').style('fill', colors.axis).attr('class', 'font-helvetica-now text-xs'); // Apply Tailwind/CSS class if needed
       yAxisGroup.selectAll('text').style('fill', colors.axis).attr('class', 'font-helvetica-now text-xs'); // Apply Tailwind/CSS class if needed


      // Y-axis Label
      chart.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left + 5) // Position to the left of the axis
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em") // Adjust vertical alignment
          .style("text-anchor", "middle")
          .style("font-size", "12px")
          .style("fill", colors.label)
          .attr('class', 'font-helvetica-now') // Apply Tailwind/CSS class if needed
          .text("Number of units per 500 patients needing radiotherapy");


      // --- Benchmark Line ---
      chart.append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', yScale(1.0))
        .attr('y2', yScale(1.0))
        .attr('stroke', colors.benchmark)
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '4,4'); // Dotted line style

      // --- Bars ---
      const group = chart.selectAll('.group')
        .data(data)
        .enter().append('g')
        .attr('class', 'group')
        .attr('transform', d => `translate(${xScale(d.group)},0)`);

      // 2013 Bars (Stacked)
      const bars2013 = group.append('g').attr('transform', `translate(${xSubgroupScale('2013')},0)`);

      bars2013.selectAll('.linac2013')
        .data(d => [d])
        .enter().append('rect')
        .attr('class', 'linac2013')
        .attr('x', 0)
        .attr('y', d => yScale(d['2013_linac']))
        .attr('width', xSubgroupScale.bandwidth())
        .attr('height', d => height - yScale(d['2013_linac']))
        .attr('fill', colors.linac_2013);

      bars2013.selectAll('.co2013')
        .data(d => [d])
        .enter().append('rect')
        .attr('class', 'co2013')
        .attr('x', 0)
        .attr('y', d => yScale(d['2013_linac'] + d['2013_co']))
        .attr('width', xSubgroupScale.bandwidth())
        .attr('height', d => yScale(d['2013_linac']) - yScale(d['2013_linac'] + d['2013_co']))
        .attr('fill', colors.co_2013);

       // 2013 Labels
      bars2013.selectAll('.label-linac2013')
          .data(d => [d])
          .enter().append('text')
          .attr('class', 'label-linac2013 font-helvetica-now text-xs') // Style labels
          .attr('x', xSubgroupScale.bandwidth() / 2)
          .attr('y', d => yScale(d['2013_linac'] / 2)) // Position roughly in middle of LINAC bar
          .attr('dy', '0.35em')
          .attr('text-anchor', 'middle')
          .style('fill', colors.label)
          .text(d => d['2013_linac'] > 0.01 ? d['2013_linac'].toFixed(2) : ''); // Show only if significant

      bars2013.selectAll('.label-co2013')
          .data(d => [d])
          .enter().append('text')
           .attr('class', 'label-co2013 font-helvetica-now text-xs') // Style labels
          .attr('x', xSubgroupScale.bandwidth() / 2)
          .attr('y', d => yScale(d['2013_linac'] + d['2013_co'] / 2)) // Position roughly in middle of Co bar
          .attr('dy', '0.35em')
          .attr('text-anchor', 'middle')
          .style('fill', colors.label)
          .text(d => d['2013_co'] > 0.01 ? d['2013_co'].toFixed(2) : ''); // Show only if significant


      // 2023 Bars (Stacked)
      const bars2023 = group.append('g').attr('transform', `translate(${xSubgroupScale('2023')},0)`);

      bars2023.selectAll('.linac2023')
        .data(d => [d])
        .enter().append('rect')
        .attr('class', 'linac2023')
        .attr('x', 0)
        .attr('y', d => yScale(d['2023_linac']))
        .attr('width', xSubgroupScale.bandwidth())
        .attr('height', d => height - yScale(d['2023_linac']))
        .attr('fill', colors.linac_2023);

      bars2023.selectAll('.co2023')
        .data(d => [d])
        .enter().append('rect')
        .attr('class', 'co2023')
        .attr('x', 0)
        .attr('y', d => yScale(d['2023_linac'] + d['2023_co']))
        .attr('width', xSubgroupScale.bandwidth())
        .attr('height', d => yScale(d['2023_linac']) - yScale(d['2023_linac'] + d['2023_co']))
        .attr('fill', colors.co_2023);

       // 2023 Labels
      bars2023.selectAll('.label-linac2023')
          .data(d => [d])
          .enter().append('text')
           .attr('class', 'label-linac2023 font-helvetica-now text-xs') // Style labels
          .attr('x', xSubgroupScale.bandwidth() / 2)
          .attr('y', d => yScale(d['2023_linac'] / 2)) // Position roughly in middle of LINAC bar
          .attr('dy', '0.35em')
          .attr('text-anchor', 'middle')
          .style('fill', colors.label)
          .text(d => d['2023_linac'] > 0.01 ? d['2023_linac'].toFixed(2) : ''); // Show only if significant

      bars2023.selectAll('.label-co2023')
          .data(d => [d])
          .enter().append('text')
           .attr('class', 'label-co2023 font-helvetica-now text-xs') // Style labels
          .attr('x', xSubgroupScale.bandwidth() / 2)
          .attr('y', d => yScale(d['2023_linac'] + d['2023_co'] / 2)) // Position roughly in middle of Co bar
          .attr('dy', '0.35em')
          .attr('text-anchor', 'middle')
          .style('fill', colors.label)
          .text(d => d['2023_co'] > 0.01 ? d['2023_co'].toFixed(2) : ''); // Show only if significant

    }
  }, [data, dimensions, colors]); // Redraw chart if data or dimensions change

   // --- Legend (Using simple div structure outside SVG for easier styling) ---
   const legendItems = [
       { year: '2013', label: '⁶⁰Co units', color: colors.co_2013 },
       { year: '2013', label: 'LINACs', color: colors.linac_2013 },
       { year: '2023', label: '⁶⁰Co units', color: colors.co_2023 },
       { year: '2023', label: 'LINACs', color: colors.linac_2023 },
   ];

  return (
    <div className="w-full">
       {/* Legend */}
      <div className="flex flex-wrap justify-center md:justify-end gap-x-4 gap-y-1 mb-4 px-4 md:px-0">
          {legendItems.map(item => (
              <div key={`${item.year}-${item.label}`} className="flex items-center space-x-2">
                  <span className="text-xs font-helvetica-now text-grey mr-1">{item.year}</span>
                  <span style={{ backgroundColor: item.color }} className="w-3 h-3 inline-block border border-gray-300"></span>
                  <span className="text-xs font-helvetica-now text-black">{item.label}</span>
              </div>
          ))}
      </div>
      {/* SVG Container */}
      <div className='relative w-full'>
          <svg ref={d3Container} style={{ display: 'block', width: '100%' }}/>
      </div>
    </div>
  );
};

// Helper function for wrapping text (adjust as needed)
function wrapText(text: d3.Selection<d3.BaseType | SVGTextElement, unknown, SVGGElement, any>, width: number) {
  text.each(function() {
    // @ts-ignore - D3 `this` context
    const textElement = d3.select(this);
    const words = textElement.text().split(/\s+/).reverse();
    let word;
    let line: string[] = [];
    let lineNumber = 0;
    const lineHeight = 1.1; // ems
    const y = textElement.attr("y");
    const dy = parseFloat(textElement.attr("dy") || "0");
    let tspan = textElement.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");

    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      // @ts-ignore - node() exists
      if (tspan.node().getComputedTextLength() > width && line.length > 1) {
        line.pop(); // remove the word that broke the limit
        tspan.text(line.join(" "));
        line = [word]; // start new line with the removed word
        tspan = textElement.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}


export default RadiotherapyChart;