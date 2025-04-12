import React from "react";
import styles from "@/theme/components";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Simple information icon component
const InfoIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg"
    width="14" 
    height="14" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="ml-2 text-gray-400"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="8"></line>
    <line x1="12" y1="12" x2="12" y2="16"></line>
  </svg>
);

// Base table component
export const Table = ({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode; 
  className?: string 
}) => (
  <div className="w-full overflow-x-auto">
    <table className={`w-full border-collapse ${className}`}>{children}</table>
  </div>
);

// Table header component
export const TableHeader = ({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode; 
  className?: string 
}) => (
  <thead className={`bg-gray-50 sticky top-0 z-10 ${className}`}>{children}</thead>
);

// Table body component
export const TableBody = ({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode; 
  className?: string 
}) => (
  <tbody className={`bg-white divide-y divide-gray-200 ${className}`}>{children}</tbody>
);

// Table row component - simplified, removed isHeader as we'll use TableHeader consistently
export const TableRow = ({ 
  children, 
  className = ""
}: { 
  children: React.ReactNode; 
  className?: string;
}) => (
  <tr className={`border-b hover:bg-gray-50 ${className}`}>{children}</tr>
);

// Table header cell component
export const TableHead = ({ 
  children, 
  className = "",
  align = "left" 
}: { 
  children: React.ReactNode; 
  className?: string;
  align?: "left" | "center" | "right";
}) => {
  const alignmentClass = 
    align === "left" ? "text-left" : 
    align === "right" ? "text-right" : "text-center";

  return (
    <th className={`p-3 ${styles.typography.bodySmall("font-bold")} text-gray-700 tracking-wider ${alignmentClass} border-r last:border-r-0 ${className}`}>
      {children}
    </th>
  );
};

// Table cell component
export const TableCell = ({ 
  children, 
  className = "",
  align = "left",
  hasTooltip = false,
  tooltipContent = null,
  tooltipSide = "top"
}: { 
  children: React.ReactNode; 
  className?: string;
  align?: "left" | "center" | "right";
  hasTooltip?: boolean;
  tooltipContent?: React.ReactNode;
  tooltipSide?: "top" | "bottom" | "left" | "right";
}) => {
  const alignmentClass = 
    align === "left" ? "text-left" : 
    align === "right" ? "text-right" : "text-center";

  // Check if the child is a number to apply special styling
  const isNumeric = typeof children === 'number' || 
                    (typeof children === 'string' && !isNaN(Number(children)));
  
  // For tooltip cells with numeric content
  if (hasTooltip && tooltipContent && isNumeric) {
    return (
      <td className={`p-3 ${styles.typography.bodySmall()} ${alignmentClass} border-r last:border-r-0 ${className}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-gray-200 text-gray-800 cursor-help">
              <span>{children}</span>
              <InfoIcon />
            </span>
          </TooltipTrigger>
          <TooltipContent 
            className="bg-white text-black p-0 rounded-md max-w-xs z-50 border border-light-grey shadow-none overflow-hidden" 
            side={tooltipSide} 
            align="center"
          >
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      </td>
    );
  }
  
  // For tooltip cells with non-numeric content
  if (hasTooltip && tooltipContent) {
    return (
      <td className={`p-3 ${styles.typography.bodySmall()} ${alignmentClass} border-r last:border-r-0 ${className}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-help inline-flex items-center">
              <span>{children}</span>
              <InfoIcon />
            </span>
          </TooltipTrigger>
          <TooltipContent 
            className="bg-white text-black p-0 rounded-md max-w-xs z-50 border border-light-grey shadow-none overflow-hidden" 
            side={tooltipSide} 
            align="center"
          >
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      </td>
    );
  }
  
  // For regular cells
  return (
    <td className={`p-3 ${styles.typography.bodySmall()} ${alignmentClass} border-r last:border-r-0 ${className}`}>
      {children}
    </td>
  );
};

// Wrapper component for full table with tooltip provider
export const TableWithTooltips = ({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <TooltipProvider delayDuration={100}>
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      <div className="max-h-[600px] overflow-y-auto">
        {children}
      </div>
    </div>
  </TooltipProvider>
);

// TooltipList component for displaying lists in tooltips - without borders
export const TooltipList = ({
  items = []
}: {
  items: string[];
}) => (
  <div className="w-full">
    <ul className="max-h-40 overflow-y-auto w-full">
      {items.length > 0 ? (
        items.map((item, i) => (
          <li key={i} className="w-full">
            <div className="px-3 py-2 text-body-small">{item}</div>
          </li>
        ))
      ) : (
        <li>
          <div className="px-3 py-2 text-body-small text-grey">No items to display</div>
        </li>
      )}
    </ul>
  </div>
);

// Export all table components
export default {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableWithTooltips,
  TooltipList
}; 