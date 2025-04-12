"use client";

import React, { useState } from 'react';
import { Tabs, GridIcon, TableIcon } from '@/components/ui';

/**
 * Example component showing how to use the improved Tabs component
 * - Tabs now have a scale animation for active state
 * - Container width adapts based on whether icon tabs are present
 * - Tabs are spaced naturally without stretching
 */
const TabsExample: React.FC = () => {
  // Define state for tab selections
  const [activeDataType, setActiveDataType] = useState('clinical');
  const [activeViewMode, setActiveViewMode] = useState('grid');

  // Define the tabs data
  const dataTabs = [
    { id: 'clinical', label: 'Clinical Trials' },
    { id: 'phase1', label: 'Phase 1' },
    { id: 'phase2', label: 'Phase 2' },
    { id: 'phase3', label: 'Phase 3' },
  ];

  const viewModeTabs = [
    { id: 'grid', icon: <GridIcon />, ariaLabel: 'Grid View' },
    { id: 'table', icon: <TableIcon />, ariaLabel: 'Table View' },
  ];

  // Handle tab changes
  const handleDataTypeChange = (tabId: string) => {
    setActiveDataType(tabId);
    console.log(`Data type changed to: ${tabId}`);
    // Add your logic here based on tab change
  };

  const handleViewModeChange = (tabId: string) => {
    setActiveViewMode(tabId);
    console.log(`View mode changed to: ${tabId}`);
    // Add your logic here based on view mode change
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Enhanced Tabs Component</h2>
      <p className="mb-6">This updated tabs component includes several improvements:</p>
      <ul className="list-disc pl-6 mb-6">
        <li>Smooth transition animations with scale effect for active tabs</li>
        <li>Adaptive width - container only stretches full-width when needed</li>
        <li>Tabs maintain natural spacing rather than stretching</li>
        <li>Clean separation between title tabs and icon tabs when both are present</li>
      </ul>
      
      {/* Tabs component with both title and icon tabs - takes full width */}
      <div className="mb-10 p-6 border rounded-lg bg-white shadow-sm">
        <h3 className="text-xl font-bold mb-4">Title Tabs with Icon Tabs</h3>
        <p className="mb-4 text-gray-600">When both title and icon tabs are present, the container spans full width with icon tabs aligned to the right.</p>
        <Tabs
          titleTabs={dataTabs}
          iconTabs={viewModeTabs}
          defaultTitleTab={activeDataType}
          defaultIconTab={activeViewMode}
          onTitleTabChange={handleDataTypeChange}
          onIconTabChange={handleViewModeChange}
          className="mb-6"
        />
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <p className="text-sm text-gray-600">Notice how the tabs container spans the full width, with icons right-aligned</p>
        </div>
      </div>

      {/* Example with only title tabs - takes only needed width */}
      <div className="mb-10 p-6 border rounded-lg bg-white shadow-sm">
        <h3 className="text-xl font-bold mb-4">Title Tabs Only</h3>
        <p className="mb-4 text-gray-600">Without icon tabs, the container takes only as much width as needed by the tabs.</p>
        <Tabs
          titleTabs={dataTabs}
          defaultTitleTab={activeDataType}
          onTitleTabChange={handleDataTypeChange}
          className="mb-6"
        />
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <p className="text-sm text-gray-600">The container width adjusts to fit only the tabs, not stretching unnecessarily</p>
        </div>
      </div>

      {/* Show how it looks with longer labels */}
      <div className="mb-10 p-6 border rounded-lg bg-white shadow-sm">
        <h3 className="text-xl font-bold mb-4">Longer Tab Labels</h3>
        <p className="mb-4 text-gray-600">Tabs adapt to their content size with natural spacing between them.</p>
        <Tabs
          titleTabs={[
            { id: 'overview', label: 'Market Overview' },
            { id: 'analysis', label: 'Detailed Analysis' },
            { id: 'forecast', label: 'Future Forecast' },
            { id: 'recommendations', label: 'Recommendations' },
          ]}
          defaultTitleTab="overview"
          className="mb-6"
        />
        <div className="mt-4 p-3 bg-gray-50 rounded">
          <p className="text-sm text-gray-600">Even with longer labels, tabs maintain comfortable spacing without stretching</p>
        </div>
      </div>

      {/* Conditional content based on active tabs */}
      <div className="border p-6 rounded-lg bg-white shadow-sm">
        <h3 className="text-xl font-bold mb-4">Interactive Example</h3>
        <p className="mb-4 text-gray-600">Try selecting different tabs in the examples above to see the animation effect.</p>
        <div className="bg-blue-50 p-4 rounded border border-blue-100">
          <p className="font-semibold mb-2">Current Selection:</p>
          <p>Data Type: <span className="font-medium text-blue-700">{activeDataType}</span></p>
          <p>View Mode: <span className="font-medium text-blue-700">{activeViewMode}</span></p>
        </div>
      </div>
    </div>
  );
};

export default TabsExample; 