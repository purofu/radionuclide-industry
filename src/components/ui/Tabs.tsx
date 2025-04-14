"use client";

import React, { ReactNode, useState, useRef, useEffect } from "react";

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
 * - On mobile, title tabs become a dropdown menu on the same line as the icon tabs
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

  // State for dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Get active tab label
  const getActiveTabLabel = () => {
    const activeTab = titleTabs.find(tab => tab.id === activeTitleTab);
    return activeTab ? activeTab.label : titleTabs[0]?.label || "Select";
  };

  // Handle title tab click
  const handleTitleTabClick = (tabId: string) => {
    setActiveTitleTab(tabId);
    setIsDropdownOpen(false); // Close dropdown after selection
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
    <div className={`flex flex-row items-center justify-between gap-4 ${className}`}>
      {/* Flex container that adjusts for all screens */}
      <div className={`flex flex-row items-center justify-between ${containerWidthClass}`}>
        {/* Mobile dropdown for title tabs */}
        <div 
          className="bg-[#F9F9F9] rounded-md sm:hidden flex-grow"
          style={{ padding: "4px", borderRadius: "6px" }}
          ref={dropdownRef}
        >
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex justify-between items-center w-full px-3 py-1.5 text-sm font-medium"
          >
            <span>{getActiveTabLabel()}</span>
            <ChevronDownIcon className={`w-4 h-4 ml-2 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute z-50 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
              {titleTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTitleTabClick(tab.id)}
                  className={`w-full text-left px-3 py-2 text-sm ${
                    activeTitleTab === tab.id
                      ? "bg-gray-100 font-medium text-black"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop horizontal tabs (hidden on mobile) */}
        <div 
          className={`hidden sm:inline-flex items-center p-1 bg-[#F9F9F9] rounded-md`}
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
        </div>

        {/* Icon tabs - maintain same positioning on mobile and desktop */}
        {iconTabs && iconTabs.length > 0 && (
          <div className="flex ml-4 bg-[#F9F9F9] rounded-md p-1 sm:ml-auto sm:border-l sm:border-gray-200 sm:pl-2 sm:bg-transparent sm:rounded-none sm:p-0">
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

// ChevronDown icon component for the dropdown
const ChevronDownIcon = ({ className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

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