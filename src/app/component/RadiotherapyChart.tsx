// src/app/component/RadiotherapyChart.tsx
"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Label,
  ReferenceLine,
} from "recharts";

// ----------------------------------------------------------------
//  COLOUR PALETTE  –  original tones
// ----------------------------------------------------------------
const COLORS = {
  co13:    "#FDEEC9", // pale yellow
  linac13: "#A8D8E4", // light blue
  co23:    "#D2B48C", // tan
  linac23: "#A092B1", // muted purple
  grid:    "#E2E8F0", // light grid
  axis:    "#94A3B8", // mid‑grey axis
};

/** ----------------------------------------------------------------
 *  DATA
 *  ---------------------------------------------------------------- */
interface Row {
  group: string;
  "2013_co": number;
  "2013_linac": number;
  "2023_co": number;
  "2023_linac": number;
}

const data: Row[] = [
  {
    group: "High-income",
    "2013_co": 0.05,
    "2013_linac": 1.26,
    "2023_co": 0.01,
    "2023_linac": 1.11,
  },
  {
    group: "Upper-middle",
    "2013_co": 0.15,
    "2013_linac": 0.38,
    "2023_co": 0.07,
    "2023_linac": 0.52,
  },
  {
    group: "Lower-middle",
    "2013_co": 0.22,
    "2013_linac": 0.24,
    "2023_co": 0.15,
    "2023_linac": 0.34,
  },
  {
    group: "Low-income",
    "2013_co": 0.07,
    "2013_linac": 0,
    "2023_co": 0.04,
    "2023_linac": 0.08,
  },
];

/** ----------------------------------------------------------------
 *  CHART  COMPONENT
 *  ---------------------------------------------------------------- */
const RadiotherapyChart: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Bar that grows uniformly for its whole column when active
  const CustomizedBar = (props: any) => {
    const { x, y, width, height, fill, index } = props;
    const isActive = index === activeIndex;
    const scale = isActive ? 1.06 : 1;           // 6 % grow
    const newW = width * scale;
    const newH = height * scale;
    const dx = (newW - width) / 2;               // centre horizontally
    const dy = newH - height;                    // grow upward only
    return (
      <rect
        x={x - dx}
        y={y - dy}
        width={newW}
        height={newH}
        fill={fill}
      />
    );
  };

  return (
    <div className="w-full">
      {/* legend sits *above* the chart for better small-screen layout */}
      <LegendBlock />

      {/* ---------------------  BAR CHART  ------------------------- */}
      <ResponsiveContainer width="100%" aspect={2}>
        <BarChart
          data={data}
          margin={{ top: 8, right: 4, left: 0, bottom: 16 }}
          barCategoryGap="4%"
          barSize={72}
          onMouseMove={(state: any) => {
            if (state.isTooltipActive && state.activeTooltipIndex !== undefined) {
              setActiveIndex(state.activeTooltipIndex);
            } else {
              setActiveIndex(null);
            }
          }}
        >
          {/* x-axis */}
          <XAxis
            dataKey="group"
            tick={{
              className:
                "font-helvetica-now text-body-small fill-slate-600 leading-tight",
            }}
            interval={0}
            tickLine={false}
            axisLine={false}
          />

          {/* y-axis */}
          <YAxis
            tick={{
              className: "font-helvetica-now text-[10px] md:text-[11px] fill-slate-600",
            }}
            domain={[0, 1.5]}
            ticks={[0, 0.5, 1, 1.5]}
            tickLine={false}
            axisLine={false}
            width={24}   /* make the left gutter narrower */
          >
            <Label
              value="Units per 500 patients needing radiotherapy"
              angle={-90}
              position="insideLeft"
              className="font-helvetica-now text-body-small fill-slate-700"
              offset={-6}
            />
          </YAxis>

          {/* 1-to-1 benchmark */}
          <ReferenceLine
            y={1.0}
            stroke="#94A3B8"
            strokeDasharray="4 4"
            strokeWidth={1.5}
          />

          {/* tooltip – styled white, no cursor overlay */}
          <Tooltip
            formatter={(v: number) => v.toFixed(2)}
            cursor={false}
            wrapperStyle={{
              fontFamily: "Helvetica Now, sans-serif",
              fontSize: "0.75rem",
              background: "white",
              border: "1px solid #E5E7EB",
              borderRadius: 4,
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              color: "#374151",
            }}
          />

          {/* 2013 stack */}
          <Bar dataKey="2013_co"    stackId="a" fill={COLORS.co13} shape={CustomizedBar} />
          <Bar dataKey="2013_linac" stackId="a" fill={COLORS.linac13} shape={CustomizedBar} />

          {/* 2023 stack */}
          <Bar dataKey="2023_co"    stackId="b" fill={COLORS.co23} shape={CustomizedBar} />
          <Bar dataKey="2023_linac" stackId="b" fill={COLORS.linac23} shape={CustomizedBar} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

/** ----------------------------------------------------------------
 *  CUSTOM LEGEND  (keeps text sizing responsive with Tailwind)
 *  ---------------------------------------------------------------- */
const LegendBlock = () => {
  const items = [
    { label: "2013  ⁠—  ⁶⁰Co", color: COLORS.co13 },
    { label: "2013  ⁠—  LINAC", color: COLORS.linac13 },
    { label: "2023  ⁠—  ⁶⁰Co", color: COLORS.co23 },
    { label: "2023  ⁠—  LINAC", color: COLORS.linac23 },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mb-2">
      {items.map((it) => (
        <span
          key={it.label}
          className="flex items-center gap-2 font-helvetica-now text-xs md:text-sm text-slate-700"
        >
          <span
            className="inline-block w-3 h-3 rounded-sm border border-slate-300"
            style={{ backgroundColor: it.color }}
          />
          {it.label}
        </span>
      ))}
    </div>
  );
};

export default RadiotherapyChart;