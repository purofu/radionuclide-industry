"use client";

import React, { ReactNode, useState } from "react";

// Type definitions for tab items
export interface TitleTabItem {
  id: string;
  label: string;
}

export interface IconTabItem {
  id: string;
  icon: ReactNode;
  ariaLabel: string;
}

// Main component props
export interface TabsProps {
  titleTabs: TitleTabItem[];
  iconTabs?: IconTabItem[];
  defaultTitleTab?: string;
  defaultIconTab?: string;
  onTitleTabChange?: (tabId: string) => void;
  onIconTabChange?: (tabId: string) => void;
  className?: string;
}

/**
 * Tabs component with title tabs on left and optional icon tabs on right
 * - Container adapts width based on presence of icon tabs
 * - Active tabs have a smooth scale animation effect
 * - Tabs are spaced naturally without stretching
 */
export const Tabs: React.FC<TabsProps> = ({
  titleTabs,
  iconTabs,
  defaultTitleTab,
  defaultIconTab,
  onTitleTabChange,
  onIconTabChange,
  className = "",
}) => {
  // Set default active tabs or use the first tab in each group
  const [activeTitleTab, setActiveTitleTab] = useState<string>(
    defaultTitleTab || (titleTabs.length > 0 ? titleTabs[0].id : "")
  );
  
  const [activeIconTab, setActiveIconTab] = useState<string>(
    defaultIconTab || (iconTabs && iconTabs.length > 0 ? iconTabs[0].id : "")
  );

  // Handle title tab click
  const handleTitleTabClick = (tabId: string) => {
    setActiveTitleTab(tabId);
    if (onTitleTabChange) {
      onTitleTabChange(tabId);
    }
  };

  // Handle icon tab click
  const handleIconTabClick = (tabId: string) => {
    setActiveIconTab(tabId);
    if (onIconTabChange) {
      onIconTabChange(tabId);
    }
  };

  // Determine if we should use auto width (when no icon tabs) or full width
  const containerWidthClass = (!iconTabs || iconTabs.length === 0) ? 'w-auto' : 'w-full';

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${className}`}>
      <div 
        className={`inline-flex items-center p-1 bg-[#F9F9F9] rounded-md ${containerWidthClass}`}
        style={{ padding: "4px", borderRadius: "6px" }}
      >
        {/* Title tabs (left side) */}
        <div className="flex gap-1">
          {titleTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTitleTabClick(tab.id)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ease-in-out ${
                activeTitleTab === tab.id
                  ? "bg-black text-white transform scale-105"
                  : "text-gray-600 hover:text-black hover:bg-gray-100 hover:transform hover:scale-105"
              }`}
              aria-pressed={activeTitleTab === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Icon tabs (right side) - only shown if provided */}
        {iconTabs && iconTabs.length > 0 && (
          <div className="flex ml-auto border-l border-gray-200 pl-2">
            {iconTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleIconTabClick(tab.id)}
                className={`p-1.5 rounded-md transition-all duration-200 ease-in-out ${
                  activeIconTab === tab.id
                    ? "bg-black text-white transform scale-105"
                    : "text-gray-600 hover:text-black hover:bg-gray-100 hover:transform hover:scale-105"
                }`}
                aria-label={tab.ariaLabel}
                aria-pressed={activeIconTab === tab.id}
              >
                {tab.icon}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Common icons for view modes (grid/table) for convenience
export const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor" />
    <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor" />
    <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor" />
    <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor" />
  </svg>
);

export const TableIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 5H21V7H3V5Z" fill="currentColor" />
    <path d="M3 11H21V13H3V11Z" fill="currentColor" />
    <path d="M3 17H21V19H3V17Z" fill="currentColor" />
  </svg>
);